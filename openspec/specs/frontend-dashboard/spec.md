# Capability: frontend-dashboard

## Purpose

SPA Vite+React (sem autenticação) que consome a API do backend FrequenciaCF: fluxo de filtros em cascata, tabela de turmas com dias de atraso no lançamento de frequência, e tela de detalhe da turma com faltas por aluno.
## Requirements
### Requirement: Filtro em cascata Projeto → Aditivo → Meta
A tela Dashboard SHALL apresentar um select de Projeto (carregado ao montar a página via `GET /api/filtros/projetos`), um select de Aditivo habilitado somente após a seleção de um Projeto (via `GET /api/filtros/aditivos?idProjeto=X`), e um select de Meta habilitado somente após a seleção de um Aditivo (via `GET /api/filtros/metas?idProjetoAditivo=Y`). A seleção de Meta SHALL ser opcional e SHALL NOT bloquear a busca de turmas. Ao trocar Projeto ou Aditivo, as seleções dependentes (Aditivo/Meta, Instrutor/Situação) SHALL ser resetadas de forma síncrona (no mesmo evento), para nunca disparar uma busca de turmas com uma combinação de filtros "no meio do caminho".

#### Scenario: Aditivo bloqueado sem projeto
- **WHEN** a tela Dashboard é carregada e nenhum Projeto foi selecionado
- **THEN** o select de Aditivo está desabilitado

#### Scenario: Busca de turmas sem selecionar Meta
- **WHEN** o usuário seleciona um Projeto e um Aditivo, sem selecionar nenhuma Meta
- **THEN** a tabela de turmas é carregada normalmente, sem exigir seleção de Meta

#### Scenario: Projeto sem nenhum aditivo
- **WHEN** o usuário seleciona um Projeto que não tem nenhum aditivo cadastrado
- **THEN** o select de Aditivo fica habilitado mas vazio (sem opções além do placeholder), sem erro na tela

### Requirement: Carregamento automático da tabela de turmas
Assim que Projeto e Aditivo estiverem selecionados (Meta é opcional), o sistema SHALL buscar e exibir automaticamente a tabela de turmas correspondente, sem exigir uma ação explícita de "buscar" do usuário.

#### Scenario: Tabela carrega ao completar Projeto + Aditivo
- **WHEN** o usuário seleciona um Aditivo após já ter selecionado um Projeto
- **THEN** a tabela de turmas é buscada e exibida automaticamente, sem clique adicional

### Requirement: Colunas da tabela de turmas
A tabela de turmas SHALL exibir, para cada turma: código, curso (`cursoDescricao`), instrutor (`instrutorNome`), situação (`status` traduzido para texto legível), total de alunos ativos (`totalAlunosAtivos`, alunos com `matricula.situacao = 7` naquela turma), data de início (`data_inicio`), data de término (`data_fim`), data do último lançamento de frequência (`dataUltimoLancamento`, obtida na mesma chamada de atraso já feita por turma) e dias de atraso no lançamento (`diasAtraso`). Todas as datas SHALL ser exibidas no formato `dd/mm/aaaa`; valores nulos SHALL ser exibidos como "—". A coluna de alunos ativos SHALL exibir o número diretamente a partir da resposta de `GET /api/filtros/turmas`, sem chamada de rede adicional nem estado de carregamento próprio.

#### Scenario: Situação exibida como texto
- **WHEN** uma turma tem `status = 3`
- **THEN** a coluna de situação exibe "Concluída" (não o número `3`)

#### Scenario: Período da turma visível
- **WHEN** a tabela de turmas é exibida
- **THEN** cada linha mostra as datas de início e término da turma no formato `dd/mm/aaaa`

#### Scenario: Último lançamento visível na tabela
- **WHEN** a chamada de atraso de uma turma retorna `dataUltimoLancamento`
- **THEN** a linha correspondente exibe essa data formatada; se `null` (turma nunca lançou), exibe "—"

#### Scenario: Total de alunos ativos visível na tabela
- **WHEN** a tabela de turmas é exibida
- **THEN** cada linha mostra o número de alunos ativos daquela turma (`totalAlunosAtivos`), aparecendo junto com as demais colunas da linha, sem atraso de carregamento

#### Scenario: Turma sem nenhum aluno ativo
- **WHEN** uma turma da tabela não tem nenhum aluno com `matricula.situacao = 7`
- **THEN** a coluna de alunos ativos exibe `0`, não "—" nem célula vazia (o dado sempre está disponível, diferente das colunas que dependem de carregamento assíncrono)

### Requirement: Busca de atraso por turma
Para cada turma exibida na tabela, o sistema SHALL buscar `diasAtraso` via `GET /api/metricas/atraso-lancamento/turma?idTurma=X`, uma chamada por turma, disparadas em paralelo após a tabela base carregar.

