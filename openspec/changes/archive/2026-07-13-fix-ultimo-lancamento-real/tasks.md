## 1. Correção no backend (rodada 1: placeholders)

- [x] 1.1 `getUltimaAulaLancadaPorTurma`: acrescentar `AND f.presenca <> 0` ao `EXISTS` de `frequencia`
- [x] 1.2 `getUltimaAulaLancadaPorInstrutor`: acrescentar `AND f.presenca <> 0` ao `EXISTS` de `frequencia`
- [x] 1.3 Atualizar comentários das duas queries (definição de "aula lançada" = presenca<>0; placeholder=0 não conta)
- [x] 1.4 Atualizar `backend/API.md` na semântica de `dataUltimoLancamento`/`dataReferencia` (lançamento real, não placeholder)
- [x] 1.5 Confirmar que as queries continuam `SELECT` (guard de somente-leitura intacto)

## 2. Validação contra o banco real (rodada 1)

- [x] 2.1 Turma com aula recente só de placeholders: `dataUltimoLancamento` passa a apontar o lançamento real anterior (comparar antes/depois numa das 76 turmas identificadas)
- [x] 2.2 Turma sem nenhum lançamento real: `dataUltimoLancamento = null`, `diasAtraso` pelo fallback
- [x] 2.3 Turma com lançamento real recente (sem placeholder): resultado inalterado; `dataUltimoLancamento == dataReferencia`
- [x] 2.4 Endpoint por instrutor: mesma correção refletida

## 3. Correção no backend (rodada 2: aulas não realizadas com dado pré-copiado)

- [x] 3.1 Diagnosticar o report de IR2-2602/OBR2-2602 ainda retornando hoje mesmo após a rodada 1; confirmar copy-forward comparando `frequencia` aluno a aluno entre aulas
- [x] 3.2 Confirmar em aulas futuras (data > hoje) que a pré-cópia independe de "hoje" — é generalizada para todo o curso, correlacionada com `aula.status = 0`
- [x] 3.3 `getUltimaAulaLancadaPorTurma`/`PorInstrutor`: acrescentar `AND au.status = 1` como condição adicional
- [x] 3.4 Validar que `status = 1` não descarta lançamento genuíno em massa (checar turmas sem nenhuma aula `status = 1` apesar de `presenca <> 0`)
- [x] 3.5 Atualizar `API.md`, `design.md`, `proposal.md` e o delta de spec com a definição completa (duas condições)

## 4. Validação contra o banco real (rodada 2)

- [x] 4.1 IR2-2602 (turma 5986): `dataUltimoLancamento` = 08/07/2026 (era 13/07/2026 com 0 dias de atraso)
- [x] 4.2 OBR2-2602 (turma 6010): `dataUltimoLancamento` = 01/07/2026 (era 13/07/2026); aulas de 06/07 e 08/07 também eram cópia, não lançamento real
- [x] 4.3 Amostra de outras turmas do lote de 54 identificadas (300, 393): resultado corrigido
- [x] 4.4 Turma de controle com lançamento real antigo (1597): resultado inalterado
- [x] 4.5 Caso-limite: turma cancelada sem nenhuma aula `status = 1` (5955): `dataUltimoLancamento = null` corretamente, não regressão
