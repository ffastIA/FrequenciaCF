## 1. Extensão do Model Frequencia

- [x] 1.1 Implementar `getFaltasEPrevistasPorAluno(idTurma, idAluno, dataInicio, dataFim)` em `backend/models/Frequencia.js` (uma query com `SUM(CASE WHEN presenca = 2 ...)` para `quantidadeFaltas` + contagem de `aulasPrevistas`)
- [x] 1.2 Implementar `getAulasSemFrequenciaLancada(idTurma, dataInicio, dataFim)` (aulas do período sem nenhum registro em `frequencia`, via `NOT EXISTS`)
- [x] 1.3 Implementar `getUltimaAulaLancadaPorTurma(idTurma)` (aula mais recente com `data <= hoje` que já possui frequência)
- [x] 1.4 Implementar `getPrimeiraAulaPorTurma(idTurma, dataLimite)` (fallback: aula mais antiga com `data <= dataLimite`)
- [x] 1.5 Implementar `getUltimaAulaLancadaPorInstrutor(idInstrutor)` (JOIN `aula` → `turma` filtrando `turma.id_instrutor`)
- [x] 1.6 Validar os 5 métodos com IDs reais do banco, conferindo os números manualmente

## 2. Service de Métricas

- [x] 2.1 Criar `backend/services/MetricasFrequenciaService.js` recebendo os models de `Frequencia` e `Turma` no construtor
- [x] 2.2 Implementar `getFaltasPorAluno(idTurma, idAluno, dataInicio, dataFim)` — resolve default de `dataInicio` (via `turma.data_inicio`), capa `dataFim` em `min(dataFim, hoje)`, retorna `quantidadeFaltas`, `percentualFaltas` (com proteção contra divisão por zero), `aulasPrevistas` e `aulasSemFrequenciaLancada`
- [x] 2.3 Implementar `getAtrasoLancamentoPorTurma(idTurma)` — aplica os fallbacks (nunca lançou / sem aula passada)
- [x] 2.4 Implementar `getAtrasoLancamentoPorInstrutor(idInstrutor)` — agrega por `turma.id_instrutor`, mesmos fallbacks

## 3. Rotas de Métricas

- [x] 3.1 Criar `backend/routes/api/metricas.js` e registrar em `server.js` como `app.use('/api/metricas', ...)`
- [x] 3.2 Implementar `GET /api/metricas/faltas?idTurma=X&idAluno=Y&dataInicio=&dataFim=` com validação Joi (`idTurma`/`idAluno` obrigatórios; `dataInicio`/`dataFim` formato ISO, opcionais)
- [x] 3.3 Implementar `GET /api/metricas/atraso-lancamento/turma?idTurma=X` com validação Joi (`idTurma` obrigatório)
- [x] 3.4 Implementar `GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=X` com validação Joi (`idInstrutor` obrigatório)

## 4. Testes Integrados

- [x] 4.1 Adicionar os 3 novos endpoints em `backend/tests.http`
- [x] 4.2 Testar aluno com faltas e aluno sem faltas no mesmo período
- [x] 4.3 Testar `dataFim` futura informada no filtro (confirmar que não conta aulas além de hoje)
- [x] 4.4 Testar turma com aulas sem nenhuma frequência lançada (`aulasSemFrequenciaLancada > 0`, sem gerar falta)
- [x] 4.5 Testar turma sem nenhum lançamento histórico (fallback da Métrica 3: primeira aula como referência)
- [x] 4.6 Testar instrutor com múltiplas turmas (atraso agregado bate com a turma mais atrasada)
- [x] 4.7 Validar performance (< 1s por query) com IDs reais do banco de produção
- [x] 4.8 Confirmar que nenhum endpoint novo executa `INSERT`/`UPDATE`/`DELETE` (guard de somente-leitura continua ativo)

## 5. Documentação

- [x] 5.1 Atualizar `backend/API.md` com os 3 novos endpoints, exemplos de request/response e as fórmulas das métricas
- [x] 5.2 Atualizar `backend/README.md` se a estrutura de pastas mudar (novo service, nova rota)
