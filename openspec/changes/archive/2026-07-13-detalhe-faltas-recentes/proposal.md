## Why

Na tela de detalhe da turma, a tabela de alunos mostra `quantidadeFaltas`/`percentualFaltas` acumulados desde o início da turma. Isso não deixa evidente quais alunos estão faltando **recentemente** — um aluno com bom histórico mas que faltou nas últimas aulas passa despercebido. O pedido é uma coluna nova, totalizando as faltas de cada aluno nas **últimas 4 aulas** da turma.

## What Changes

- **Novo endpoint de backend**: `GET /api/metricas/faltas-recentes?idTurma=X`, retornando, para a turma inteira numa única chamada, a quantidade de faltas de cada aluno nas últimas 4 aulas **realizadas** (`aula.status = 1`, `data <= hoje`) da turma, mais o número de aulas efetivamente consideradas (pode ser menor que 4 em turmas recém-iniciadas).
- **Escopo das aulas = só realizadas (`status = 1`)**: mesma definição já adotada na correção de `dataUltimoLancamento` (change `fix-ultimo-lancamento-real`), para não contar aulas agendadas com `frequencia` pré-copiada como se fossem faltas reais.
- **Turma com menos de 4 aulas realizadas**: a contagem usa as aulas disponíveis (1, 2 ou 3), sem esperar acumular 4.
- **Exibição**: nova coluna "Faltas (últimas 4 aulas)" na tabela de alunos da tela de detalhe da turma, no formato `faltas/aulasConsideradas` (ex.: `2/4`, `1/2`), e "—" quando a turma ainda não tem nenhuma aula realizada.
- **Uma chamada por turma, não por aluno**: diferente do padrão usado para `quantidadeFaltas`/`percentualFaltas` (uma chamada `GET /api/metricas/faltas` por aluno em paralelo), esta métrica é naturalmente turma-cêntrica (as "últimas 4 aulas" são as mesmas para todos os alunos da turma), então uma única chamada retorna os dados de todos os alunos de uma vez.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `metricas-frequencia`: novo endpoint `GET /api/metricas/faltas-recentes`.
- `frontend-dashboard`: nova coluna na tabela de alunos da tela de detalhe da turma.

## Impact

- **Backend alterado**: `backend/models/Frequencia.js` (nova query para as últimas N aulas realizadas + faltas por aluno), `backend/services/MetricasFrequenciaService.js` (novo método), `backend/routes/api/metricas.js` (nova rota `GET`), `backend/API.md`, `backend/tests.http`.
- **Frontend alterado**: `frontend/src/api/metricas.js` (nova função), `frontend/src/pages/TurmaDetalhe.jsx` (nova coluna, uma chamada por turma).
- **Sem mudança de schema/dependências**; banco continua **somente leitura** (`SELECT`).
- **Compatibilidade**: endpoint novo, não afeta nenhum contrato existente.
