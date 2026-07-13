const mysql = require('mysql2/promise');

const rawPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// Este projeto acessa um banco de produção compartilhado e só tem permissão
// de ler dados. Nenhum código, presente ou futuro, deve poder escrever ou
// alterar o banco — por isso o bloqueio é feito aqui, no ponto único de
// acesso, em vez de confiar que cada model só use SELECT.
const READ_ONLY_PATTERN = /^\s*(SELECT|SHOW|EXPLAIN|DESCRIBE|DESC)\b/i;

function assertReadOnly(sql) {
  if (typeof sql !== 'string' || !READ_ONLY_PATTERN.test(sql)) {
    throw new Error(
      'Operação bloqueada: este projeto permite apenas leitura (SELECT) no banco de dados.'
    );
  }
}

function wrapExecutor(executor) {
  return {
    execute(sql, params) {
      assertReadOnly(sql);
      return executor.execute(sql, params);
    },
    query(sql, params) {
      assertReadOnly(sql);
      return executor.query(sql, params);
    },
  };
}

const pool = {
  ...wrapExecutor(rawPool),
  async getConnection() {
    const connection = await rawPool.getConnection();
    return {
      ...wrapExecutor(connection),
      release: () => connection.release(),
    };
  },
  end: () => rawPool.end(),
};

module.exports = pool;
