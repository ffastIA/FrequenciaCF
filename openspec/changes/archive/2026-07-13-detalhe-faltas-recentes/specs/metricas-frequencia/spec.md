## ADDED Requirements

### Requirement: Quantidade de faltas por aluno nas últimas 4 aulas da turma
O sistema SHALL calcular, para uma turma, a quantidade de faltas de cada aluno matriculado nas últimas 4 aulas **realizadas** (`aula.status = 1` e `data <= hoje`, ordenadas por `data DESC` e `id_aula DESC` como desempate), retornando também `aulasConsideradas`: o número de aulas efetivamente usadas no cálculo, que SHALL ser menor que 4 quando a turma ainda não tiver 4 aulas realizadas, e `0` quando a turma não tiver nenhuma. "Falta" SHALL seguir a mesma definição já estabelecida na capability (`frequencia.presenca = 2`); um aluno sem registro de `frequencia` numa das aulas consideradas SHALL NOT contar como falta nessa aula. Aulas com `aula.status = 0` (não realizadas, potencialmente com `frequencia` pré-copiada de uma aula anterior) SHALL NOT entrar no cálculo.

#### Scenario: Turma com 4 ou mais aulas realizadas
- **WHEN** a turma tem pelo menos 4 aulas com `status = 1` e `data <= hoje`
- **THEN** `aulasConsideradas = 4` e a quantidade de faltas de cada aluno é contada dentro dessas 4 aulas mais recentes

#### Scenario: Turma recém-iniciada com menos de 4 aulas realizadas
- **WHEN** a turma tem, por exemplo, apenas 2 aulas com `status = 1` e `data <= hoje`
- **THEN** `aulasConsideradas = 2` e a quantidade de faltas de cada aluno é contada dentro dessas 2 aulas, sem esperar a turma acumular 4

#### Scenario: Turma sem nenhuma aula realizada
- **WHEN** a turma não tem nenhuma aula com `status = 1` e `data <= hoje`
- **THEN** `aulasConsideradas = 0` e a quantidade de faltas de todo aluno é `0`

#### Scenario: Aulas agendadas com dado pré-copiado são ignoradas
- **WHEN** a aula mais recente da turma com `data <= hoje` está com `aula.status = 0` (não realizada, mesmo já tendo `frequencia` pré-copiada de uma aula anterior)
- **THEN** essa aula SHALL NOT ser incluída nem no cálculo nem em `aulasConsideradas`; o sistema usa a aula anterior genuinamente realizada em seu lugar

#### Scenario: Aluno sem registro numa das aulas consideradas
- **WHEN** um aluno matriculado não possui nenhum registro de `frequencia` para uma das aulas consideradas (ex.: matrícula posterior à aula)
- **THEN** essa aula não é contada como falta para aquele aluno

### Requirement: Endpoint de faltas recentes por turma
O sistema SHALL expor `GET /api/metricas/faltas-recentes?idTurma=X`, exigindo `idTurma` (number, obrigatório) via validação Joi, retornando `idTurma`, `aulasConsideradas` e `porAluno` — um array com `{ idAluno, quantidadeFaltas }` para cada aluno matriculado na turma. A resposta cobre todos os alunos matriculados na turma numa única chamada (não exige uma requisição por aluno).

#### Scenario: Requisição válida
- **WHEN** um cliente faz `GET /api/metricas/faltas-recentes?idTurma=1597`
- **THEN** a resposta tem status 200 com `idTurma`, `aulasConsideradas` e `porAluno` (array de `{ idAluno, quantidadeFaltas }`)

#### Scenario: Parâmetro obrigatório ausente
- **WHEN** um cliente faz `GET /api/metricas/faltas-recentes` sem `idTurma`
- **THEN** a resposta tem status 400, sem executar a query no banco
