## MODIFIED Requirements

### Requirement: Endpoint de alunos por turma
O sistema SHALL expor `GET /api/filtros/alunos?idTurma=X&situacao=S`, exigindo `idTurma` (number, obrigatório) e aceitando `situacao` (number, 0 a 8, opcional) via validação Joi. Sem `situacao`, retorna todos os alunos matriculados na turma (comportamento atual, retrocompatível); com `situacao`, retorna somente os alunos cuja `matricula.situacao` na turma seja igual ao valor informado, com o filtro aplicado na query SQL (não em memória).

#### Scenario: Alunos de uma turma válida
- **WHEN** um cliente faz `GET /api/filtros/alunos?idTurma=1597`
- **THEN** a resposta tem status 200 com um array JSON de todos os alunos matriculados naquela turma

#### Scenario: Alunos filtrados por situação da matrícula
- **WHEN** um cliente faz `GET /api/filtros/alunos?idTurma=1597&situacao=7`
- **THEN** a resposta tem status 200 contendo somente os alunos com `matricula.situacao = 7` ("ativo") naquela turma (array vazio se não houver nenhum)

#### Scenario: Situação inválida
- **WHEN** um cliente faz `GET /api/filtros/alunos?idTurma=1597&situacao=9`
- **THEN** a resposta tem status 400, pois `situacao` deve estar entre 0 e 8

#### Scenario: Parâmetro obrigatório ausente
- **WHEN** um cliente faz `GET /api/filtros/alunos` sem `idTurma`
- **THEN** a resposta tem status 400, sem executar a query no banco
