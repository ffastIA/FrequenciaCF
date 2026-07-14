## 1. Backend

- [x] 1.1 `TurmaModel.getTurmasPorProjetoAditivo`: adicionar `totalAlunosMatriculados` via subquery correlacionado (`SELECT COUNT(*) FROM matricula m WHERE m.id_turma = t.id_turma AND m.situacao = 1`), ao lado do subquery já existente de `totalAlunosAtivos`
- [x] 1.2 Atualizar `backend/API.md` (novo campo na resposta de `GET /api/filtros/turmas`) e `backend/tests.http`
- [x] 1.3 Confirmar que a query continua `SELECT` (guard de somente-leitura intacto)

## 2. Validação do backend contra o banco real

- [x] 2.1 Turma conhecida sem alunos matriculados (5986, 6010, 4125, 5955): `totalAlunosMatriculados = 0`, não `null`
- [x] 2.2 Turma com alunos matriculados (buscar uma via `SELECT id_turma, COUNT(*) FROM matricula WHERE situacao = 1 GROUP BY id_turma ORDER BY COUNT(*) DESC LIMIT 1`): valor bate com a contagem manual
- [x] 2.3 Confirmar que o número de linhas retornado não muda (uma linha por turma, sem duplicação por causa dos dois subqueries)
- [x] 2.4 Medir tempo de resposta com os dois campos, confirmando que não há degradação perceptível

## 3. Frontend

- [x] 3.1 `Dashboard.jsx`: nova coluna "Alunos Matriculados" no array `colunas`, posicionada entre "situacao" e "alunosAtivos", com extrator `(t) => t.totalAlunosMatriculados` (tipo número, classe `col-num`)
- [x] 3.2 Novo `<th>`/`<td>` correspondente na tabela, na posição correta, exibindo o valor diretamente (sem estado de carregamento)

## 4. Testes manuais no navegador

- [x] 4.1 Confirmar ordem final das colunas: Código, Curso, Instrutor, Situação, Alunos Matriculados, Alunos ativos, Início, Término, Último Lançamento, Dias em Atraso
- [x] 4.2 Turma com alunos matriculados: coluna mostra o número correto, sem "..." nem atraso de carregamento
- [x] 4.3 Turma sem alunos matriculados: coluna mostra `0`
- [x] 4.4 Cabeçalho "Alunos Matriculados" quebra em 2 linhas, igual às demais colunas (sem CSS novo)
- [x] 4.5 Ordenar por "Alunos Matriculados": numérico correto, crescente/decrescente, turmas com `0` participam normalmente
- [x] 4.6 Demais colunas, ordenação e filtros (código, instrutor, situação) continuam funcionando normalmente (regressão)
- [x] 4.7 Sem erros no console
