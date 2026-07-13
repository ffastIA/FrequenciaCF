## Why

A tabela de turmas do Dashboard mostra código, curso, instrutor, situação e datas, mas não indica quantos alunos estão de fato **ativos** em cada turma — o mesmo critério (`matricula.situacao = 7`) já usado como filtro na tabela de alunos da tela de detalhe. Para saber esse número hoje, o usuário precisa abrir o drill-down de cada turma uma por uma.

## What Changes

- **Novo campo `totalAlunosAtivos` em `GET /api/filtros/turmas`**: cada turma retornada passa a incluir a contagem de alunos com `matricula.situacao = 7` naquela turma, calculada com um subquery correlacionado (`SELECT COUNT(*) FROM matricula WHERE id_turma = t.id_turma AND situacao = 7`), no mesmo padrão já usado para trazer `cursoDescricao`/`instrutorNome` na Phase 1. Validado em produção: ~90ms para todas as ~4.400 turmas do banco — sem impacto perceptível de performance.
- **Nova coluna "Alunos ativos" na tabela do Dashboard**, posicionada logo após "Situação" (antes de "Início"), exibindo o número diretamente — sem chamada assíncrona adicional, já que o dado vem na mesma resposta que já popula o restante da linha.
- **Coluna participa da ordenação por clique** já existente na tabela (numérica), consistente com as demais colunas.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `filtro-api`: `GET /api/filtros/turmas` retorna `totalAlunosAtivos` por turma.
- `frontend-dashboard`: nova coluna "Alunos ativos" na tabela de turmas, incluída na ordenação por coluna.

## Impact

- **Backend alterado**: `backend/models/Turma.js` (`getTurmasPorProjetoAditivo` ganha o subquery), `backend/API.md`, `backend/tests.http`.
- **Frontend alterado**: `frontend/src/pages/Dashboard.jsx` (nova coluna na tabela e na configuração de ordenação).
- **Sem endpoint novo, sem dependências novas**; banco continua somente leitura (`SELECT`).
- **Compatibilidade**: campo aditivo na resposta existente — não quebra nenhum consumidor atual.
