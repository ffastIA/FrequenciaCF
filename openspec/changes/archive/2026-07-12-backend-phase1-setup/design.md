## Context

O banco `CentroFormacao` (MySQL, produção) tem 75 tabelas e ~562k linhas na tabela `frequencia`. Não existe backend hoje — apenas o dump de schema e as credenciais em `.env` (ver `metadata.json`, `schema_summary.md`). Esta fase cobre somente a base (servidor, conexão, models e filtros em cascata); métricas e exportação ficam para as fases seguintes.

## Goals / Non-Goals

**Goals:**
- Servidor Express com pool de conexão MySQL estável e reutilizável.
- Camada de models simples (SQL direto via `mysql2/promise`, sem ORM) para as 9 entidades necessárias à cascata de filtros.
- Endpoints REST de filtro em cascata: Projeto → Aditivo → Meta → Turma (com filtro de `status`) → Instrutor.
- Validação de entrada com Joi e tratamento de erro centralizado.
- Base testável localmente contra o banco de produção (somente leitura).

**Non-Goals:**
- Cálculo de métricas de frequência (Phase 2).
- Exportação Excel/PDF (Phase 3).
- Autenticação/autorização de usuários (fora de escopo desta fase).
- Escrita/alteração de dados no banco (todas as queries são `SELECT`).

## Decisions

1. **SQL direto em vez de ORM (Sequelize/Prisma)**: o schema tem 75 tabelas legadas com nomes e convenções inconsistentes; mapear tudo em um ORM adicionaria overhead sem necessidade para esta fase, que só precisa de ~15 queries bem definidas. Alternativa considerada: Sequelize — descartada por custo de setup/mapeamento maior que o benefício nesta fase inicial.
2. **Pool de conexões (`mysql2/promise`) com limite de 10**: evita esgotar conexões no MySQL de produção compartilhado; 10 é o valor recomendado no guia de implementação para o volume atual.
3. **Filtro de `status` da turma como parâmetro opcional em `getTurmasPorProjetoAditivo`**: a coluna `turma.status` (smallint, default 0) já existe no schema (`0: não especificado / 1: não iniciada / 2: iniciada / 3: concluída / 4: cancelada`); expor como filtro evita que o frontend precise filtrar em memória.
4. **Validação de query params com Joi nas rotas**, não nos models: mantém os models focados em acesso a dados e concentra as regras de validação de entrada num único lugar (routes).
5. **Estrutura de pastas por responsabilidade** (`config/models/services/routes/middleware`): facilita adicionar as Phases 2 e 3 sem reestruturar.

## Risks / Trade-offs

- [Banco de produção sem ambiente de staging] → Todas as queries desta fase são somente leitura (`SELECT`); nenhuma escrita é implementada.
- [Ausência de ORM pode gerar SQL repetitivo entre models] → Aceitável no volume atual (9 models); revisar se a Phase 2 aumentar muito a complexidade.
- [Tabela `frequencia` com ~562k linhas pode gerar queries lentas] → Fora de escopo direto desta fase (sem agregações), mas os models de `Turma`/`Aula` devem sempre filtrar por `id_turma`/intervalo de datas, nunca fazer `SELECT *` sem filtro.
- [Pool de 10 conexões pode ser insuficiente sob carga] → Ajustável via `.env`; não é hardcoded.

## Migration Plan

Não há migração de dados. Deploy inicial: subir `backend/` como novo serviço; nenhuma mudança em sistemas existentes. Rollback: remover/parar o serviço, sem impacto no banco (somente leitura).

## Open Questions

- Nenhuma no momento — guia de implementação (`IMPLEMENTATION_GUIDE.md`) já define escopo e critérios de aceitação para esta fase.
