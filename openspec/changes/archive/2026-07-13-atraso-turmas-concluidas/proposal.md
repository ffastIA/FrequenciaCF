## Why

Hoje, "dias em atraso" é sempre calculado como `hoje - data de referência do último lançamento` — inclusive para turmas já **concluídas**. Isso faz o número crescer indefinidamente mesmo depois que a turma acabou e ninguém mais vai lançar nada: uma turma concluída em 2022 mostra milhares de "dias de atraso" hoje, o que não é útil (não representa nenhuma pendência real, só o tempo que passou desde então). Para turmas concluídas, o que interessa é: quantos dias se passaram **entre o término da turma e o último lançamento real** — ou seja, o atraso "congela" no momento em que a turma terminou, em vez de continuar contando para sempre.

## What Changes

- **Nova regra só para turmas com `status = 3` ("Concluída")**: `diasAtraso` passa a ser calculado como a diferença entre `data_fim` (término da turma) e a data de referência do último lançamento (`dataReferencia`/`dataUltimoLancamento`), em vez de `hoje - dataReferencia`.
- **Piso em zero quando o lançamento aconteceu depois do término**: confirmado no banco que ~13% das turmas concluídas têm o último lançamento real com data posterior à `data_fim` (ex.: turma encerrada em 14/10/2022, último lançamento real em 26/10/2022). Decisão do responsável: nesse caso, `diasAtraso = 0` (o trabalho foi concluído, sem pendência), em vez de um valor negativo.
- **Nenhuma mudança para as demais situações** (não especificado, não iniciada, iniciada, cancelada): o cálculo continua exatamente como está hoje (`hoje - dataReferencia`).
- **`dataReferencia` e `dataUltimoLancamento` não mudam de significado**: continuam representando a data real do último lançamento (ou do fallback, aula mais antiga, quando nunca houve lançamento) — a mudança afeta só o número final de `diasAtraso`, não a busca de qual aula é a referência.
- **Escopo: só o cálculo por turma** (`getAtrasoLancamentoPorTurma`, usado no Dashboard e no detalhe da turma). O cálculo agregado por instrutor (`getAtrasoLancamentoPorInstrutor`) não é consumido por nenhuma tela do frontend hoje — fica fora de escopo desta change.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `metricas-frequencia`: regra de cálculo de `diasAtraso` por turma passa a depender da situação da turma.

## Impact

- **Backend alterado**: `backend/services/MetricasFrequenciaService.js` (`getAtrasoLancamentoPorTurma` passa a buscar `status`/`data_fim` da turma e ramificar o cálculo), `backend/API.md`, `backend/tests.http`.
- **Uma query adicional por chamada** (`TurmaModel.getTurmaById`, já existente, ~10ms medido em produção) — sem round-trip HTTP extra, dentro do mesmo request.
- **Sem mudança de frontend**: o Dashboard e o detalhe da turma já exibem `diasAtraso` sem lógica própria — passam a receber o valor já calculado corretamente pela API.
- **Sem mudança de schema/dependências**; banco continua somente leitura (`SELECT`).