#### Scenario: Atraso exibido por turma
- **WHEN** a tabela de turmas termina de carregar
- **THEN** cada linha eventualmente exibe seu `diasAtraso` (ou um estado de carregamento até a resposta chegar)

#### Scenario: Atraso nulo exibido de forma legível
- **WHEN** `diasAtraso` retorna `null` para uma turma (ex.: turma sem nenhuma aula com data no passado)
- **THEN** a célula exibe "—", nunca "null" ou uma célula quebrada

### Requirement: Filtros adicionais de Instrutor e Situação
Na mesma tela onde a tabela é exibida, o sistema SHALL disponibilizar um filtro de Instrutor (select populado via `GET /api/filtros/instrutores?idTurmas=<ids das turmas do escopo Projeto/Aditivo/Meta, sem os filtros adicionais>`), um filtro de Situação (select fixo com as 5 opções de `status`) e um filtro de texto opcional por Código da turma, os três na mesma barra de filtros adicionais, abaixo da linha de Projeto/Aditivo/Meta. O filtro de Situação SHALL ter "Iniciada" (`status = 2`) como valor padrão, aplicado no primeiro carregamento (quando a URL não especifica Situação) e ao resetar por troca de Projeto/Aditivo; "Todas" e as demais situações continuam selecionáveis, e a escolha de "Todas" SHALL ser representável e preservável na URL de forma distinta do padrão (para que voltar/refresh não reintroduza "Iniciada" quando o usuário escolheu "Todas"). Ao alterar Instrutor ou Situação, o sistema SHALL reconsultar `GET /api/filtros/turmas` incluindo o parâmetro correspondente (`idInstrutor` e/ou `status`), mantendo `idProjeto`/`idProjetoAditivo`/`idMeta` já selecionados; o filtro de Código da turma, por ser aplicado no cliente, SHALL NOT disparar nova requisição. Os três controles SHALL permanecer visíveis sempre que Projeto e Aditivo estiverem selecionados, independentemente de a combinação de filtros atual retornar zero turmas.

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
- **WHEN** a combinação de Instrutor + Situação + Código da turma selecionada não corresponde a nenhuma turma
- **THEN** a tela exibe uma mensagem de "nenhuma turma encontrada", mantendo os três controles visíveis e utilizáveis (não somem da tela)

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

### Requirement: Formatação de datas em pt-BR
Todas as datas exibidas no frontend (início/término da turma, último lançamento, e demais que surgirem) SHALL ser formatadas como `dd/mm/aaaa` por um helper único compartilhado entre as telas; datas nulas ou ausentes SHALL ser exibidas como "—".

#### Scenario: Data ISO formatada
- **WHEN** a API retorna uma data como `2022-08-08` (ou ISO com timezone)
- **THEN** a UI exibe `08/08/2022`

#### Scenario: Data nula
- **WHEN** um campo de data vem `null` da API
- **THEN** a UI exibe "—"

### Requirement: Apresentação visual consistente
As telas do Dashboard e do detalhe da turma SHALL ter apresentação visual consistente, implementada com CSS próprio (sem biblioteca de UI): conteúdo em container central com cabeçalho da aplicação; filtros dispostos em barra alinhada com rótulos visíveis; tabelas com cabeçalho visualmente destacado, linhas zebradas e realce (hover) nas linhas clicáveis; e mensagens de estado (carregando, lista vazia, erro) estilizadas e legíveis — nunca texto solto sem hierarquia visual.

#### Scenario: Linha clicável com feedback visual
- **WHEN** o usuário passa o mouse sobre uma linha da tabela de turmas
- **THEN** a linha muda de aparência (hover), indicando que é clicável

#### Scenario: Filtros organizados
- **WHEN** a tela do Dashboard é exibida
- **THEN** os selects de filtro aparecem alinhados em barra, cada um com rótulo visível acima ou ao lado, sem elementos colados uns aos outros

#### Scenario: Estados vazios estilizados
- **WHEN** uma busca retorna zero turmas ou zero alunos ativos
- **THEN** a mensagem correspondente aparece com estilo próprio (não texto cru sem espaçamento), mantendo o layout da página estável

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

### Requirement: Ordenação por coluna na tabela de alunos do detalhe da turma
Na tela de detalhe da turma (`/turmas/:idTurma`), cada cabeçalho da tabela de alunos (Aluno, Quantidade de faltas, Percentual de faltas, Faltas nas últimas 4 aulas) SHALL ser clicável. O primeiro clique num cabeçalho SHALL ordenar a tabela por aquela coluna em ordem crescente; um novo clique no mesmo cabeçalho SHALL inverter para ordem decrescente; um novo clique SHALL voltar a crescente, alternando indefinidamente entre as duas direções (sem um terceiro estado "sem ordenação" após o primeiro clique). Clicar num cabeçalho diferente do que estava ativo SHALL trocar a ordenação para a nova coluna em ordem crescente, mantendo sempre uma única coluna ordenada por vez. O cabeçalho da coluna ativa SHALL exibir um indicador visual da direção atual (crescente ou decrescente).

