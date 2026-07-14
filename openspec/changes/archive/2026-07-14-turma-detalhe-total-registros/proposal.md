## Why

Na tela de detalhe da turma, quando o usuário filtra alunos por situação, não há indicação clara de **quantos alunos** correspondem ao filtro selecionado. O usuário precisa contar manualmente ou fazer suposições sobre a quantidade de registros sendo exibida. Um totalizador melhora a clareza e oferece contexto imediato sobre o escopo dos dados exibidos.

## What Changes

- Adicionar um **card/quadro de totalizador** na tela TurmaDetalhe, posicionado ao lado do dropdown de filtro de situação
- O card exibe o **número total de registros** que correspondem ao filtro selecionado atualmente
- O totalizador **atualiza em tempo real** ao mudar o filtro de situação
- Posicionamento estratégico para aproveitamento de espaço e harmonia visual com o layout existente

## Capabilities

### Modified Capabilities
- `frontend-dashboard`: detalhe de turma (TurmaDetalhe) — adiciona totalizador de registros filtrados.

## Impact

- **Frontend**: adição de um card/quadro em `TurmaDetalhe.jsx` mostrando `alunos.length`; sem mudanças no backend
- **Sem mudança no backend** — reutiliza dados já retornados pela API
- **Sem mudança de schema**
- **Melhora de UX**: clareza sobre a quantidade de alunos no filtro atual
