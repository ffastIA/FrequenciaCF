## Why

Na tela de detalhe da turma (TurmaDetalhe), a lista de alunos ativos exibe apenas nome, quantidade de faltas, percentual de faltas e faltas recentes. Não está claro qual é a situação específica de cada aluno na turma — se é ativo, evadido, matriculado, concluiu, etc. Uma coluna "Situação" logo após o nome do aluno torna essa informação imediatamente visível, melhorando a compreensão do estado de cada aluno dentro do escopo filtrado.

## What Changes

- Nova coluna "Situação" na tabela de alunos da tela TurmaDetalhe, posicionada logo após a coluna "Aluno".
- A coluna exibe a situação textual do aluno (ex.: "Ativo", "Matriculado", "Concluiu", "Evadido", etc.), traduzida a partir do valor numérico `matricula.situacao`.
- A coluna é ordenável, como as demais colunas da tabela.

## Capabilities

### Modified Capabilities
- `frontend-dashboard`: detalhe de turma (TurmaDetalhe) — adiciona coluna "Situação" após o nome do aluno.

## Impact

- **Frontend**: pequena alteração em `frontend/src/pages/TurmaDetalhe.jsx` (nova coluna no array `colunas`, novo extrator de valor formatado).
- **Sem mudança no backend** — reutiliza `matricula.situacao` já retornado pela API `/api/filtros/alunos`.
- **Sem mudança de schema**.
