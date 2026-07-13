## 1. Backend

- [x] 1.1 `TurmaModel.getTurmasPorProjetoAditivo`: adicionar `totalAlunosAtivos` via subquery correlacionado (`SELECT COUNT(*) FROM matricula m WHERE m.id_turma = t.id_turma AND m.situacao = 7`)
- [x] 1.2 Atualizar `backend/API.md` (novo campo na resposta de `GET /api/filtros/turmas`) e `backend/tests.http`
- [x] 1.3 Confirmar que a query continua `SELECT` (guard de somente-leitura intacto)

## 2. Validação do backend contra o banco real

- [x] 2.1 Turma conhecida com alunos ativos (5986): `totalAlunosAtivos` bate com a contagem já validada (6)
- [x] 2.2 Turma sem nenhum aluno ativo: `totalAlunosAtivos = 0`, não `null`
- [x] 2.3 Confirmar que o número de linhas retornado não muda (uma linha por turma, sem duplicação por causa do subquery)
- [x] 2.4 Medir tempo de resposta com o campo novo, confirmando que não há degradação perceptível

## 3. Frontend

- [x] 3.1 `Dashboard.jsx`: nova coluna "Alunos ativos" no array `colunas`, posicionada após "Situação" e antes de "Início", com extrator `(t) => t.totalAlunosAtivos` (tipo número)
- [x] 3.2 Novo `<th>`/`<td>` correspondente na tabela, exibindo o valor diretamente (sem estado de carregamento)

## 4. Testes manuais no navegador

- [x] 4.1 Turma com alunos ativos: coluna mostra o número correto, sem "..." nem atraso de carregamento
- [x] 4.2 Turma sem alunos ativos: coluna mostra `0`
- [x] 4.3 Ordenar por "Alunos ativos": numérico correto, crescente/decrescente, turmas com `0` participam normalmente da ordenação (não vão para o final como valores ausentes)
- [x] 4.4 Coluna aparece na posição correta (após Situação, antes de Início)
- [x] 4.5 Demais colunas e filtros (código, instrutor, situação) continuam funcionando normalmente (regressão)
- [x] 4.6 Sem erros no console
