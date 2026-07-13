# Backend FrequenciaCF

Backend Node.js/Express que expõe dados do banco `CentroFormacao` (MySQL, produção) para o dashboard de frequência. Fase 1: setup, models e filtros em cascata. Fase 2: métricas de faltas e de atraso no lançamento de frequência.

> **Somente leitura.** Este backend nunca escreve no banco de dados. `config/database.js` bloqueia em tempo de execução qualquer query que não seja `SELECT`/`SHOW`/`EXPLAIN`/`DESCRIBE`, mesmo por engano em código futuro. Ver regra completa em [`CLAUDE.md`](../CLAUDE.md).

## Instalação

```bash
cd backend
npm install
```

## Configuração

O carregamento de variáveis de ambiente usa [`@dotenvx/dotenvx`](https://dotenvx.com), que criptografa os valores do `.env` (incluindo a senha do MySQL) com um par de chaves pública/privada. O `.env` cifrado pode transitar por qualquer canal sem expor a senha; só a chave privada (`.env.keys`) precisa de um canal seguro.

**Primeira configuração (quem já tem acesso às credenciais):**

```bash
cp .env.example .env
npx dotenvx encrypt   # preencha os valores antes, depois criptografe
```

Isso cifra os valores em `.env` e gera `backend/.env.keys` com a chave privada.

**Recebendo um ambiente já configurado (deploy/handoff):**

Você deve receber **dois arquivos por canais separados**:
- `backend/.env` (cifrado) — pode vir por qualquer meio (e-mail, chat, git).
- `backend/.env.keys` (chave privada) — SÓ deve vir por um canal seguro (cofre de senhas compartilhado, link de segredo único, verbalmente). **Nunca pelo mesmo canal do `.env`.**

Coloque os dois arquivos em `backend/` e siga para "Rodando localmente" — nenhum passo adicional é necessário.

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

**Nunca commite `.env` nem `.env.keys`** (ambos já estão no `.gitignore`).

Se a credencial do MySQL for trocada (rotação), gere um novo par rodando `npx dotenvx encrypt` novamente após atualizar os valores em texto puro, e distribua o novo `.env`/`.env.keys` do mesmo jeito.

Sem `.env.keys` presente (ou com a chave errada), o servidor **falha na inicialização** com uma mensagem indicando quais variáveis não puderam ser decifradas — ele nunca sobe com credenciais inválidas silenciosamente.

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
