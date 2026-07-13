## ADDED Requirements

### Requirement: Filtro em cascata Projeto → Aditivo → Meta
A tela Dashboard SHALL apresentar um select de Projeto (carregado ao montar a página via `GET /api/filtros/projetos`), um select de Aditivo habilitado somente após a seleção de um Projeto (via `GET /api/filtros/aditivos?idProjeto=X`), e um select de Meta habilitado somente após a seleção de um Aditivo (via `GET /api/filtros/metas?idProjetoAditivo=Y`). A seleção de Meta SHALL ser opcional e SHALL NOT bloquear a busca de turmas.

#### Scenario: Aditivo bloqueado sem projeto
- **WHEN** a tela Dashboard é carregada e nenhum Projeto foi selecionado
- **THEN** o select de Aditivo está desabilitado

#### Scenario: Busca de turmas sem selecionar Meta
- **WHEN** o usuário seleciona um Projeto e um Aditivo, sem selecionar nenhuma Meta
- **THEN** a tabela de turmas é carregada normalmente, sem exigir seleção de Meta

### Requirement: Carregamento automático da tabela de turmas
Assim que Projeto e Aditivo estiverem selecionados (Meta é opcional), o sistema SHALL buscar e exibir automaticamente a tabela de turmas correspondente, sem exigir uma ação explícita de "buscar" do usuário.

#### Scenario: Tabela carrega ao completar Projeto + Aditivo
- **WHEN** o usuário seleciona um Aditivo após já ter selecionado um Projeto
- **THEN** a tabela de turmas é buscada e exibida automaticamente, sem clique adicional

### Requirement: Colunas da tabela de turmas
A tabela de turmas SHALL exibir, para cada turma: código, curso (`cursoDescricao`), instrutor (`instrutorNome`), situação (`status` traduzido para texto legível) e dias de atraso no lançamento de frequência (`diasAtraso`).

#### Scenario: Situação exibida como texto
- **WHEN** uma turma tem `status = 3`
- **THEN** a coluna de situação exibe "Concluída" (não o número `3`)

### Requirement: Busca de atraso por turma
Para cada turma exibida na tabela, o sistema SHALL buscar `diasAtraso` via `GET /api/metricas/atraso-lancamento/turma?idTurma=X`, uma chamada por turma, disparadas em paralelo após a tabela base carregar.

#### Scenario: Atraso exibido por turma
- **WHEN** a tabela de turmas termina de carregar
- **THEN** cada linha eventualmente exibe seu `diasAtraso` (ou um estado de carregamento até a resposta chegar)

### Requirement: Filtros adicionais de Instrutor e Situação
Na mesma tela onde a tabela é exibida, o sistema SHALL disponibilizar um filtro de Instrutor (select populado via `GET /api/filtros/instrutores?idTurmas=<ids das turmas atualmente exibidas>`) e um filtro de Situação (select fixo com as 5 opções de `status`). Ao alterar qualquer um desses filtros, o sistema SHALL reconsultar `GET /api/filtros/turmas` incluindo o parâmetro correspondente (`idInstrutor` e/ou `status`), mantendo `idProjeto`/`idProjetoAditivo`/`idMeta` já selecionados.

#### Scenario: Filtrar por instrutor
- **WHEN** o usuário seleciona um instrutor no filtro adicional
- **THEN** a tabela é recarregada mostrando somente as turmas daquele instrutor, dentro do escopo de Projeto/Aditivo/Meta já selecionado

#### Scenario: Filtrar por situação
- **WHEN** o usuário seleciona "Concluída" no filtro de situação
- **THEN** a tabela é recarregada mostrando somente turmas com `status = 3`

### Requirement: Drill-down para detalhe da turma
Cada linha da tabela de turmas SHALL ser clicável, navegando para a rota `/turmas/:idTurma` daquela turma específica (não um filtro que estreita a tabela atual).

#### Scenario: Clique navega para o detalhe
- **WHEN** o usuário clica numa linha da tabela de turmas
- **THEN** a aplicação navega para `/turmas/:idTurma` correspondente àquela linha

### Requirement: Tela de detalhe da turma
A rota `/turmas/:idTurma` SHALL exibir os dados básicos da turma, seu `diasAtraso` (via `GET /api/metricas/atraso-lancamento/turma?idTurma=X`), e uma tabela com os alunos matriculados na turma (via `GET /api/filtros/alunos?idTurma=X`), cada um com `quantidadeFaltas` e `percentualFaltas` (via `GET /api/metricas/faltas?idTurma=X&idAluno=Y`, uma chamada por aluno em paralelo).

#### Scenario: Detalhe mostra atraso e faltas por aluno
- **WHEN** o usuário acessa `/turmas/1597`
- **THEN** a tela exibe o `diasAtraso` da turma 1597 e uma tabela com cada aluno matriculado, mostrando `quantidadeFaltas` e `percentualFaltas` de cada um

### Requirement: Tratamento de percentual de faltas nulo
Quando `percentualFaltas` retornar `null` da API (turma sem aulas previstas no período), a UI SHALL exibir um indicador legível (ex.: "—"), nunca "NaN%" ou uma célula vazia sem explicação.

#### Scenario: Aluno sem aulas previstas no período
- **WHEN** a métrica de faltas de um aluno retorna `percentualFaltas: null`
- **THEN** a UI exibe "—" (ou equivalente) em vez de "NaN%"

### Requirement: Frontend consome somente endpoints de leitura
O frontend SHALL consumir exclusivamente endpoints `GET` da API (`/api/filtros/*`, `/api/metricas/*`), sem nenhuma chamada de escrita, consistente com a regra de somente leitura do backend.

#### Scenario: Nenhuma chamada de escrita
- **WHEN** qualquer tela do frontend é utilizada (filtros, tabela, detalhe)
- **THEN** nenhuma requisição HTTP `POST`/`PUT`/`PATCH`/`DELETE` é feita à API
