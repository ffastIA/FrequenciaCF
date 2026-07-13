# Capability: data-models

## Purpose

Camada de acesso a dados (models) para as entidades do banco `CentroFormacao` usadas pelo backend FrequenciaCF: Projeto, ProjetoAditivo, MetaTurma, Turma, Instrutor, Aula, Aluno, Frequencia e Curso.

## Requirements

### Requirement: Models de acesso a dados
O sistema SHALL prover 9 models (`backend/models/{Projeto,ProjetoAditivo,MetaTurma,Turma,Instrutor,Aula,Aluno,Frequencia,Curso}.js`), cada um recebendo o pool de conexão no construtor e expondo métodos assíncronos que executam `SELECT`s parametrizados (nunca concatenação de strings) contra as tabelas correspondentes de `CentroFormacao`.

#### Scenario: Import sem erro
- **WHEN** `server.js` importa e instancia cada um dos 9 models com o pool de conexão
- **THEN** nenhum model lança erro na importação ou instanciação

#### Scenario: Query parametrizada
- **WHEN** qualquer método de model recebe um parâmetro de entrada (ex.: `id`, `idTurma`, datas)
- **THEN** o valor é passado como parâmetro vinculado (`?`) para `pool.execute`, nunca interpolado diretamente na string SQL

### Requirement: Model Projeto
`backend/models/Projeto.js` SHALL expor `getProjetos()` (lista todos os projetos) e `getProjetoById(id)`.

#### Scenario: Listar projetos
- **WHEN** `getProjetos()` é chamado
- **THEN** retorna todas as linhas de `projeto`

### Requirement: Model ProjetoAditivo
`backend/models/ProjetoAditivo.js` SHALL expor `getAditivosPorProjeto(idProjeto)`, retornando os aditivos vinculados a um projeto.

#### Scenario: Aditivos de um projeto existente
- **WHEN** `getAditivosPorProjeto(1)` é chamado para um `idProjeto` existente
- **THEN** retorna somente as linhas de `projeto_aditivo` com `id_projeto = 1`

### Requirement: Model MetaTurma
`backend/models/MetaTurma.js` SHALL expor `getMetasPorAditivo(idProjetoAditivo)`, retornando as metas vinculadas a um aditivo de projeto.

#### Scenario: Metas de um aditivo existente
- **WHEN** `getMetasPorAditivo(idProjetoAditivo)` é chamado
- **THEN** retorna somente as linhas de `meta_turma` com `id_projeto_aditivo` correspondente

### Requirement: Model Turma com filtro de situação
`backend/models/Turma.js` SHALL expor `getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, filtros)` e `getTurmaById(id)`. O parâmetro `filtros` SHALL suportar um campo opcional `status` (situação da turma) que filtra pela coluna `turma.status` (smallint: 0 não especificado, 1 não iniciada, 2 iniciada, 3 concluída, 4 cancelada).

#### Scenario: Turmas sem filtro de status
- **WHEN** `getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, {})` é chamado sem `status` em `filtros`
- **THEN** retorna todas as turmas do projeto/aditivo, independente da situação

#### Scenario: Turmas filtradas por status
- **WHEN** `getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, { status: 2 })` é chamado
- **THEN** retorna somente turmas com `turma.status = 2` (iniciada) dentro do projeto/aditivo informado

### Requirement: Model Instrutor
`backend/models/Instrutor.js` SHALL expor `getInstrutoresPorTurmas(idTurmas[])` e `getInstrutorById(id)`.

#### Scenario: Instrutores de uma lista de turmas
- **WHEN** `getInstrutoresPorTurmas([1, 2, 3])` é chamado
- **THEN** retorna os instrutores vinculados a qualquer uma das turmas informadas, sem duplicatas

### Requirement: Model Aula
`backend/models/Aula.js` SHALL expor `getAulasPorTurma(idTurma, dataInicio, dataFim)` e `getAulasRealizadas(idTurmas[], dataInicio, dataFim)` com filtro de status de aula.

#### Scenario: Aulas de uma turma no período
- **WHEN** `getAulasPorTurma(idTurma, '2026-01-01', '2026-06-30')` é chamado
- **THEN** retorna somente aulas de `idTurma` com `data` entre as datas informadas (inclusive)

### Requirement: Model Aluno
`backend/models/Aluno.js` SHALL expor `getAlunosPorTurma(idTurma)` e `getAlunoById(id)`.

#### Scenario: Alunos de uma turma
- **WHEN** `getAlunosPorTurma(idTurma)` é chamado
- **THEN** retorna somente os alunos vinculados àquela turma

### Requirement: Model Frequencia
`backend/models/Frequencia.js` SHALL expor `getFrequenciasPorTurma(idTurma, dataInicio, dataFim)`, `getFrequenciasNaoLancadas(idTurmas[], dataInicio, dataFim)`, e os métodos usados pelas métricas de frequência (`getFaltasEPrevistasPorAluno`, `getAulasSemFrequenciaLancada`, `getUltimaAulaLancadaPorTurma`, `getPrimeiraAulaPorTurma`, `getUltimaAulaLancadaPorInstrutor`, `getPrimeiraAulaPorInstrutor`).

#### Scenario: Frequências não lançadas
- **WHEN** `getFrequenciasNaoLancadas(idTurmas, dataInicio, dataFim)` é chamado para turmas com aulas sem frequência lançada no período
- **THEN** retorna a lista de aulas/turmas identificadas como sem frequência lançada

#### Scenario: Faltas e aulas previstas de um aluno
- **WHEN** `getFaltasEPrevistasPorAluno(idTurma, idAluno, dataInicio, dataFim)` é chamado
- **THEN** retorna `{ aulasPrevistas, quantidadeFaltas }`, onde `aulasPrevistas` conta toda `aula` da turma no período (independente de status) e `quantidadeFaltas` conta somente `frequencia.presenca = 2` do aluno dentro dessas aulas

### Requirement: Model Curso
`backend/models/Curso.js` SHALL expor `getCursoPorTurma(idTurma)`, resolvendo o curso associado a uma turma.

#### Scenario: Curso de uma turma
- **WHEN** `getCursoPorTurma(idTurma)` é chamado para uma turma existente
- **THEN** retorna os dados do curso vinculado via `turma.id_curso`

### Requirement: Performance das queries
Cada método de model SHALL retornar em menos de 1 segundo para os volumes de dados atuais de produção (ex.: `frequencia` com ~562k linhas), sempre filtrando por chave (`id_turma`, intervalo de datas, etc.) em vez de retornar a tabela inteira sem filtro.

#### Scenario: Query de frequência dentro do limite de performance
- **WHEN** `getFrequenciasPorTurma` é chamado com um `idTurma` e intervalo de datas válidos
- **THEN** a query retorna em menos de 1 segundo
