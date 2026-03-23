const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// POST /api/pagamentos/deposito — gerar QR Code PIX
router.post('/deposito', authMiddleware, async (req, res) => {
  const { valor } = req.body;

  if (!valor || valor < 5) {
    return res.status(400).json({ error: 'Valor mínimo é R$ 5,00.' });
  }

  try {
    const user = await pool.query('SELECT nome, cpf FROM users WHERE id = $1', [req.user.id]);
    const { nome, cpf } = user.rows[0];

    // Criar PaymentIntent com PIX no Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(valor * 100), // Stripe usa centavos
      currency: 'brl',
      payment_method_types: ['pix'],
      payment_method_data: { type: 'pix' },
      confirm: true,
      description: `Recarga ZBIXO — ${nome}`,
      metadata: { user_id: req.user.id, cpf, nome }
    });

    // Salvar transação como pendente
    await pool.query(`
      INSERT INTO transacoes (user_id, tipo, valor, status, stripe_payment_intent_id, descricao)
      VALUES ($1, 'deposito', $2, 'pendente', $3, 'Recarga PIX')
    `, [req.user.id, valor, paymentIntent.id]);

    // Pegar dados do PIX gerado pelo Stripe
    const pixData = paymentIntent.next_action?.pix_display_qr_code;

    res.json({
      paymentIntentId: paymentIntent.id,
      qrCode: pixData?.image_url_png,
      copiaCola: pixData?.data,
      valor,
      expiracao: pixData?.expires_at
    });
  } catch (err) {
    console.error('Stripe PIX error:', err);
    res.status(500).json({ error: 'Erro ao gerar PIX. Tente novamente.' });
  }
});

// POST /api/pagamentos/saque — solicitar saque
router.post('/saque', authMiddleware, async (req, res) => {
  const { valor, chavePix, tipoChave } = req.body;

  if (!valor || valor < 20) return res.status(400).json({ error: 'Saque mínimo é R$ 20,00.' });
  if (valor > 5000)         return res.status(400).json({ error: 'Saque máximo é R$ 5.000,00.' });
  if (!chavePix)            return res.status(400).json({ error: 'Chave PIX obrigatória.' });

  const taxa = valor * 0.01;
  const totalDebitar = valor + taxa;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userRes = await client.query('SELECT saldo FROM users WHERE id = $1 FOR UPDATE', [req.user.id]);
    const saldo = parseFloat(userRes.rows[0].saldo);

    if (saldo < totalDebitar) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Saldo insuficiente.' });
    }

    // Verificar limite diário
    const hoje = new Date().toISOString().split('T')[0];
    const saquesDia = await client.query(`
      SELECT COALESCE(SUM(valor), 0) as total
      FROM transacoes
      WHERE user_id = $1 AND tipo = 'saque' AND DATE(created_at) = $2
        AND status != 'cancelado'
    `, [req.user.id, hoje]);

    const totalHoje = parseFloat(saquesDia.rows[0].total);
    if (totalHoje + valor > 20000) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Limite diário de R$ 20.000,00 atingido.' });
    }

    // Registrar saque
    await client.query(`
      INSERT INTO transacoes (user_id, tipo, valor, taxa, status, chave_pix, tipo_chave, descricao)
      VALUES ($1, 'saque', $2, $3, 'pendente', $4, $5, 'Saque PIX')
    `, [req.user.id, valor, taxa, chavePix, tipoChave]);

    // Debitar saldo
    await client.query(
      'UPDATE users SET saldo = saldo - $1, updated_at = NOW() WHERE id = $2',
      [totalDebitar, req.user.id]
    );

    await client.query('COMMIT');
    res.json({ ok: true, message: 'Saque solicitado! Será processado em até 24h.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao solicitar saque.' });
  } finally {
    client.release();
  }
});

// GET /api/pagamentos/transacoes — histórico
router.get('/transacoes', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM transacoes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (_err) {
    res.status(500).json({ error: 'Erro ao buscar transações.' });
  }
});

module.exports = router;