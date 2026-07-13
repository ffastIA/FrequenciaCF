# FrequenciaCF

Sistema de acompanhamento de frequência do Centro de Formação, sobre o banco `CentroFormacao` (MySQL, produção).

## Conteúdo do projeto

- `metadata.json`, `schema_summary.md` — dump do schema do banco (75 tabelas).
- `IMPLEMENTATION_GUIDE.md` — guia de implementação do backend (Phase 1: Setup + Models).
- `openspec/` — planejamento das changes (proposal/design/specs/tasks) via [OpenSpec](https://github.com/Fission-AI/OpenSpec).
- `backend/` — API Node.js/Express (ver `backend/README.md` e `backend/API.md`).

## Backend

```bash
cd backend
npm install
cp .env.example .env   # preencha as credenciais do banco
npm run dev
```

Detalhes de instalação, configuração e endpoints: [`backend/README.md`](./backend/README.md) e [`backend/API.md`](./backend/API.md).
