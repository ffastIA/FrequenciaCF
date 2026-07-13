## ADDED Requirements

### Requirement: Definição de falta
O sistema SHALL considerar como falta exclusivamente os registros de `frequencia` com `presenca = 2` ("Faltou"). Registros com `presenca = 3` ("Falta justificada") SHALL NOT ser contados como falta em nenhuma métrica.

#### Scenario: Falta justificada não conta como falta
- **WHEN** um aluno tem um registro de `frequencia` com `presenca = 3` numa aula dentro do período consultado
- **THEN** essa aula não é somada em `quantidadeFaltas` nem em `percentualFaltas`

### Requirement: Definição de aula prevista
O sistema SHALL considerar "aula prevista" qualquer linha de `aula` cuja `aula.data` esteja dentro do intervalo de filtro efetivo, independentemente do valor de `aula.status` (0 prevista ou 1 realizada).

#### Scenario: Aula com status "prevista" mas data no passado conta como prevista
- **WHEN** uma aula tem `status = 0` e `data` anterior a hoje, dentro do intervalo de filtro
- **THEN** ela é contada no denominador de `aulasPrevistas` da Métrica 2

### Requirement: Quantidade de faltas por aluno por turma
O sistema SHALL calcular, para um par `(idAluno, idTurma)` e um intervalo `[dataInicio, dataFim]`, a quantidade de faltas do aluno nas aulas previstas da turma dentro do intervalo. `dataInicio` SHALL default para `turma.data_inicio` e `dataFim` SHALL default para a data atual. O `dataFim` efetivo usado no cálculo SHALL ser sempre `min(dataFim informado, data atual)`, mesmo que uma data futura seja informada.

#### Scenario: Cálculo padrão sem filtro de datas
- **WHEN** a métrica de faltas é consultada para um aluno/turma sem informar `dataInicio`/`dataFim`
- **THEN** o cálculo usa `dataInicio = turma.data_inicio` e `dataFim = hoje`

#### Scenario: Filtro com data futura é limitado a hoje
- **WHEN** a métrica é consultada informando `dataFim` posterior à data atual
- **THEN** o cálculo usa `dataFim efetivo = hoje`, ignorando aulas futuras

### Requirement: Percentual de faltas por aluno por turma
O sistema SHALL calcular o percentual de faltas como `quantidadeFaltas / aulasPrevistas * 100`, usando o mesmo escopo, filtro e base da quantidade de faltas. Quando `aulasPrevistas = 0`, o sistema SHALL retornar `percentualFaltas: null` em vez de causar erro de divisão por zero.

#### Scenario: Turma sem nenhuma aula no período
- **WHEN** o intervalo de filtro não contém nenhuma aula da turma
- **THEN** a resposta contém `aulasPrevistas: 0` e `percentualFaltas: null`

#### Scenario: Percentual calculado corretamente
- **WHEN** um aluno tem 5 faltas em 42 aulas previstas no período
- **THEN** a resposta contém `quantidadeFaltas: 5`, `aulasPrevistas: 42` e `percentualFaltas` aproximadamente `11.9`

### Requirement: Indicador de aulas sem frequência lançada
Toda resposta de métrica de faltas SHALL incluir `aulasSemFrequenciaLancada`: a contagem de aulas da turma no período que ainda não possuem nenhum registro em `frequencia` para nenhum aluno. Essas aulas SHALL contar no denominador (`aulasPrevistas`) mas SHALL NOT gerar falta no numerador.

#### Scenario: Aula sem nenhuma frequência lançada
- **WHEN** uma aula da turma, dentro do período, não tem nenhum registro em `frequencia`
- **THEN** ela é somada em `aulasPrevistas` e em `aulasSemFrequenciaLancada`, mas não em `quantidadeFaltas` para nenhum aluno

### Requirement: Endpoint de métrica de faltas
O sistema SHALL expor `GET /api/metricas/faltas?idTurma=X&idAluno=Y&dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD`, com `idTurma` e `idAluno` obrigatórios (number) e `dataInicio`/`dataFim` opcionais (formato ISO), retornando `quantidadeFaltas`, `percentualFaltas`, `aulasPrevistas` e `aulasSemFrequenciaLancada` numa única resposta.

