## 1. Backend

- [x] 1.1 `Frequencia.js`: nova query auxiliar para as últimas N aulas realizadas de uma turma (`status = 1`, `data <= hoje`, `ORDER BY data DESC, id_aula DESC LIMIT N`)
- [x] 1.2 `Frequencia.js`: nova query que, dada a lista de aula ids, retorna `{ idAluno, quantidadeFaltas }` para todos os alunos matriculados na turma (LEFT JOIN matricula → frequencia, presenca = 2)
- [x] 1.3 `MetricasFrequenciaService.js`: novo método `getFaltasRecentesPorTurma(idTurma, quantidadeAulas = 4)` combinando as duas queries e retornando `{ idTurma, aulasConsideradas, porAluno }`
- [x] 1.4 `routes/api/metricas.js`: nova rota `GET /faltas-recentes` com validação Joi (`idTurma` obrigatório, number)
- [x] 1.5 Atualizar `backend/API.md` e `backend/tests.http` com o endpoint novo
- [x] 1.6 Confirmar que a nova rota é `GET` e as queries são `SELECT` (guard de somente-leitura intacto)

## 2. Validação do backend contra o banco real

- [x] 2.1 Turma com 4+ aulas realizadas: `aulasConsideradas = 4`, contagem de faltas por aluno bate com inspeção manual da `frequencia` das últimas 4 aulas
- [x] 2.2 Turma com menos de 4 aulas realizadas (ex.: turma com só 1 ou 2): `aulasConsideradas` reflete o total disponível
- [x] 2.3 Turma sem nenhuma aula realizada (só `status = 0`): `aulasConsideradas = 0`, todo aluno com `quantidadeFaltas = 0`
- [x] 2.4 Turma com múltiplas aulas na mesma data: confirmar que a ordenação (`data DESC, id_aula DESC`) pega as 4 aulas certas, sem pular nem duplicar
- [x] 2.5 Aluno sem registro de frequência numa das aulas consideradas: não conta como falta

## 3. Frontend

- [x] 3.1 `api/metricas.js`: nova função `getFaltasRecentes(idTurma)`
- [x] 3.2 `TurmaDetalhe.jsx`: buscar faltas recentes (uma chamada por turma) junto com a busca de alunos/atraso
- [x] 3.3 `TurmaDetalhe.jsx`: nova coluna "Faltas (últimas 4 aulas)" na tabela de alunos, formato `X/aulasConsideradas`, casando por `id_aluno`; "—" quando `aulasConsideradas = 0`

## 4. Testes manuais no navegador

- [x] 4.1 Turma em andamento com 4+ aulas realizadas: coluna nova exibe `X/4` coerente com os dados do backend
- [x] 4.2 Turma recém-iniciada (poucas aulas realizadas): coluna exibe `X/N` com N < 4
- [x] 4.3 Turma sem nenhuma aula realizada: coluna exibe "—" para todos os alunos
- [x] 4.4 Sem erros no console; nenhuma requisição de escrita
