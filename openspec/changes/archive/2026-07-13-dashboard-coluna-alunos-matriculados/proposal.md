## Why

A tabela de turmas do Dashboard mostra o total de alunos **ativos** (`matricula.situacao = 7`) por turma, mas não mostra quantos alunos estão **matriculados** (`matricula.situacao = 1`) — uma situação diferente e igualmente relevante para acompanhamento (ex.: turma que já tem alunos matriculados mas ainda não "ativou" nenhum). O pedido é adicionar essa segunda contagem, com a mesma mecânica já usada para "Alunos ativos" (mesma fonte de dados, mesmo comportamento de ordenação, mesma quebra de cabeçalho).

## What Changes

- **Novo campo `totalAlunosMatriculados` em `GET /api/filtros/turmas`**: cada turma retornada passa a incluir também a contagem de alunos com `matricula.situacao = 1` ("matriculado"), calculada com um segundo subquery correlacionado, no mesmo padrão de `totalAlunosAtivos` (Phase anterior). Validado em produção: ~80ms com as duas contagens juntas para as turmas de teste — sem impacto de performance.
- **Nova coluna "Alunos Matriculados" no Dashboard**, posicionada **entre "Situação" e "Alunos ativos"** (a nova ordem passa a ser: Código, Curso, Instrutor, Situação, **Alunos Matriculados**, Alunos ativos, Início, Término, Último Lançamento, Dias em Atraso).
- **Mesma mecânica das demais colunas**: valor exibido diretamente da resposta já buscada (sem chamada de rede adicional, sem estado de carregamento próprio — igual "Alunos ativos"), participa da ordenação por clique no cabeçalho (crescente/decrescente, mesma coluna ativa por vez), e o cabeçalho quebra em 2+ linhas como as demais colunas do Dashboard (reaproveita o CSS `.table-turmas th` já existente, sem mudança de CSS necessária).

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `filtro-api`: `GET /api/filtros/turmas` retorna `totalAlunosMatriculados` por turma.
- `frontend-dashboard`: nova coluna "Alunos Matriculados" na tabela de turmas, entre "Situação" e "Alunos ativos", incluída na ordenação por coluna.

## Impact

- **Backend alterado**: `backend/models/Turma.js` (`getTurmasPorProjetoAditivo` ganha o segundo subquery), `backend/API.md`, `backend/tests.http`.
- **Frontend alterado**: `frontend/src/pages/Dashboard.jsx` (nova entrada no array `colunas`, nova célula na linha da tabela).
- **Sem endpoint novo, sem dependências novas, sem mudança de CSS**; banco continua somente leitura (`SELECT`).
- **Compatibilidade**: campo aditivo na resposta existente — não quebra nenhum consumidor atual.
