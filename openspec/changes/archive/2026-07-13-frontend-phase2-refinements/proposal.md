## Why

Após o primeiro uso do dashboard (Frontend Phase 1), o responsável do projeto identificou quatro refinamentos necessários: o drill-down mostra alunos de qualquer situação (deve mostrar apenas os ativos), as telas não exibem o período da turma (início/término) nem a data do último lançamento de frequência — informação central para o propósito do sistema — e o aspecto visual está rústico demais para uso corrente.

## What Changes

- **Drill-down da turma**: listar somente alunos com `matricula.situacao = 7` ("ativo"). Decisão explícita do responsável: estritamente o valor 7, mesmo sabendo que a maioria das turmas históricas (concluídas) mostrará lista vazia — o foco do sistema é acompanhar turmas em andamento.
- **Datas da turma**: exibir `data_inicio` e `data_fim` da turma na tabela do Dashboard e na tela de detalhe.
- **Data do último lançamento**: exibir em ambas as telas. Requer extensão do backend: os endpoints de atraso (`/api/metricas/atraso-lancamento/*`) passam a retornar também `dataUltimoLancamento` (null quando nunca houve lançamento), pois o campo atual `dataReferencia` mistura o último lançamento real com o fallback (primeira aula).
- **Backend**: `GET /api/filtros/alunos` ganha parâmetro opcional `situacao` (number) para filtrar por `matricula.situacao` — mudança aditiva, não quebra consumidores atuais.
- **Visual**: aplicar estilo consistente às duas telas (layout, tipografia, tabela com hover/zebra, filtros organizados, estados de carregamento e vazio legíveis), com CSS puro — sem dependências novas.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `filtro-api`: endpoint `/api/filtros/alunos` ganha filtro opcional `situacao`.
- `metricas-frequencia`: endpoints de atraso passam a incluir `dataUltimoLancamento` na resposta.
- `frontend-dashboard`: novas colunas (início, término, último lançamento), drill-down restrito a alunos ativos, e requisitos de apresentação visual.

## Impact

- **Backend alterado**: `backend/models/Aluno.js` (filtro por situação), `backend/services/MetricasFrequenciaService.js` e `backend/models/Frequencia.js` (expor último lançamento sem fallback), `backend/routes/api/filtros.js` (param novo), `API.md`/`tests.http`.
- **Frontend alterado**: `Dashboard.jsx`, `TurmaDetalhe.jsx`, `api/filtros.js`, CSS global (`index.css`/`App.css`).
- **Sem dependências novas** em backend ou frontend.
- **Banco de dados**: continua somente leitura; nenhuma migração.
- **Compatibilidade**: todas as mudanças de API são aditivas (param opcional, campo novo na resposta) — nada quebra.
