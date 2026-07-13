## ADDED Requirements

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

## MODIFIED Requirements

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
