# FrequenciaCF

Sistema de acompanhamento de frequência do Centro de Formação, sobre o banco `CentroFormacao` (MySQL).

## Conteúdo do projeto

- `metadata.json`, `schema_summary.md` — dump do schema do banco (75 tabelas).
- `IMPLEMENTATION_GUIDE.md` — guia de implementação do backend (Phase 1: Setup + Models).
- `openspec/` — planejamento das changes (proposal/design/specs/tasks) via [OpenSpec](https://github.com/Fission-AI/OpenSpec).
- `backend/` — API Node.js/Express, somente leitura (ver `backend/README.md` e `backend/API.md`).
- `frontend/` — SPA Vite/React (dashboard de turmas e drill-down).

## Backend

O backend precisa de um `.env` com as credenciais do MySQL de produção. Os valores são **criptografados** com [`dotenvx`](https://dotenvx.com) — o `.env` sozinho não expõe a senha.

**Se você já recebeu um `.env` + `.env.keys` prontos** (deploy/handoff):

```bash
cd backend
npm install
# copie backend/.env e backend/.env.keys para dentro de backend/
npm run dev
```

**Se você está configurando pela primeira vez** (tem as credenciais em mãos):

```bash
cd backend
npm install
cp .env.example .env   # preencha as credenciais do banco
npx dotenvx encrypt     # criptografa o .env e gera .env.keys
npm run dev
```

O servidor sobe em `http://localhost:3000`. Detalhes de configuração, deploy e endpoints: [`backend/README.md`](./backend/README.md) e [`backend/API.md`](./backend/API.md).

## Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL aponta para o backend (default http://localhost:3000)
npm run dev
```

A aplicação sobe em `http://localhost:5173` e espera o backend já rodando na URL configurada em `VITE_API_URL`.
