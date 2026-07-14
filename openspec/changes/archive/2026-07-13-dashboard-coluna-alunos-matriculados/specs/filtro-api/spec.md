## MODIFIED Requirements

### Requirement: Endpoint de turmas com filtro de situação
O sistema SHALL expor `GET /api/filtros/turmas?idProjeto=X&idProjetoAditivo=Y&idMeta=Z&idInstrutor=W&status=S`, exigindo `idProjeto` e `idProjetoAditivo` (number, obrigatórios), com `idMeta`, `idInstrutor` e `status` (number, 0 a 4) opcionais via validação Joi. Cada turma retornada SHALL incluir, além dos campos de `turma.*`, os campos `cursoDescricao` (via JOIN com `curso`), `instrutorNome` (via JOIN com `instrutor`), `totalAlunosMatriculados` (quantidade de alunos com `matricula.situacao = 1`, "matriculado") e `totalAlunosAtivos` (quantidade de alunos com `matricula.situacao = 7`, "ativo") naquela turma, ambos calculados por subquery correlacionado (sem duplicar linhas de turma), para que consumidores não precisem resolver esses dados separadamente.

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

#### Scenario: Resposta inclui total de alunos ativos
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1`
- **THEN** cada turma na resposta inclui `totalAlunosAtivos`, a contagem de alunos com `matricula.situacao = 7` naquela turma

#### Scenario: Resposta inclui total de alunos matriculados
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1`
- **THEN** cada turma na resposta inclui `totalAlunosMatriculados`, a contagem de alunos com `matricula.situacao = 1` naquela turma

#### Scenario: Turma sem nenhum aluno ativo ou matriculado
- **WHEN** uma turma do resultado não possui nenhuma matrícula com `situacao = 7` nem `situacao = 1`
- **THEN** `totalAlunosAtivos` e `totalAlunosMatriculados` são `0` para aquela turma, não `null` nem ausentes

#### Scenario: Turma com múltiplas matrículas do mesmo aluno não gera linhas duplicadas
- **WHEN** as contagens de alunos ativos e matriculados são calculadas para uma turma
- **THEN** a resposta continua com uma única linha por turma (os subqueries não multiplicam as linhas de `turma` como um `JOIN` direto com `matricula` faria)