#### Scenario: Requisição válida
- **WHEN** um cliente faz `GET /api/metricas/faltas?idTurma=1597&idAluno=123`
- **THEN** a resposta tem status 200 com os quatro campos (`quantidadeFaltas`, `percentualFaltas`, `aulasPrevistas`, `aulasSemFrequenciaLancada`)

#### Scenario: Parâmetro obrigatório ausente
- **WHEN** um cliente faz `GET /api/metricas/faltas?idTurma=1597` sem `idAluno`
- **THEN** a resposta tem status 400, sem executar a query no banco

### Requirement: Data de referência do lançamento
Como a tabela `frequencia` não possui coluna de timestamp de lançamento, o sistema SHALL usar `aula.data` como proxy da data em que a frequência daquela aula deveria ter sido registrada, para fins do cálculo de atraso.

#### Scenario: Data da aula usada como referência
- **WHEN** o sistema precisa determinar quando uma frequência "deveria" ter sido lançada
- **THEN** usa `aula.data` da aula correspondente, não uma coluna de timestamp em `frequencia` (que não existe)

### Requirement: Dias de atraso no lançamento por turma
O sistema SHALL calcular, para uma turma, os dias de atraso no lançamento de frequência como `hoje - data da aula mais recente da turma (com data <= hoje) que já possui pelo menos um registro em frequencia`. Quando a turma nunca teve nenhuma frequência lançada, o sistema SHALL usar a aula mais antiga da turma com `data <= hoje` como referência. Quando a turma não possui nenhuma aula com `data <= hoje`, o sistema SHALL retornar `diasAtraso: null`.

#### Scenario: Turma com lançamentos recentes
- **WHEN** a aula mais recente já lançada de uma turma foi há 4 dias
- **THEN** `diasAtraso = 4`

#### Scenario: Turma que nunca lançou nenhuma frequência
- **WHEN** uma turma tem aulas com `data <= hoje` mas nenhuma possui registro em `frequencia`
- **THEN** `diasAtraso` é calculado a partir da aula mais antiga da turma com `data <= hoje`

#### Scenario: Turma ainda sem aulas passadas
- **WHEN** uma turma não tem nenhuma aula com `data <= hoje`
- **THEN** `diasAtraso: null`

### Requirement: Dias de atraso no lançamento agregado por instrutor
O sistema SHALL calcular os dias de atraso agregados por instrutor considerando todas as turmas cujo `turma.id_instrutor` seja o instrutor consultado (não `aula.id_instrutor`), aplicando a mesma lógica e os mesmos fallbacks do cálculo por turma sobre o conjunto agregado de aulas dessas turmas.

#### Scenario: Instrutor com múltiplas turmas
- **WHEN** um instrutor é responsável por 3 turmas com diferentes níveis de atraso
- **THEN** `diasAtraso` do instrutor reflete a aula mais recente já lançada entre todas as suas turmas

### Requirement: Endpoints de atraso de lançamento
O sistema SHALL expor `GET /api/metricas/atraso-lancamento/turma?idTurma=X` e `GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=X`, cada um retornando `diasAtraso` e `dataReferencia`.

#### Scenario: Consulta de atraso por turma
- **WHEN** um cliente faz `GET /api/metricas/atraso-lancamento/turma?idTurma=1597`
- **THEN** a resposta tem status 200 com `diasAtraso` e `dataReferencia`

#### Scenario: Consulta de atraso por instrutor
- **WHEN** um cliente faz `GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=224`
- **THEN** a resposta tem status 200 com `diasAtraso` e `dataReferencia`

### Requirement: Métricas são somente leitura
Todas as queries usadas pelas métricas desta capability SHALL ser `SELECT`, sem exceção, reutilizando o guard de somente-leitura de `backend/config/database.js` estabelecido na Fase 1.

#### Scenario: Nenhuma escrita é executada
- **WHEN** qualquer endpoint de `/api/metricas/*` é chamado
- **THEN** nenhuma query `INSERT`/`UPDATE`/`DELETE` é executada no banco
