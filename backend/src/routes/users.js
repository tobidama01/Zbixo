const router = require('express').Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

// GET /api/users/me — busca saldo atualizado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nome, cpf, unidade, codigo, saldo, saldo_bonus FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(result.rows[0]);
  } catch (_err) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

module.exports = router;