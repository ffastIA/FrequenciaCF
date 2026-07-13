# Capability: metricas-frequencia

## Purpose

Cálculo de quantidade e percentual de faltas por aluno/turma, e de dias de atraso no lançamento de frequência (por turma e agregado por instrutor), sobre os dados do banco `CentroFormacao` (somente leitura).
## Requirements
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
O sistema SHALL calcular, para um par `(idAluno, idTurma)` e um intervalo `[dataInicio, dataFim]`, a quantidade de faltas do aluno nas aulas previstas da turma dentro do intervalo. `dataInicio` SHALL default para `turma.data_inicio` e `dataFim` SHALL default para a data atual. O `dataFim` efetivo usado no cálculo SHALL ser sempre `min(dataFim informado, data atual)`, mesmo que uma data futura seja informada. A "data atual" SHALL ser calculada no fuso `America/Sao_Paulo`.

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
O sistema SHALL calcular, para uma turma, os dias de atraso no lançamento de frequência como `hoje - data da aula mais recente da turma (com data <= hoje) que já teve frequência efetivamente lançada`, onde "aula lançada" segue a definição desta capability (`aula.status = 1` e ao menos um registro em `frequencia` com `presenca <> 0`; placeholders e aulas não realizadas com dado pré-copiado não contam). Quando a turma nunca teve nenhuma frequência efetivamente lançada, o sistema SHALL usar a aula mais antiga da turma com `data <= hoje` como referência. Quando a turma não possui nenhuma aula com `data <= hoje`, o sistema SHALL retornar `diasAtraso: null`. A "data atual" SHALL ser calculada no fuso `America/Sao_Paulo`, não pelo `CURDATE()` do MySQL.

#### Scenario: Turma com lançamentos recentes
- **WHEN** a aula mais recente com lançamento real (`status = 1`, `presenca <> 0`) de uma turma foi há 4 dias
- **THEN** `diasAtraso = 4`

#### Scenario: Aula recente só com placeholders é ignorada
- **WHEN** a aula mais recente da turma (`data <= hoje`) só tem registros `presenca = 0`, mas há uma aula anterior com lançamento real
- **THEN** o cálculo de atraso usa a aula anterior com lançamento real, não a aula só com placeholders

#### Scenario: Aula agendada com dado pré-copiado é ignorada, mesmo com data <= hoje
- **WHEN** a aula mais recente da turma com `data <= hoje` está com `aula.status = 0` e frequência pré-copiada de uma aula anterior (`presenca <> 0`, mas não realizada de fato), e há uma aula anterior com `status = 1` genuinamente lançada
- **THEN** o cálculo de atraso usa a aula anterior `status = 1`, não a aula agendada com dado copiado

#### Scenario: Turma que nunca lançou nenhuma frequência real
- **WHEN** uma turma tem aulas com `data <= hoje` mas nenhuma satisfaz `status = 1` com `presenca <> 0`
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
O sistema SHALL expor `GET /api/metricas/atraso-lancamento/turma?idTurma=X` e `GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=X`, cada um retornando `diasAtraso`, `dataReferencia` e `dataUltimoLancamento`. `dataUltimoLancamento` SHALL ser a data da aula mais recente (com `data <= hoje`) com frequência efetivamente lançada (`aula.status = 1` e ao menos um registro em `frequencia` com `presenca <> 0`), e SHALL ser `null` quando nunca houve nenhum lançamento real no escopo consultado — diferentemente de `dataReferencia`, que no caso sem lançamento real usa o fallback da aula mais antiga para fins do cálculo de atraso.

#### Scenario: Consulta de atraso por turma
- **WHEN** um cliente faz `GET /api/metricas/atraso-lancamento/turma?idTurma=1597`
- **THEN** a resposta tem status 200 com `diasAtraso`, `dataReferencia` e `dataUltimoLancamento`

