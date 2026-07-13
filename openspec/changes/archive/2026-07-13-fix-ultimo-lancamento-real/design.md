## Context

`backend/models/Frequencia.js` determina a "aula mais recente lançada" com:
`... AND EXISTS (SELECT 1 FROM frequencia f WHERE f.id_aula = au.id_aula) ORDER BY au.data DESC LIMIT 1`.
Esse `EXISTS` casa com qualquer linha de `frequencia`, inclusive `presenca = 0`. `MetricasFrequenciaService.getAtrasoLancamentoPorTurma/PorInstrutor` usa o resultado tanto para `dataUltimoLancamento` quanto (via fallback) para `dataReferencia`/`diasAtraso`.

Diagnóstico no banco de produção (somente leitura), em duas rodadas de investigação:

**Causa 1 — placeholders:**
- `frequencia.presenca`: 0→27.402, 1→426.395, 2→92.603, 3→24.459, 4→2.252. O valor `0` é o "não lançado" (placeholder).
- 76 turmas têm a "última aula lançada" apontando para aula só com `presenca = 0`; a data real de lançamento é anterior ou inexistente.

**Causa 2 — cópia adiantada em aulas não realizadas (descoberta ao investigar o report de IR2-2602/OBR2-2602):**
- Mesmo após exigir `presenca <> 0`, as turmas 5986 (IR2-2602) e 6010 (OBR2-2602) continuavam retornando a data de hoje. Comparação aluno a aluno mostrou que a `frequencia` da aula de hoje é **idêntica** à de uma aula anterior (ex.: turma 5986, aula de 13/07 idêntica à de 08/07). Mais revelador: aulas **claramente futuras** (semanas à frente, ex.: turma 6010 em 15/07, 20/07, 22/07...) já têm `frequencia` populada com o mesmo padrão — confirmando que o sistema pré-gera a frequência de aulas ainda não dadas.
- `aula.status` distingue os dois casos: aulas realmente dadas têm `status = 1`; aulas agendadas/pré-preenchidas (incluindo as com dado copiado) têm `status = 0`.
- Validação de que `status = 1` é um sinal confiável e não introduz regressão: 1.796 de 1.797 turmas com lançamento real (`presenca <> 0`) possuem ao menos uma aula `status = 1` — a única exceção, turma 5955, está com `turma.status = 3` (Cancelada) e nunca teve aula genuinamente dada, então `dataUltimoLancamento: null` é o resultado correto para ela. Também verificado em amostra que aulas antigas `status = 0` com dado genuinamente variado (não copiado) coexistem, na mesma turma, com aulas `status = 1` mais recentes ou próximas — ou seja, exigir `status = 1` nunca "perde" o lançamento real, no máximo ignora um registro isolado e desatualizado a favor de um mais confiável.

## Goals / Non-Goals

**Goals:**
- "Aula lançada" = existe `frequencia` com `presenca <> 0` **e** `aula.status = 1` (realizada).
- `dataUltimoLancamento` reflete o lançamento real mais recente (ou `null`).
- `diasAtraso`/`dataReferencia` usam a mesma definição (coerência phase2, atraso mais preciso).
- Banco somente leitura preservado.

**Non-Goals:**
- Rever o indicador `aulasSemFrequenciaLancada` da métrica de faltas (usa `NOT EXISTS(frequencia)`), fora de escopo desta change.
- Mudar assinaturas de service/endpoint ou o contrato JSON (campos continuam os mesmos).
- Introduzir configuração para o que conta como "lançado".

## Decisions

1. **Corrigir no SQL, com duas condições combinadas**: acrescentar `AND au.status = 1` (no `WHERE`) e `AND f.presenca <> 0` (no `EXISTS`) em `getUltimaAulaLancadaPorTurma` e `getUltimaAulaLancadaPorInstrutor`. É a menor mudança correta e mantém o filtro no banco (padrão do projeto). O fallback (`getPrimeiraAula...`) permanece: quando não há lançamento real, `dataUltimoLancamento` fica `null` e o atraso usa a aula mais antiga — comportamento já especificado na phase2.

2. **`presenca <> 0` como critério de "marcação real"**: `0` é o único valor de "não lançado" (placeholder); `1` (presente), `2` (falta), `3` (falta justificada) e `4` são marcações reais. Usar `<> 0` evita enumerar valores e resiste a novos códigos de marcação futuros.

3. **`aula.status = 1` como critério de "aula de fato realizada"**: necessário além de `presenca <> 0` porque aulas com `status = 0` podem ter `frequencia` pré-populada por cópia (mesmo em aulas futuras), tornando `presenca <> 0` insuficiente sozinho. Alternativa descartada: comparar a `frequencia` de cada aula com a da aula anterior para detectar cópia — mais frágil (colisão legítima quando a turma realmente repete os mesmos presentes) e mais caro de expressar em SQL; `status = 1` é um sinal direto já mantido pelo sistema de origem e validado contra 1.797 turmas sem gerar falso-negativo relevante.

4. **Aplicar nos dois campos (decisão do responsável, mantida da rodada anterior)**: como `dataUltimoLancamento` e `dataReferencia` derivam da mesma query, corrigir a query mantém os dois coerentes (a phase2 definiu que são iguais quando há lançamento) e torna `diasAtraso` mais preciso. Alternativa (query separada só para `dataUltimoLancamento`) foi descartada por quebrar essa igualdade e deixar o atraso subestimado.

## Risks / Trade-offs

- [`diasAtraso` aumenta em ~130 turmas] → Esperado e correto: hoje o atraso é subestimado porque placeholders e aulas pré-preenchidas contam como lançamento. Sem impacto em turmas sem esses padrões.
- [Turmas cujo único "lançamento" eram placeholders ou aulas não realizadas] → passam a ter `dataUltimoLancamento: null` e atraso pelo fallback (aula mais antiga) — que é a representação correta de "nunca lançou de verdade" (caso confirmado: turma 5955, cancelada, nunca teve aula `status = 1`).
- [`status = 1` poderia, em tese, ignorar um lançamento genuíno registrado numa aula que nunca foi marcada como realizada] → Verificado que isso não ocorre na prática: nos casos amostrados, aulas `status = 0` com dado genuíno coexistem com aulas `status = 1` mais recentes/próximas na mesma turma: a exigência nunca "perde" dado real, só ignora um registro isolado a favor de um mais confiável.

## Migration Plan

Somente backend, sem migração de dados. Deploy do backend novo; o frontend não muda (consome os mesmos campos). Rollback: reverter `Frequencia.js`.

## Open Questions

Nenhuma — alcance (dois campos) e critério (`presenca <> 0`) confirmados com o responsável.
