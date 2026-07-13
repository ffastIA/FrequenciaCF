## ADDED Requirements

### Requirement: Estado dos filtros na URL
O Dashboard SHALL refletir o estado dos filtros (Projeto, Aditivo, Meta, Instrutor, Situação) nos query params da URL, usando a URL como fonte de verdade: ao alterar um filtro, a URL é atualizada; ao carregar o Dashboard, os filtros são lidos da URL. Isso SHALL fazer com que refresh (F5), o botão nativo de voltar do navegador e um link compartilhado/favoritado reproduzam a mesma seleção de filtros e a mesma tabela. A atualização de filtros dependentes que mudam juntos (Projeto/Aditivo/Meta) SHALL ocorrer numa única escrita da URL, preservando a garantia de nunca disparar uma busca com combinação de filtros "no meio do caminho".

#### Scenario: Filtros refletidos na URL
- **WHEN** o usuário seleciona Projeto, Aditivo e uma Situação
- **THEN** a URL do Dashboard passa a conter esses filtros como query params (ex.: `/?idProjeto=16&idProjetoAditivo=8&status=2`)

#### Scenario: Refresh preserva os filtros
- **WHEN** o usuário dá refresh (F5) numa URL de Dashboard que contém filtros
- **THEN** os mesmos filtros são reaplicados e a mesma tabela de turmas é exibida, sem seleção manual

#### Scenario: Link compartilhado reproduz a seleção
- **WHEN** alguém abre diretamente uma URL de Dashboard com query params de filtro
- **THEN** o Dashboard carrega já com aqueles filtros aplicados

#### Scenario: URL sem query params
- **WHEN** o Dashboard é aberto em `/` sem nenhum query param
- **THEN** nenhum Projeto está selecionado e o filtro de Situação está no padrão "Iniciada" (pronto para quando um Projeto for escolhido), sem erro

## MODIFIED Requirements

### Requirement: Filtros adicionais de Instrutor e Situação
Na mesma tela onde a tabela é exibida, o sistema SHALL disponibilizar um filtro de Instrutor (select populado via `GET /api/filtros/instrutores?idTurmas=<ids das turmas do escopo Projeto/Aditivo/Meta, sem os filtros adicionais>`) e um filtro de Situação (select fixo com as 5 opções de `status`). O filtro de Situação SHALL ter "Iniciada" (`status = 2`) como valor padrão, aplicado no primeiro carregamento (quando a URL não especifica Situação) e ao resetar por troca de Projeto/Aditivo; "Todas" e as demais situações continuam selecionáveis, e a escolha de "Todas" SHALL ser representável e preservável na URL de forma distinta do padrão (para que voltar/refresh não reintroduza "Iniciada" quando o usuário escolheu "Todas"). Ao alterar qualquer um desses filtros, o sistema SHALL reconsultar `GET /api/filtros/turmas` incluindo o parâmetro correspondente (`idInstrutor` e/ou `status`), mantendo `idProjeto`/`idProjetoAditivo`/`idMeta` já selecionados. Os controles de Instrutor e Situação SHALL permanecer visíveis sempre que Projeto e Aditivo estiverem selecionados, independentemente de a combinação de filtros atual retornar zero turmas.

#### Scenario: Situação inicia em "Iniciada"
- **WHEN** o usuário seleciona um Projeto e um Aditivo, sem tocar no filtro de Situação
- **THEN** o filtro de Situação está em "Iniciada" e a tabela mostra somente turmas com `status = 2`

#### Scenario: Trocar de Projeto/Aditivo volta a Situação ao padrão
- **WHEN** o usuário tinha "Concluída" selecionado e troca o Projeto (ou o Aditivo)
- **THEN** o filtro de Situação volta para o padrão "Iniciada" (não para "Todas")

#### Scenario: Escolher "Todas" é preservado
- **WHEN** o usuário seleciona "Todas" no filtro de Situação e depois entra e volta de um drill-down (ou dá refresh)
- **THEN** o filtro continua em "Todas", sem reverter para "Iniciada"

#### Scenario: Filtrar por instrutor
- **WHEN** o usuário seleciona um instrutor no filtro adicional
- **THEN** a tabela é recarregada mostrando somente as turmas daquele instrutor, dentro do escopo de Projeto/Aditivo/Meta já selecionado

#### Scenario: Filtrar por situação
- **WHEN** o usuário seleciona "Concluída" no filtro de situação
- **THEN** a tabela é recarregada mostrando somente turmas com `status = 3`

#### Scenario: Combinação de filtros sem resultados
- **WHEN** a combinação de Instrutor + Situação selecionada não corresponde a nenhuma turma
- **THEN** a tela exibe uma mensagem de "nenhuma turma encontrada", mantendo os selects de Instrutor e Situação visíveis e utilizáveis (não somem da tela)

### Requirement: Drill-down para detalhe da turma
Cada linha da tabela de turmas SHALL ser clicável, navegando para a rota `/turmas/:idTurma` daquela turma específica (não um filtro que estreita a tabela atual). A navegação SHALL carregar a URL de origem do Dashboard (com os filtros atuais) para que o retorno ao Dashboard restaure os filtros que estavam selecionados antes do drill-down.

#### Scenario: Clique navega para o detalhe
- **WHEN** o usuário clica numa linha da tabela de turmas
- **THEN** a aplicação navega para `/turmas/:idTurma` correspondente àquela linha

#### Scenario: Voltar do detalhe preserva os filtros
- **WHEN** o usuário, tendo filtrado o Dashboard (ex.: Projeto + Aditivo + Situação), abre o detalhe de uma turma e usa o link "Voltar ao dashboard"
- **THEN** o Dashboard reaparece com exatamente os mesmos filtros aplicados e a mesma tabela, sem refazer a seleção

#### Scenario: Botão nativo de voltar também preserva
- **WHEN** o usuário abre o detalhe de uma turma e usa o botão de voltar do próprio navegador
- **THEN** o Dashboard reaparece com os mesmos filtros aplicados

#### Scenario: Acesso direto ao detalhe não quebra o voltar
- **WHEN** o usuário acessa `/turmas/:idTurma` diretamente (sem ter passado pelo Dashboard) e usa o link "Voltar ao dashboard"
- **THEN** a aplicação vai para o Dashboard em `/` (padrão), sem erro
