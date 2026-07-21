## Why

Com o número de vagas por turma agora registrado (change `vagas-turma-json`), o Dashboard pode calcular quanto da capacidade de cada turma está efetivamente ocupada — um indicador direto para identificar turmas com vagas ociosas ou superlotadas, sem precisar cruzar manualmente "Alunos ativos" e "Vagas" a cada consulta.

## What Changes

- Nova coluna **"% Ocupação"** na tabela de Turmas do Dashboard, posicionada entre "Alunos ativos" e "Início".
- Cálculo: `(alunos ativos da turma / vagas definidas para a turma) × 100`, calculado inteiramente no cliente a partir de dados já carregados (nenhuma chamada de API nova).
- Quando a turma não tem vagas definidas (`vagas = 0`, o default), a célula exibe "—" (divisão por zero evitada, não `0%` nem `Infinity%`).
- O percentual pode ultrapassar `100%` (turma com mais alunos ativos do que vagas cadastradas) — exibido sem limite artificial, refletindo o valor real.
- A coluna aplica-se a todas as turmas exibidas na tabela (sem restringir por situação); o valor "—" já cobre naturalmente os casos onde vagas não foram definidas.
- Coluna participa da ordenação existente (valor numérico bruto, "—"/ausente sempre por último) e da exportação para Excel, como as demais colunas.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: tabela de Turmas ganha a coluna "% Ocupação" (posição, cálculo, tratamento de vagas=0, participação na ordenação e na exportação Excel).

## Impact

- **Frontend**: alterações em `frontend/src/pages/Dashboard.jsx` (array `colunas`, `<tbody>`, `colunasExportacao`); possível helper de formatação de percentual reaproveitado ou análogo ao já usado em `TurmaDetalhe.jsx`.
- **Backend**: nenhum impacto — o cálculo usa dados já retornados por `GET /api/filtros/turmas` (`totalAlunosAtivos`) e pelo mapa de vagas já buscado via `GET /api/vagas` (capability `vagas-turma`). Nenhum endpoint novo, nenhuma mudança de contrato de API.
- **Banco de dados**: nenhum impacto.
