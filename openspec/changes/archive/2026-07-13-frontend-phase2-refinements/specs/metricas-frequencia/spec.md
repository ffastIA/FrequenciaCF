## MODIFIED Requirements

### Requirement: Endpoints de atraso de lançamento
O sistema SHALL expor `GET /api/metricas/atraso-lancamento/turma?idTurma=X` e `GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=X`, cada um retornando `diasAtraso`, `dataReferencia` e `dataUltimoLancamento`. `dataUltimoLancamento` SHALL ser a data da aula mais recente (com `data <= hoje`) que já possui pelo menos um registro em `frequencia`, e SHALL ser `null` quando nunca houve nenhum lançamento no escopo consultado — diferentemente de `dataReferencia`, que no caso sem lançamento usa o fallback da aula mais antiga para fins do cálculo de atraso.

#### Scenario: Consulta de atraso por turma
- **WHEN** um cliente faz `GET /api/metricas/atraso-lancamento/turma?idTurma=1597`
- **THEN** a resposta tem status 200 com `diasAtraso`, `dataReferencia` e `dataUltimoLancamento`

#### Scenario: Consulta de atraso por instrutor
- **WHEN** um cliente faz `GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=224`
- **THEN** a resposta tem status 200 com `diasAtraso`, `dataReferencia` e `dataUltimoLancamento`

#### Scenario: Turma com lançamentos tem dataUltimoLancamento igual à dataReferencia
- **WHEN** a turma consultada já teve pelo menos uma frequência lançada
- **THEN** `dataUltimoLancamento` é igual a `dataReferencia` (a data da aula mais recente já lançada)

#### Scenario: Turma que nunca lançou tem dataUltimoLancamento nulo
- **WHEN** a turma consultada tem aulas com `data <= hoje` mas nenhuma frequência lançada
- **THEN** `dataUltimoLancamento` é `null`, enquanto `dataReferencia` e `diasAtraso` continuam calculados pelo fallback (aula mais antiga)
