## Why

O projeto FrequenciaCF precisa de um backend que exponha os dados do banco `CentroFormacao` (75 tabelas, produção em `prod.idear.org.br`) para um futuro dashboard de frequência. Hoje não existe nenhuma camada de API: apenas o dump de schema (`metadata.json`, `schema_summary.md`) e as credenciais de conexão (`.env`). É preciso um servidor Node.js/Express com acesso a MySQL e um conjunto inicial de modelos e endpoints de filtro em cascata (Projeto → Aditivo → Meta → Turma → Instrutor) para viabilizar as próximas fases (métricas e exportação).

## What Changes

- Criar estrutura `backend/` com Express, pool de conexão MySQL (`mysql2/promise`) e carregamento de variáveis de ambiente validado.
- Adicionar middleware global de tratamento de erros.
- Implementar 9 models de acesso a dados: `Projeto`, `ProjetoAditivo`, `MetaTurma`, `Turma`, `Instrutor`, `Aula`, `Aluno`, `Frequencia`, `Curso`.
- Implementar `FiltroService` com a cascata Projeto → Aditivo → Meta → Turmas → Instrutores, incluindo filtro por `status` (situação) da turma (0: não especificado / 1: não iniciada / 2: iniciada / 3: concluída / 4: cancelada).
- Implementar 5 rotas REST de filtros (`/api/filtros/*`) com validação de parâmetros via Joi.
- Criar testes de integração básicos (`tests.http` ou coleção Postman) e documentação (`backend/README.md`, `backend/API.md`).

## Capabilities

### New Capabilities
- `backend-setup`: Setup inicial do servidor Node.js/Express — configuração de ambiente, pool MySQL, estrutura de pastas e middleware de erro.
- `data-models`: Camada de acesso a dados (9 models) para as entidades Projeto, ProjetoAditivo, MetaTurma, Turma, Instrutor, Aula, Aluno, Frequencia e Curso.
- `filtro-api`: Serviço e endpoints REST de filtros em cascata (Projeto → Aditivo → Meta → Turma → Instrutor), incluindo filtro por situação (status) da turma.

### Modified Capabilities
(nenhuma — não há specs existentes no projeto)

## Impact

- **Novo diretório**: `backend/` (config, models, services, routes, middleware, utils).
- **Dependências novas**: `express`, `mysql2`, `dotenv`, `joi`, `cors`, `nodemon` (dev).
- **Banco de dados**: leitura em produção (`CentroFormacao` em `prod.idear.org.br:41231`); nenhuma migração de schema é feita nesta fase.
- **Segurança**: `.env` de produção não deve ser commitado; `.env.example` deve ser criado como template.
- **Fases futuras dependentes**: Phase 2 (API de Métricas), Phase 3 (Exportação) e o Frontend consumirão os endpoints e models criados aqui.