#### Scenario: Primeiro clique ordena crescente
- **WHEN** o usuário clica pela primeira vez no cabeçalho de uma coluna
- **THEN** a tabela é reordenada por aquela coluna em ordem crescente, e o cabeçalho exibe o indicador de "crescente"

#### Scenario: Segundo clique na mesma coluna inverte para decrescente
- **WHEN** o usuário clica novamente no cabeçalho da coluna que já está ordenando a tabela
- **THEN** a tabela é reordenada em ordem decrescente, e o indicador do cabeçalho muda para "decrescente"

#### Scenario: Terceiro clique volta a crescente
- **WHEN** o usuário clica uma terceira vez no mesmo cabeçalho (já em ordem decrescente)
- **THEN** a tabela volta a ordem crescente

#### Scenario: Clicar em outra coluna substitui a ordenação ativa
- **WHEN** a tabela está ordenada por uma coluna e o usuário clica no cabeçalho de outra coluna
- **THEN** a tabela passa a ser ordenada pela nova coluna em ordem crescente, e o indicador visual da coluna anterior desaparece

### Requirement: Ordenação por valor real, não pelo texto exibido na célula
A ordenação SHALL comparar o valor subjacente de cada coluna (número para colunas numéricas, texto para a coluna de aluno), não a string formatada exibida na célula (`—`, `X%`, `X/N`, `...`). Colunas de texto SHALL ser comparadas de forma alfabética considerando acentuação e ignorando maiúsculas/minúsculas (locale pt-BR). Linhas cujo valor da coluna ordenada ainda esteja carregando ou seja ausente/nulo SHALL aparecer sempre por último, independentemente da direção de ordenação escolhida.

#### Scenario: Ordenação numérica correta
- **WHEN** o usuário ordena a coluna "Quantidade de faltas" em ordem crescente
- **THEN** as linhas aparecem em ordem numérica (ex.: 0, 1, 2, 10), não em ordem alfabética de texto (que colocaria "10" antes de "2")

#### Scenario: Nomes com acentuação ordenados corretamente
- **WHEN** o usuário ordena a coluna "Aluno" em ordem crescente
- **THEN** nomes com acentos (ex.: "Álvaro", "Ébano") aparecem na posição alfabética correta, não deslocados para o início ou fim por causa do caractere acentuado

#### Scenario: Valores ausentes ficam por último em ambas as direções
- **WHEN** a coluna "Percentual de faltas" é ordenada (crescente ou decrescente) e alguns alunos têm `percentualFaltas: null` (turma sem aulas previstas) ou o dado ainda está carregando
- **THEN** essas linhas aparecem sempre no final da tabela, em ambas as direções de ordenação

#### Scenario: Ordenação se ajusta conforme os dados assíncronos chegam
- **WHEN** a tabela está ordenada por uma coluna cujos valores ainda estão sendo carregados por aluno
- **THEN** conforme cada valor chega, a linha correspondente é reposicionada de acordo com a ordenação ativa, sem exigir uma nova interação do usuário

### Requirement: Ordenação por coluna na tabela de turmas do Dashboard
Na tela do Dashboard, cada cabeçalho da tabela de turmas (Código, Curso, Instrutor, Situação, Alunos ativos, Início, Término, Último lançamento, Dias de atraso) SHALL ser clicável. O primeiro clique num cabeçalho SHALL ordenar a tabela por aquela coluna em ordem crescente; um novo clique no mesmo cabeçalho SHALL inverter para ordem decrescente; um novo clique SHALL voltar a crescente, alternando indefinidamente entre as duas direções. Clicar num cabeçalho diferente do que estava ativo SHALL trocar a ordenação para a nova coluna em ordem crescente, mantendo sempre uma única coluna ordenada por vez. O cabeçalho da coluna ativa SHALL exibir um indicador visual da direção atual (crescente ou decrescente). Este comportamento SHALL seguir os mesmos critérios de comparação já estabelecidos para a tabela de alunos da tela de detalhe da turma (comparação por valor bruto, texto com acentuação, valores ausentes por último).

#### Scenario: Primeiro clique ordena crescente
- **WHEN** o usuário clica pela primeira vez no cabeçalho de uma coluna da tabela de turmas
- **THEN** a tabela é reordenada por aquela coluna em ordem crescente, com o indicador visual de "crescente" no cabeçalho

