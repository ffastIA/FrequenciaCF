# Capability: backend-setup

## Purpose

Setup inicial do servidor Node.js/Express do backend FrequenciaCF — configuração de ambiente, pool de conexão MySQL (somente leitura), estrutura de pastas e middleware de erro.

## Requirements

### Requirement: Servidor Express inicializável
O sistema SHALL prover um servidor Express (`backend/server.js`) que inicia via `npm run dev` (nodemon) ou `npm start` (node), escutando na porta definida por `PORT` (default 3000), e que registra middlewares de CORS, JSON e tratamento de erro global.

#### Scenario: Inicialização bem-sucedida
- **WHEN** o comando `npm run dev` é executado com um `.env` válido
- **THEN** o console exibe "Servidor rodando em http://localhost:3000" (ou porta configurada) e o processo não encerra com erro

### Requirement: Configuração de ambiente validada
O sistema SHALL validar, ao iniciar (`backend/config/env.js`), que as variáveis obrigatórias (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) estão definidas, interrompendo a inicialização com mensagem clara caso alguma esteja ausente.

#### Scenario: Variável de ambiente ausente
- **WHEN** o servidor é iniciado sem `DB_PASSWORD` definida no `.env`
- **THEN** o processo falha na inicialização com uma mensagem de erro indicando qual variável está faltando, em vez de falhar silenciosamente numa query posterior

### Requirement: Pool de conexão MySQL somente leitura
O sistema SHALL manter um pool de conexões MySQL (`backend/config/database.js`, via `mysql2/promise`) com no máximo 10 conexões simultâneas (`connectionLimit: 10`), reutilizado por todos os models. O pool SHALL bloquear, em tempo de execução, qualquer query que não comece com `SELECT`/`SHOW`/`EXPLAIN`/`DESCRIBE` — inclusive em conexões obtidas diretamente via `pool.getConnection()` — pois o banco `CentroFormacao` é de produção e a única interação permitida é leitura (ver `CLAUDE.md`).

#### Scenario: Conexão bem-sucedida ao banco
- **WHEN** `backend/config/database.js` é carregado com credenciais válidas de `prod.idear.org.br:41231`
- **THEN** uma conexão do pool pode ser obtida e liberada sem erro (`getConnection()` seguido de `release()`)

#### Scenario: Query de escrita é bloqueada
- **WHEN** qualquer código chama `pool.execute()` (diretamente ou via uma conexão obtida do pool) com uma query `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `ALTER`, `DROP`, `TRUNCATE` ou `REPLACE`
- **THEN** a chamada lança um erro antes de qualquer comunicação com o banco, e nenhuma escrita é executada

### Requirement: Tratamento de erro centralizado
O sistema SHALL capturar erros não tratados em qualquer rota através de um middleware de erro (`backend/middleware/errorHandler.js`), retornando status 500 com corpo JSON `{ erro: "Erro interno do servidor" }`, incluindo `message` detalhada apenas quando `NODE_ENV=development`.

#### Scenario: Erro em uma rota
- **WHEN** uma rota lança uma exceção (ex.: erro de SQL) durante o processamento
- **THEN** a resposta HTTP tem status 500 e corpo `{ erro: "Erro interno do servidor" }`, sem expor detalhes da query ou stack trace quando `NODE_ENV` não é `development`
