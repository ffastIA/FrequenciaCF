const REQUIRED_VARS = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

// dotenvx não lança erro quando falta a chave privada para decifrar um .env
// criptografado: ele deixa o valor cifrado (prefixo "encrypted:") vazar como
// string literal em process.env, em vez de falhar. Sem essa checagem, o
// servidor subiria com credenciais de banco inutilizáveis em vez de falhar
// de forma clara na inicialização.
function validateEnv() {
  const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
  const naoDecifradas = REQUIRED_VARS.filter(
    (name) => process.env[name] && process.env[name].startsWith('encrypted:')
  );

  if (missing.length > 0) {
    throw new Error(
      `Variáveis de ambiente obrigatórias ausentes: ${missing.join(', ')}`
    );
  }

  if (naoDecifradas.length > 0) {
    throw new Error(
      `Variáveis de ambiente não puderam ser decifradas (verifique se backend/.env.keys está presente e correto): ${naoDecifradas.join(', ')}`
    );
  }
}

validateEnv();

module.exports = { validateEnv };
