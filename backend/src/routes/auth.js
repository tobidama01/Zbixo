const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

function gerarUnidade() {
  return `#${Math.floor(10000 + Math.random() * 90000)}`;
}
function gerarCodigo7() {
  return Math.random().toString(36).substr(2, 7).toUpperCase();
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nome, cpf, whatsapp, dataNascimento, senha } = req.body;

  if (!nome || !cpf || !senha || !dataNascimento) {
    return res.status(400).json({ error: 'Preencha todos os campos.' });
  }

  const cpfClean = cpf.replace(/\D/g, '');
  if (cpfClean.length !== 11) {
    return res.status(400).json({ error: 'CPF inválido.' });
  }

  // Verificar idade mínima 18 anos
  const nasc = new Date(dataNascimento);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  if (hoje.getMonth() < nasc.getMonth() ||
     (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) idade--;
  if (idade < 18) {
    return res.status(400).json({ error: 'Você precisa ter 18 anos ou mais.' });
  }

  try {
    const exists = await pool.query('SELECT id FROM users WHERE cpf = $1', [cpfClean]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'CPF já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 12);
    const unidade = gerarUnidade();
    const codigo = gerarCodigo7();

    const result = await pool.query(`
      INSERT INTO users (nome, cpf, whatsapp, data_nascimento, senha_hash, unidade, codigo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nome, cpf, unidade, codigo, saldo
    `, [nome, cpfClean, whatsapp, dataNascimento, senhaHash, unidade, codigo]);

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, cpf: user.cpf }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { cpf, senha } = req.body;
  if (!cpf || !senha) return res.status(400).json({ error: 'CPF e senha obrigatórios.' });

  const cpfClean = cpf.replace(/\D/g, '');

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE cpf = $1 AND ativo = TRUE', [cpfClean]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'CPF ou senha incorretos.' });
    }

    const user = result.rows[0];
    const senhaOk = await bcrypt.compare(senha, user.senha_hash);
    if (!senhaOk) return res.status(401).json({ error: 'CPF ou senha incorretos.' });

    const token = jwt.sign({ id: user.id, cpf: user.cpf }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id, nome: user.nome, cpf: user.cpf,
        unidade: user.unidade, codigo: user.codigo,
        saldo: parseFloat(user.saldo), mustResetPassword: user.must_reset_password
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;