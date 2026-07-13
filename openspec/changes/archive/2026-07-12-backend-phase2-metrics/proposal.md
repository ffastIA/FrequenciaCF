## Why

Com a Fase 1 (`backend-phase1-setup`) implementada, o backend já expõe dados brutos (turmas, alunos, aulas, frequências) via filtros em cascata, mas não calcula nenhum indicador. O objetivo do sistema FrequenciaCF é dar visibilidade sobre frequência escolar e sobre a pontualidade dos instrutores no lançamento de dados — hoje isso exigiria cálculo manual sobre os dados brutos. A Fase 2 adiciona os indicadores que tornam esses dados acionáveis.

## What Changes

- Estender `backend/models/Frequencia.js` com métodos de cálculo de faltas e de última aula lançada (por turma e por instrutor).
- Criar `backend/services/MetricasFrequenciaService.js` com a lógica de negócio das 3 métricas (faltas, percentual de faltas, atraso de lançamento).
- Criar `backend/routes/api/metricas.js` com 3 endpoints REST (`GET /api/metricas/faltas`, `GET /api/metricas/atraso-lancamento/turma`, `GET /api/metricas/atraso-lancamento/instrutor`), registrados em `server.js`.
- Todas as queries continuam **somente leitura** (`SELECT`), reaproveitando o guard de `backend/config/database.js` da Fase 1 — nenhuma escrita é introduzida.
- Atualizar `backend/API.md` e `backend/README.md` com a nova área de métricas.

## Capabilities

### New Capabilities
- `metricas-frequencia`: cálculo de quantidade e percentual de faltas por aluno/turma, e de dias de atraso no lançamento de frequência (por turma e agregado por instrutor), com as regras de negócio fechadas em `IMPLEMENTATION_GUIDE.md` (falta = `presenca=2`; aulas previstas = `aula.data <= hoje/filtro` independente de status; aulas sem frequência lançada contam no denominador mas não geram falta).

### Modified Capabilities
(nenhuma — ainda não há specs arquivadas no projeto; Fase 1 segue como change ativa)

## Impact

- **Código novo**: `backend/models/Frequencia.js` (extensão), `backend/services/MetricasFrequenciaService.js` (novo), `backend/routes/api/metricas.js` (novo).
- **`server.js`**: novo `app.use('/api/metricas', ...)`.
- **Sem dependências novas de npm** — reaproveita `express`, `mysql2`, `joi` já instalados na Fase 1.
- **Banco de dados**: leitura em produção (`CentroFormacao`); nenhuma escrita, nenhuma migração de schema.
- **Depende de**: Fase 1 completa (models `Aula`, `Turma`, `Frequencia`, guard de somente-leitura, estrutura de pastas).
- **Fases futuras dependentes**: Phase 3 (Exportação) e o Frontend consumirão estes endpoints de métricas.
