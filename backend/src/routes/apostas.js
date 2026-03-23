const router = require('express').Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// POST /api/apostas — registrar aposta
router.post('/', authMiddleware, async (req, res) => {
  const { tipo, descricao, modalidade, colocacao, palpites, valor, multiplicador, fatorColocacao } = req.body;

  if (!valor || valor <= 0) return res.status(400).json({ error: 'Valor inválido.' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar saldo
    const userRes = await client.query('SELECT saldo FROM users WHERE id = $1 FOR UPDATE', [req.user.id]);
    const saldoAtual = parseFloat(userRes.rows[0].saldo);

    if (saldoAtual < valor) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Saldo insuficiente.' });
    }

    // Gerar código único
    const codigo = Math.random().toString(36).substr(2, 7).toUpperCase();

    // Inserir aposta
    const apostaRes = await client.query(`
      INSERT INTO apostas (codigo, user_id, tipo, descricao, modalidade, colocacao, palpites, valor, multiplicador, fator_colocacao)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [codigo, req.user.id, tipo, descricao, modalidade, colocacao,
        JSON.stringify(palpites), valor, multiplicador, fatorColocacao || 1.0]);

    // Debitar saldo
    await client.query(
      'UPDATE users SET saldo = saldo - $1, updated_at = NOW() WHERE id = $2',
      [valor, req.user.id]
    );

    await client.query('COMMIT');

    res.status(201).json({ ok: true, codigo, aposta: apostaRes.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Erro ao registrar aposta.' });
  } finally {
    client.release();
  }
});

// GET /api/apostas — listar apostas do usuário
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM apostas WHERE user_id = $1 ORDER BY data_aposta DESC LIMIT 100',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (_err) {
    res.status(500).json({ error: 'Erro ao buscar apostas.' });
  }
});

module.exports = router;