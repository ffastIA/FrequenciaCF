## Why

Atualmente, a tela de detalhe da turma (TurmaDetalhe) exibe apenas alunos com situação "ativo" (matricula.situacao = 7). Isso limita a visibilidade de outros alunos da turma que podem estar em outras situações (matriculado, concluiu, desistiu, evadido, etc.). 

Com a coluna "Situação" agora adicionada, há diferenciação visual clara entre alunos ativos e não-ativos. Portanto, não há necessidade de filtrar — mostrar todos os alunos e deixar a coluna "Situação" indicar o estado de cada um oferece uma visão mais completa da turma.

## What Changes

- Remover o filtro padrão implícito de situação ("ativo") 
- Adicionar um **dropdown de filtro por situação** visível no topo da tabela de alunos (estilo Projeto/Aditivo do Dashboard)
- Dropdown lista todas as 9 situações possíveis (0-8): "Não especificado", "Matriculado", "Concluiu", etc.
- **Valor default do filtro: "Ativo"** (situacao=7) — tabela inicia mostrando apenas alunos ativos
- Usuário pode mudar o filtro para ver qualquer outra situação, ou "Todos" para ver todos os alunos
- Coluna "Situação" continua visível para diferenciar alunos por estado
- Filtro é preservado na URL (query parameter `situacao`)

## Capabilities

### Modified Capabilities
- `frontend-dashboard`: detalhe de turma (TurmaDetalhe) — passa a exibir todos os alunos da turma, não apenas ativos.

## Impact

- **Frontend**: remover parâmetro de filtro em `TurmaDetalhe.jsx` (alterar `getAlunos(idTurma, SITUACAO_ATIVO)` para `getAlunos(idTurma)`)
- **Sem mudança no backend** — endpoint `/api/filtros/alunos` já aceita `situacao` como parâmetro opcional
- **Sem mudança de schema**
- **Usuário agora vê**: todos os alunos, com a coluna "Situação" indicando se é ativo, evadido, etc.
