const pool = require('./db');

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nome VARCHAR(150) NOT NULL,
        cpf VARCHAR(11) UNIQUE NOT NULL,
        whatsapp VARCHAR(20),
        data_nascimento DATE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        unidade VARCHAR(10) UNIQUE NOT NULL,
        codigo VARCHAR(7) NOT NULL,
        saldo DECIMAL(12,2) DEFAULT 0.00,
        saldo_bonus DECIMAL(12,2) DEFAULT 0.00,
        must_reset_password BOOLEAN DEFAULT FALSE,
        ativo BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS apostas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        codigo VARCHAR(10) UNIQUE NOT NULL,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        tipo VARCHAR(30) NOT NULL,
        descricao TEXT,
        modalidade VARCHAR(50),
        colocacao VARCHAR(50),
        palpites JSONB,
        valor DECIMAL(10,2) NOT NULL,
        multiplicador DECIMAL(10,2),
        fator_colocacao DECIMAL(5,2) DEFAULT 1.0,
        premio DECIMAL(12,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'ativa',
        data_aposta TIMESTAMPTZ DEFAULT NOW(),
        data_resultado TIMESTAMPTZ
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS transacoes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        tipo VARCHAR(20) NOT NULL,
        valor DECIMAL(12,2) NOT NULL,
        taxa DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pendente',
        stripe_payment_intent_id VARCHAR(100),
        stripe_charge_id VARCHAR(100),
        chave_pix VARCHAR(150),
        tipo_chave VARCHAR(30),
        descricao TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS resultados (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        loteria VARCHAR(50) NOT NULL,
        data DATE NOT NULL,
        hora VARCHAR(10),
        numeros JSONB,
        grupos JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(loteria, data, hora)
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_apostas_user_id ON apostas(user_id);
      CREATE INDEX IF NOT EXISTS idx_transacoes_user_id ON transacoes(user_id);
      CREATE INDEX IF NOT EXISTS idx_transacoes_stripe ON transacoes(stripe_payment_intent_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Migrations executadas com sucesso');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Erro nas migrations:', err);
    throw err;
  } finally {
    client.release();
  }
}

runMigrations().catch(() => process.exit(1));