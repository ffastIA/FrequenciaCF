## 1. Backend

- [x] 1.1 `MetricasFrequenciaService.getAtrasoLancamentoPorTurma`: buscar a turma (`this.turma.getTurmaById(idTurma)`) para obter `status`/`data_fim`
- [x] 1.2 Quando `status === 3` e `data_fim` preenchida: calcular `diasAtraso` como `Math.max(0, diffDays(dataReferencia, data_fim formatada))`, em vez de `diffDays(dataReferencia, hoje)`
- [x] 1.3 Para demais casos (status ≠ 3, ou `data_fim` ausente mesmo com status = 3): manter `diffDays(dataReferencia, hoje)` exatamente como está
- [x] 1.4 Confirmar que a busca de `dataReferencia`/`dataUltimoLancamento` (qual aula é a referência) não foi alterada
- [x] 1.5 Atualizar `backend/API.md` (nova regra documentada na descrição do endpoint) e `backend/tests.http`
- [x] 1.6 Confirmar que a nova query (`getTurmaById`) é `SELECT` (guard de somente-leitura intacto)

## 2. Validação contra o banco real

- [x] 2.1 Turma concluída com último lançamento **antes** do término (ex.: turma 425/TMCUL01 é o inverso — buscar uma com lançamento antes): `diasAtraso` bate com `data_fim - dataReferencia` calculado manualmente
- [x] 2.2 Turma concluída com último lançamento **depois** do término (ex.: turma 425/TMCUL01, término 14/10/2022, lançamento 26/10/2022): `diasAtraso = 0`
- [x] 2.3 Turma concluída que nunca lançou nada (cai no fallback): `diasAtraso` = `data_fim - aula mais antiga`, com piso em 0
- [x] 2.4 Turma não concluída (iniciada, não iniciada, cancelada): `diasAtraso` idêntico ao comportamento anterior à mudança (regressão)
- [x] 2.5 Medir tempo de resposta do endpoint com a query adicional, confirmando que não há degradação perceptível

## 3. Testes manuais no navegador

- [x] 3.1 Dashboard: turmas concluídas mostram "Dias em Atraso" congelado (não crescendo mais com o tempo), coerente com a data de término
- [x] 3.2 Dashboard: turmas não concluídas continuam mostrando o valor de sempre (regressão visual)
- [x] 3.3 Detalhe da turma (drill-down) de uma turma concluída: "Dias de atraso no lançamento" reflete a nova regra
- [x] 3.4 Sem erros no console
