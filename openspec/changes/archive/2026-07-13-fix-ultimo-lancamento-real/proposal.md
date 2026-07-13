## Why

A data do "último lançamento de frequência" (`dataUltimoLancamento`) às vezes aponta para uma data recente (inclusive hoje) em que **não houve lançamento real** — reportado concretamente nas turmas IR2-2602 (esperado 08/07/2026, sistema retornava 13/07/2026 com 0 dias de atraso) e OBR2-2602. Duas causas confirmadas no banco de produção, ambas na mesma query:

1. A tabela `frequencia` tem 27.402 linhas com `presenca = 0` — placeholders de "não lançado" (linhas criadas para a aula, mas sem marcação real de presença). A query original considerava uma aula "lançada" se existisse **qualquer** registro em `frequencia`, contando esses placeholders. Afetava 76 turmas.
2. Aulas futuras/agendadas (`aula.status = 0`, "não realizada") já vêm com `frequencia` **pré-copiada** de uma iteração anterior (mesmos valores de `presenca` por aluno, inclusive em aulas ainda não ocorridas — confirmado em aulas com `data` semanas à frente da data atual). Mesmo depois de exigir `presenca <> 0`, essas aulas ainda contavam como "lançadas" por já terem esse valor pré-copiado diferente de zero. Afetava mais 54 turmas (incluindo IR2-2602 e OBR2-2602).

Validado que `aula.status = 1` ("realizada") é um sinal confiável de aula genuinamente dada: 1.796 de 1.797 turmas com lançamento real possuem ao menos uma aula `status = 1`; a única exceção (turma 5955) está com `status = 3` (Cancelada) e nunca teve aula de fato — comportamento `null` correto para ela.

## What Changes

- **Definição corrigida de "aula com frequência lançada"**: uma aula só conta como lançada se (a) tiver ao menos um registro em `frequencia` com `presenca <> 0` **e** (b) `aula.status = 1` (realizada). As duas condições são necessárias: placeholders (`presenca = 0`) e aulas ainda não realizadas com dado pré-copiado (`status = 0`) deixam de contar.
- **`dataUltimoLancamento`** passa a refletir a data da aula mais recente (com `data <= hoje`) genuinamente realizada e lançada, e `null` quando a turma nunca teve lançamento real.
- **Dias de atraso** (`dataReferencia` / `diasAtraso`): a mesma definição corrigida passa a valer para o cálculo de atraso — decisão do responsável de aplicar nos dois campos, mantendo-os coerentes (como definido na phase2) e tornando o atraso mais preciso (hoje ele subestima o atraso em ~130 turmas ao contar placeholders/pré-cópias como lançamento).
- **Escopo mantido no cálculo de atraso/último lançamento**: os indicadores de "aulas sem frequência lançada" da métrica de faltas ficam fora desta change (podem ser revistos depois, se necessário).

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `metricas-frequencia`: define "aula com frequência lançada" como `presenca <> 0`; aplica à data do último lançamento e ao cálculo de dias de atraso (turma e instrutor).

## Impact

- **Backend alterado**: `backend/models/Frequencia.js` (`getUltimaAulaLancadaPorTurma` e `getUltimaAulaLancadaPorInstrutor` passam a exigir `presenca <> 0` **e** `au.status = 1` no `EXISTS`/`WHERE`). Sem mudança de assinatura; o `MetricasFrequenciaService` e os endpoints continuam iguais.
- **Comportamento**: `dataUltimoLancamento` corrigido; `diasAtraso` pode aumentar em ~130 turmas (fica mais preciso). `backend/API.md` atualizado na descrição da semântica.
- **Sem mudança de frontend**, sem dependências novas, banco continua **somente leitura** (apenas `SELECT`).
- **Compatibilidade**: turmas que nunca tiveram lançamento real (ou nunca tiveram nenhuma aula `status = 1`, como turmas canceladas) seguem caindo no fallback (aula mais antiga) para `dataReferencia`/`diasAtraso`, com `dataUltimoLancamento: null` — igual à semântica da phase2, agora sem os dois falso-positivos identificados.
