## MODIFIED Requirements

### Requirement: Tela de detalhe da turma
A rota `/turmas/:idTurma` SHALL exibir os dados básicos da turma (quando disponíveis via navegação a partir do Dashboard) — incluindo data de início e data de término —, seu `diasAtraso` e a data do último lançamento de frequência (`dataUltimoLancamento`, exibindo "—" quando `null`), e uma tabela somente com os alunos **ativos** da turma (via `GET /api/filtros/alunos?idTurma=X&situacao=7`), cada um com `quantidadeFaltas` e `percentualFaltas` acumulados (via `GET /api/metricas/faltas?idTurma=X&idAluno=Y`, uma chamada por aluno em paralelo) e a quantidade de faltas nas últimas 4 aulas realizadas da turma (via `GET /api/metricas/faltas-recentes?idTurma=X`, uma única chamada para a turma inteira, casando o resultado por `idAluno`), exibida como `faltas/aulasConsideradas` (ex.: `2/4`) e "—" quando a turma não tiver nenhuma aula realizada. Quando a turma não tiver nenhum aluno em situação "ativo", a tela SHALL exibir mensagem específica de que não há alunos ativos (distinta de "sem alunos matriculados"). Quando a tela é acessada diretamente (sem navegação prévia pelo Dashboard), os dados básicos da turma podem estar indisponíveis, mas `diasAtraso`, último lançamento e a tabela de alunos SHALL continuar funcionando normalmente.

#### Scenario: Detalhe mostra atraso, último lançamento e faltas por aluno ativo
- **WHEN** o usuário acessa `/turmas/:idTurma` a partir de um clique na tabela do Dashboard
- **THEN** a tela exibe início/término da turma, `diasAtraso`, a data do último lançamento formatada, e uma tabela contendo somente os alunos com `matricula.situacao = 7`, com `quantidadeFaltas` e `percentualFaltas` acumulados de cada um

#### Scenario: Coluna de faltas recentes exibida por aluno
- **WHEN** a tela de detalhe carrega a lista de alunos ativos de uma turma com pelo menos 4 aulas realizadas
- **THEN** cada linha da tabela mostra também uma coluna com a quantidade de faltas do aluno nas últimas 4 aulas, no formato `X/4`

#### Scenario: Faltas recentes em turma com poucas aulas realizadas
- **WHEN** a turma consultada tem, por exemplo, apenas 2 aulas realizadas
- **THEN** a coluna de faltas recentes mostra `X/2` para cada aluno, refletindo o número real de aulas consideradas

#### Scenario: Faltas recentes em turma sem nenhuma aula realizada
- **WHEN** a turma consultada não tem nenhuma aula realizada (`aulasConsideradas = 0`)
- **THEN** a coluna de faltas recentes exibe "—" para todos os alunos, não "0/0"

#### Scenario: Turma sem alunos ativos
- **WHEN** a turma acessada não tem nenhum aluno com `matricula.situacao = 7` (ex.: turma concluída)
- **THEN** a tela exibe uma mensagem indicando que não há alunos **ativos** nesta turma, sem erro

#### Scenario: Acesso direto sem estado de navegação
- **WHEN** a rota `/turmas/:idTurma` é acessada diretamente (ex.: link direto, F5), sem o estado de navegação do Dashboard
- **THEN** a tela ainda exibe `diasAtraso`, último lançamento e a tabela de alunos ativos (incluindo a coluna de faltas recentes) corretamente, mesmo sem os dados básicos (código/curso/instrutor/situação/datas) da turma
