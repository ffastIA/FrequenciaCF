## Context

`MetricasFrequenciaService.getAtrasoLancamentoPorTurma(idTurma)` (`backend/services/MetricasFrequenciaService.js`) hoje: busca a última aula genuinamente lançada (`FrequenciaModel.getUltimaAulaLancadaPorTurma`, com fallback para a aula mais antiga quando nunca houve lançamento), e calcula `diasAtraso = diffDays(dataReferencia, hoje)`. O método não tem acesso a `turma.status`/`turma.data_fim` hoje — só recebe `idTurma`.

Diagnóstico em produção (500 turmas concluídas amostradas): 47 nunca tiveram lançamento real (caem no fallback já existente), e 64 têm o último lançamento real com data **posterior** à `data_fim` da turma (ex.: turma 425/TMCUL01, término 14/10/2022, último lançamento real 26/10/2022) — confirmando que este é um caso real e frequente (13% da amostra), não hipotético.

## Goals / Non-Goals

**Goals:**
- Para turmas com `status = 3` ("Concluída"), `diasAtraso` = diferença entre `data_fim` e a data de referência do último lançamento, nunca negativo.
- Para as demais situações, `diasAtraso` continua exatamente como hoje (`hoje - dataReferencia`).
- `dataReferencia`/`dataUltimoLancamento` continuam com o mesmo significado e cálculo de hoje (data real do último lançamento ou do fallback) — não fazem parte da mudança.

**Non-Goals:**
- `getAtrasoLancamentoPorInstrutor` (cálculo agregado por instrutor) — não consumido por nenhuma tela do frontend atualmente; fora de escopo.
- Mudar a definição de "aula lançada" (`status = 1` + `presenca <> 0`) ou o fallback (aula mais antiga) — inalterados.
- Tornar a regra configurável por outras situações além de "Concluída" — o pedido é específico para essa situação.

## Decisions

1. **Buscar `status`/`data_fim` da turma dentro do próprio `getAtrasoLancamentoPorTurma`**, via `this.turma.getTurmaById(idTurma)` (já existe, usado em `getFaltasPorAluno`). Alternativa descartada: exigir que o chamador (rota/frontend) informe `status`/`data_fim` como parâmetros — misturaria responsabilidades (o backend deveria ser a fonte de verdade desses dados, não confiar em valores enviados pelo cliente) e é mais frágil a inconsistência. Custo medido: ~10ms por chamada adicional, dentro do mesmo request HTTP (sem round-trip extra).

2. **Ramificação simples por `status === 3`**: quando a turma está concluída, o "hoje" usado na subtração final vira `turma.data_fim` (formatada); para as demais situações, comportamento idêntico ao atual. A busca de qual aula é a referência (`dataReferencia`/`dataUltimoLancamento`) **não muda** — continua buscando com `data <= hoje` como já é hoje, preservando o significado desses dois campos como "a data real do último lançamento", independente da situação da turma. Só o cálculo final de `diasAtraso` (a subtração) muda de base.

3. **Piso em zero (`Math.max(0, ...)`) quando o lançamento aconteceu depois do término**: decisão explícita do responsável, confirmada após eu mostrar que isso acontece em 13% das turmas concluídas amostradas — nesses casos, a frequência foi de fato lançada (só que depois da data de término oficial), então não há atraso pendente a reportar; um valor negativo seria confuso na UI (que hoje já trata `diasAtraso` como número simples, sem lidar com negativos).

4. **Sem mudança na busca de `dataUltimoLancamento`/`dataReferencia`**: continuam buscando aulas com `data <= hoje` (não `data <= data_fim`) — isso é o que permite capturar corretamente os 13% de lançamentos feitos depois do término oficial (se a busca fosse limitada a `data <= data_fim`, o sistema erraria a data real do último lançamento nesses casos, quebrando o significado já documentado desses dois campos).

## Risks / Trade-offs

- [Query adicional por chamada] → Medida em ~10ms, aceitável frente ao padrão já estabelecido do projeto (múltiplas chamadas paralelas por turma no Dashboard).
- [Turma concluída sem `data_fim` preenchida] → Comportamento não coberto explicitamente pelos dados testados; tratado como o fallback mais seguro: se `data_fim` for `null`/ausente, o cálculo cai de volta ao comportamento atual (`hoje - dataReferencia`), evitando quebrar a resposta da API.

## Migration Plan

Mudança aditiva de lógica em backend, sem migração de dados, sem mudança de contrato de API (mesmos campos na resposta). Deploy do backend novo é suficiente; frontend não muda. Rollback: reverter `MetricasFrequenciaService.js`.

## Open Questions

Nenhuma — tratamento do caso "lançamento depois do término" (13% da amostra) confirmado com o responsável (piso em zero).