#### Scenario: Consulta de atraso por instrutor
- **WHEN** um cliente faz `GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=224`
- **THEN** a resposta tem status 200 com `diasAtraso`, `dataReferencia` e `dataUltimoLancamento`

#### Scenario: Turma com lançamentos tem dataUltimoLancamento igual à dataReferencia
- **WHEN** a turma consultada já teve pelo menos uma frequência real lançada
- **THEN** `dataUltimoLancamento` é igual a `dataReferencia` (a data da aula mais recente com lançamento real)

#### Scenario: dataUltimoLancamento ignora placeholders e aulas não realizadas
- **WHEN** a aula mais recente da turma (`data <= hoje`) só tem registros `presenca = 0`, ou está com `aula.status = 0` mesmo tendo `presenca <> 0` copiada
- **THEN** `dataUltimoLancamento` aponta para a aula anterior genuinamente lançada (`status = 1` e `presenca <> 0`), ou `null` se não houver nenhuma — nunca para a aula só com placeholder ou dado pré-copiado

#### Scenario: Turma que nunca lançou tem dataUltimoLancamento nulo
- **WHEN** a turma consultada tem aulas com `data <= hoje` mas nenhuma satisfaz `status = 1` com `presenca <> 0` (ex.: turma cancelada, cujas aulas nunca chegaram a `status = 1`)
- **THEN** `dataUltimoLancamento` é `null`, enquanto `dataReferencia` e `diasAtraso` continuam calculados pelo fallback (aula mais antiga)

### Requirement: Métricas são somente leitura
Todas as queries usadas pelas métricas desta capability SHALL ser `SELECT`, sem exceção, reutilizando o guard de somente-leitura de `backend/config/database.js` estabelecido na Fase 1.

#### Scenario: Nenhuma escrita é executada
- **WHEN** qualquer endpoint de `/api/metricas/*` é chamado
- **THEN** nenhuma query `INSERT`/`UPDATE`/`DELETE` é executada no banco

### Requirement: Definição de aula com frequência lançada
Uma aula SHALL ser considerada "com frequência lançada" somente se **ambas** as condições forem satisfeitas: (a) `aula.status = 1` (aula efetivamente realizada) e (b) possuir ao menos um registro em `frequencia` com `presenca <> 0`. Nenhuma condição isolada é suficiente:
- Registros com `presenca = 0` são placeholders de "não lançado" (linhas criadas para a aula, mas sem marcação real de presença) e SHALL NOT contar como lançamento, mesmo que `aula.status = 1`.
- Aulas com `aula.status = 0` (ainda não realizadas/agendadas) podem ter `frequencia` pré-preenchida por cópia de uma aula anterior (inclusive em aulas com `data` futura), então `presenca <> 0` sozinho SHALL NOT ser suficiente para considerar a aula lançada.

Esta definição SHALL valer para todo cálculo desta capability que dependa de "aula lançada" — em particular, a data do último lançamento (`dataUltimoLancamento`) e a aula de referência dos dias de atraso.

#### Scenario: Aula só com placeholders não conta como lançada
- **WHEN** uma aula possui registros em `frequencia`, mas todos com `presenca = 0`
- **THEN** essa aula é tratada como "não lançada" (não pode ser a última aula lançada nem a referência de atraso)

#### Scenario: Aula não realizada com frequência pré-preenchida não conta como lançada
- **WHEN** uma aula tem `aula.status = 0` (não realizada) mas já possui registros em `frequencia` com `presenca <> 0` (copiados de uma aula anterior)
- **THEN** essa aula é tratada como "não lançada", independentemente dos valores de `presenca`

#### Scenario: Aula realizada com pelo menos uma marcação real conta como lançada
- **WHEN** uma aula tem `aula.status = 1` (realizada) e possui ao menos um registro em `frequencia` com `presenca <> 0` (ex.: presente, falta, falta justificada)
- **THEN** essa aula é considerada lançada

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

