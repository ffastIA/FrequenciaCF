## MODIFIED Requirements

### Requirement: Endpoint de turmas com filtro de situação
O sistema SHALL expor `GET /api/filtros/turmas?idProjeto=X&idProjetoAditivo=Y&idMeta=Z&idInstrutor=W&status=S`, exigindo `idProjeto` e `idProjetoAditivo` (number, obrigatórios), com `idMeta`, `idInstrutor` e `status` (number, 0 a 4) opcionais via validação Joi. Cada turma retornada SHALL incluir, além dos campos de `turma.*`, os campos `cursoDescricao` (via JOIN com `curso`) e `instrutorNome` (via JOIN com `instrutor`), para que consumidores não precisem resolver esses nomes separadamente.

#### Scenario: Turmas sem filtro de status
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1`
- **THEN** a resposta tem status 200 com todas as turmas do projeto/aditivo, independente da situação

#### Scenario: Turmas filtradas por situação "iniciada"
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1&status=2`
- **THEN** a resposta tem status 200 contendo somente turmas com situação "iniciada" (status = 2)

#### Scenario: Status inválido
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1&status=9`
- **THEN** a resposta tem status 400, pois `status` deve estar entre 0 e 4

#### Scenario: Resposta inclui nomes de curso e instrutor
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1`
- **THEN** cada turma na resposta inclui `cursoDescricao` e `instrutorNome` preenchidos (não apenas `id_curso`/`id_instrutor`)

## ADDED Requirements

### Requirement: Endpoint de alunos por turma
O sistema SHALL expor `GET /api/filtros/alunos?idTurma=X`, exigindo `idTurma` (number, obrigatório) via validação Joi, retornando os alunos matriculados naquela turma (via `AlunoModel.getAlunosPorTurma`).

#### Scenario: Alunos de uma turma válida
- **WHEN** um cliente faz `GET /api/filtros/alunos?idTurma=1597`
- **THEN** a resposta tem status 200 com um array JSON dos alunos matriculados naquela turma

#### Scenario: Parâmetro obrigatório ausente
- **WHEN** um cliente faz `GET /api/filtros/alunos` sem `idTurma`
- **THEN** a resposta tem status 400, sem executar a query no banco
