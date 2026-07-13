# Backend FrequenciaCF

Backend Node.js/Express que expõe dados do banco `CentroFormacao` (MySQL, produção) para o dashboard de frequência. Fase 1: setup, models e filtros em cascata. Fase 2: métricas de faltas e de atraso no lançamento de frequência.

> **Somente leitura.** Este backend nunca escreve no banco de dados. `config/database.js` bloqueia em tempo de execução qualquer query que não seja `SELECT`/`SHOW`/`EXPLAIN`/`DESCRIBE`, mesmo por engano em código futuro. Ver regra completa em [`CLAUDE.md`](../CLAUDE.md).

## Instalação

```bash
cd backend
npm install
```

## Configuração

Copie `.env.example` para `.env` e preencha as credenciais do banco:

```bash
cp .env.example .env
```

Variáveis obrigatórias:

| Variável | Descrição |
|---|---|
| `DB_HOST` | Host do MySQL |
| `DB_PORT` | Porta do MySQL |
| `DB_NAME` | Nome do banco (`CentroFormacao`) |
| `DB_USER` | Usuário |
| `DB_PASSWORD` | Senha |
| `PORT` | Porta do servidor Express (default `3000`) |
| `NODE_ENV` | `development` para expor detalhes de erro nas respostas |

**Nunca commite o arquivo `.env`** (já está no `.gitignore`).

## Rodando localmente

```bash
npm run dev   # com reload automático (nodemon)
npm start     # sem reload
```

O servidor sobe em `http://localhost:3000` (ou na porta definida em `PORT`).

## Estrutura de pastas

```
backend/
├── config/       # env.js (validação) e database.js (pool MySQL, guard somente-leitura)
├── models/       # acesso a dados (9 models da Fase 1 + extensões de Frequencia na Fase 2)
├── services/      # FiltroService (cascata de filtros) e MetricasFrequenciaService (faltas/atraso)
├── routes/api/    # rotas REST (filtros.js, metricas.js)
├── middleware/     # errorHandler
├── server.js
└── tests.http
```

## Endpoints

Ver [`API.md`](./API.md).

## Testes

Use `tests.http` (extensão REST Client do VS Code) ou importe as requisições em uma coleção Postman equivalente.
