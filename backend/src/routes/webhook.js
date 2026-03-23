const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../db');

router.post('/', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook inválido:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Buscar transação pendente
      const txRes = await client.query(
        'SELECT * FROM transacoes WHERE stripe_payment_intent_id = $1 AND status = $2',
        [pi.id, 'pendente']
      );

      if (txRes.rows.length > 0) {
        const tx = txRes.rows[0];

        // Confirmar transação
        await client.query(
          'UPDATE transacoes SET status = $1, updated_at = NOW() WHERE id = $2',
          ['confirmado', tx.id]
        );

        // Creditar saldo
        await client.query(
          'UPDATE users SET saldo = saldo + $1, updated_at = NOW() WHERE id = $2',
          [tx.valor, tx.user_id]
        );

        console.log(`✅ PIX confirmado: R$ ${tx.valor} para user ${tx.user_id}`);
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Erro no webhook:', err);
    } finally {
      client.release();
    }
  }

  res.json({ received: true });
});

module.exports = router;