## Why

Os backends de filtros (Fase 1) e métricas (Fase 2) já expõem todos os dados necessários, mas não existe hoje nenhuma interface para os usuários do Centro de Formação consultarem turmas, situação e — principalmente — o atraso no lançamento de frequência pelos instrutores, que é a finalidade central do sistema FrequenciaCF. Esta fase entrega o primeiro corte funcional do dashboard.

## What Changes

- Criar aplicação frontend (`frontend/`) em Vite + React, sem autenticação, consumindo a API REST já existente.
- Tela "Dashboard": filtro em cascata Projeto → Aditivo (obrigatórios) → Meta (opcional); ao definir Projeto+Aditivo, carrega automaticamente a tabela de turmas.
- Tabela de turmas com colunas de identificação (código, curso, instrutor, situação) e dias de atraso no lançamento; filtros adicionais de Instrutor e Situação reconsultam a tabela sem recarregar a página.
- Drill-down: clique numa turma navega para `/turmas/:idTurma`, exibindo o atraso da turma e a lista de alunos com quantidade/percentual de faltas.
- **Extensão do backend** (pré-requisito desta fase, pequena e somente leitura):
  - `GET /api/filtros/turmas` passa a retornar `cursoDescricao` e `instrutorNome` (via JOIN), além dos campos já existentes.
  - Novo endpoint `GET /api/filtros/alunos?idTurma=X`, expondo o model `Aluno.getAlunosPorTurma` (já existente desde a Fase 1, sem rota até agora).

## Capabilities

### New Capabilities
- `frontend-dashboard`: SPA Vite+React com o fluxo de filtros em cascata, tabela de turmas com atraso de lançamento, e tela de detalhe da turma com faltas por aluno.

### Modified Capabilities
- `filtro-api`: `GET /api/filtros/turmas` passa a incluir `cursoDescricao`/`instrutorNome` na resposta; novo endpoint `GET /api/filtros/alunos?idTurma=X` é adicionado à capability.

## Impact

- **Código novo**: `frontend/` (projeto Vite completo — `src/pages`, `src/components`, `src/api`, `src/hooks`).
- **Backend alterado**: `backend/models/Turma.js` (JOIN adicional), `backend/routes/api/filtros.js` (nova rota `/alunos`), `backend/API.md`/`tests.http` atualizados.
- **Sem dependências novas no backend** — reaproveita `express`/`joi`/`mysql2` já instalados.
- **Frontend**: novas dependências `react`, `react-dom`, `react-router-dom`, `vite` (e devDependencies do template Vite).
- **Banco de dados**: leitura em produção; nenhuma escrita, nenhuma migração de schema — reaproveita o guard de somente-leitura já existente.
- **Depende de**: Backend Fase 1 (`backend-phase1-setup`) e Fase 2 (`backend-phase2-metrics`), ambas já implementadas e arquivadas.
- **Fases futuras dependentes**: Frontend Phase 2/3 e a Phase 3 do backend (Exportação) vão consumir/estender esta base.