#### Scenario: Clique subsequente alterna a direção
- **WHEN** o usuário clica novamente no cabeçalho da coluna que já está ordenando a tabela
- **THEN** a tabela é reordenada na direção oposta, e o indicador do cabeçalho reflete a nova direção

#### Scenario: Clicar em outra coluna substitui a ordenação ativa
- **WHEN** a tabela está ordenada por uma coluna e o usuário clica no cabeçalho de outra coluna
- **THEN** a tabela passa a ser ordenada pela nova coluna em ordem crescente, e o indicador da coluna anterior desaparece

#### Scenario: Coluna "Situação" ordena pela progressão da situação, não pelo texto traduzido
- **WHEN** o usuário ordena a coluna "Situação"
- **THEN** as turmas são ordenadas pela progressão `status` (0 não especificado, 1 não iniciada, 2 iniciada, 3 concluída, 4 cancelada), não pela ordem alfabética do texto exibido no badge

#### Scenario: Colunas de data ordenam cronologicamente
- **WHEN** o usuário ordena a coluna "Início", "Término" ou "Último lançamento"
- **THEN** as turmas são ordenadas pela data real (cronológica), não pela string formatada `dd/mm/aaaa`

#### Scenario: Coluna "Alunos ativos" ordena numericamente
- **WHEN** o usuário ordena a coluna "Alunos ativos"
- **THEN** as turmas são ordenadas pelo valor numérico de `totalAlunosAtivos`, incluindo corretamente as turmas com `0` (não tratadas como ausentes/últimas, já que `0` é um valor real, não um dado faltante)

#### Scenario: Valores ainda carregando ou ausentes ficam por último
- **WHEN** a tabela é ordenada pela coluna "Último lançamento" ou "Dias de atraso" enquanto os dados de atraso de algumas turmas ainda estão carregando (ou a turma não tem valor, ex.: sem nenhuma aula)
- **THEN** essas linhas aparecem sempre no final da tabela, em ambas as direções, e se reposicionam automaticamente assim que o dado chega, sem exigir nova interação

### Requirement: Filtro adicional por código de turma
Na mesma barra dos filtros adicionais (Instrutor, Situação), o sistema SHALL disponibilizar um campo de texto opcional "Código da turma" onde o usuário pode digitar o código de uma ou mais turmas, separados por ponto e vírgula (`;`). Quando preenchido, a tabela SHALL exibir somente as turmas cujo `codigo` corresponda, de forma exata (ignorando maiúsculas/minúsculas e espaços ao redor de cada item), a algum dos códigos informados. O filtro SHALL ser aplicado sobre os dados de turmas já carregados no cliente (sem nova requisição à API) e SHALL ser combinado com os demais filtros já aplicados (Projeto/Aditivo/Meta/Instrutor/Situação). O filtro SHALL ser preservado na URL, seguindo o mesmo padrão dos demais filtros do Dashboard, e SHALL ser resetado ao trocar Projeto, Aditivo ou Meta, junto com Instrutor e Situação.

#### Scenario: Filtrar por um único código
- **WHEN** o usuário digita `IR2-2602` no campo "Código da turma"
- **THEN** a tabela mostra somente a turma com esse código, dentro do escopo já filtrado por Projeto/Aditivo/Meta/Instrutor/Situação

#### Scenario: Filtrar por múltiplos códigos separados por ponto e vírgula
- **WHEN** o usuário digita `IR2-2602;OBR2-2602`
- **THEN** a tabela mostra as turmas cujos códigos sejam `IR2-2602` ou `OBR2-2602`

#### Scenario: Espaços e caixa são ignorados na comparação
- **WHEN** o usuário digita `ir2-2602; OBR2-2602 ` (com espaços e minúsculas)
- **THEN** o filtro casa normalmente com os códigos `IR2-2602` e `OBR2-2602`, sem exigir digitação exata

#### Scenario: Nenhuma turma corresponde aos códigos informados
- **WHEN** os códigos digitados não correspondem a nenhuma turma do escopo atual
- **THEN** a tabela exibe a mensagem de "nenhuma turma encontrada", mantendo o campo de código visível e preenchido

#### Scenario: Campo vazio não filtra nada
- **WHEN** o campo "Código da turma" está vazio
- **THEN** a tabela mostra todas as turmas do escopo, sem restrição adicional por código

#### Scenario: Trocar de Projeto/Aditivo/Meta reseta o filtro de código
- **WHEN** o usuário tem códigos digitados no filtro e troca o Projeto, o Aditivo ou a Meta
- **THEN** o campo "Código da turma" é limpo, junto com Instrutor e Situação

