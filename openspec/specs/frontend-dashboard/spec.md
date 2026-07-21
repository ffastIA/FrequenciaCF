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
A tabela de turmas SHALL exibir, para cada turma, nesta ordem: código, curso (`cursoDescricao`), instrutor (`instrutorNome`), situação (`status` traduzido para texto legível), vagas disponíveis — rotulada "Vagas" (armazenada localmente fora do MySQL, editável, valor `0` quando a turma não tem vagas definidas ainda), total de alunos matriculados — rotulada "Alunos Matriculados" (`totalAlunosMatriculados`, alunos com `matricula.situacao = 1` naquela turma), total de alunos ativos — rotulada "Alunos ativos" (`totalAlunosAtivos`, alunos com `matricula.situacao = 7` naquela turma), percentual de ocupação — rotulada "% Ocupação" (calculado no cliente como `totalAlunosAtivos / vagas × 100`, arredondado a 2 casas decimais; "—" quando `vagas = 0`), data de início (`data_inicio`), data de término (`data_fim`), data do último lançamento de frequência — rotulada "Último Lançamento" (`dataUltimoLancamento`, obtida na mesma chamada de atraso já feita por turma) — e dias de atraso no lançamento — rotulada "Dias em Atraso" (`diasAtraso`). Todas as datas SHALL ser exibidas no formato `dd/mm/aaaa`; valores nulos SHALL ser exibidos como "—". As colunas de alunos matriculados e de alunos ativos SHALL exibir o número diretamente a partir da resposta de `GET /api/filtros/turmas`, sem chamada de rede adicional nem estado de carregamento próprio. Os cabeçalhos das colunas SHALL permitir quebra de texto em duas ou mais linhas quando o rótulo for longo, para que a largura de cada coluna seja determinada pelo conteúdo exibido (data/número/texto da linha), não pelo comprimento do texto do cabeçalho; as células de dado (`<td>`) das colunas de data e número SHALL continuar sem quebra de linha. A quebra de cabeçalho SHALL NUNCA resultar em sobreposição visual entre colunas adjacentes — quando uma palavra do rótulo não couber inteira na largura disponível mesmo quebrando em espaços, o texto SHALL quebrar dentro da própria palavra em vez de vazar sobre a coluna vizinha.

#### Scenario: Situação exibida como texto
- **WHEN** uma turma tem `status = 3`
- **THEN** a coluna de situação exibe "Concluída" (não o número `3`)

#### Scenario: Período da turma visível
- **WHEN** a tabela de turmas é exibida
- **THEN** cada linha mostra as datas de início e término da turma no formato `dd/mm/aaaa`

#### Scenario: Último lançamento visível na tabela
- **WHEN** a chamada de atraso de uma turma retorna `dataUltimoLancamento`
- **THEN** a linha correspondente exibe essa data formatada sob o cabeçalho "Último Lançamento"; se `null` (turma nunca lançou), exibe "—"

#### Scenario: Total de alunos ativos visível na tabela
- **WHEN** a tabela de turmas é exibida
- **THEN** cada linha mostra o número de alunos ativos daquela turma (`totalAlunosAtivos`), aparecendo junto com as demais colunas da linha, sem atraso de carregamento

#### Scenario: Total de alunos matriculados visível na tabela, entre Vagas e Alunos ativos
- **WHEN** a tabela de turmas é exibida
- **THEN** cada linha mostra, entre as colunas "Vagas" e "Alunos ativos", o número de alunos matriculados daquela turma (`totalAlunosMatriculados`), sem atraso de carregamento

#### Scenario: Turma sem nenhum aluno ativo ou matriculado
- **WHEN** uma turma da tabela não tem nenhum aluno com `matricula.situacao = 7` nem `situacao = 1`
- **THEN** as colunas de alunos ativos e de alunos matriculados exibem `0`, não "—" nem célula vazia

#### Scenario: Cabeçalho longo quebra em múltiplas linhas
- **WHEN** a tabela de turmas é exibida com colunas de rótulo longo (ex.: "Último Lançamento", "Dias em Atraso", "Alunos ativos", "Alunos Matriculados")
- **THEN** o texto do cabeçalho quebra em duas ou mais linhas, sem forçar a coluna a ficar mais larga do que o necessário para o dado exibido nas linhas

#### Scenario: Cabeçalhos adjacentes não se sobrepõem
- **WHEN** dois cabeçalhos vizinhos têm rótulos longos com palavras que não cabem lado a lado numa única linha (ex.: "Alunos Matriculados" e "Alunos ativos")
- **THEN** cada cabeçalho quebra dentro de sua própria coluna, sem que o texto de um invada visualmente o espaço do outro

#### Scenario: Células de dado não quebram linha
- **WHEN** uma coluna de data (Início, Término, Último Lançamento) ou de número (Dias em Atraso) exibe seu valor numa linha da tabela
- **THEN** o valor continua exibido numa única linha, sem quebra, independentemente da quebra aplicada ao cabeçalho da mesma coluna

#### Scenario: Coluna Vagas exibida com valor default
- **WHEN** uma turma da tabela não tem nenhum valor de vagas definido ainda
- **THEN** a coluna "Vagas" exibe `0`, na posição entre "Situação" e "Alunos Matriculados"

#### Scenario: Percentual de ocupação calculado a partir de alunos ativos e vagas
- **WHEN** uma turma tem `totalAlunosAtivos = 18` e `vagas = 20`
- **THEN** a coluna "% Ocupação" exibe `90%`, na posição entre "Alunos ativos" e "Início"

#### Scenario: Percentual de ocupação ausente quando vagas não foram definidas
- **WHEN** uma turma tem `vagas = 0` (valor default, ainda não editado pelo usuário)
- **THEN** a coluna "% Ocupação" exibe "—", nunca `0%`, `NaN%` ou `Infinity%`

#### Scenario: Percentual de ocupação pode ultrapassar 100%
- **WHEN** uma turma tem mais alunos ativos do que vagas definidas (ex.: `totalAlunosAtivos = 24`, `vagas = 20`)
- **THEN** a coluna "% Ocupação" exibe o valor real acima de 100% (ex.: `120%`), sem limite artificial

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

### Requirement: Frontend consome somente endpoints de leitura, exceto a persistência local de vagas
O frontend SHALL consumir exclusivamente endpoints `GET` da API (`/api/filtros/*`, `/api/metricas/*`), sem nenhuma chamada de escrita, consistente com a regra de somente leitura do backend em relação ao MySQL — **com uma única exceção documentada**: a chamada `PUT /api/vagas/:idTurma`, usada para persistir o número de vagas de uma turma num arquivo local do backend (nunca no MySQL). Nenhuma outra chamada de escrita (`POST`/`PUT`/`PATCH`/`DELETE`) SHALL ser feita pelo frontend além dessa.

#### Scenario: Nenhuma chamada de escrita fora da exceção de vagas
- **WHEN** qualquer tela do frontend é utilizada (filtros, tabela, detalhe)
- **THEN** a única requisição HTTP de escrita (`POST`/`PUT`/`PATCH`/`DELETE`) eventualmente feita à API é `PUT /api/vagas/:idTurma`; nenhuma outra chamada de escrita ocorre

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
Na tela do Dashboard, cada cabeçalho da tabela de turmas (Código, Curso, Instrutor, Situação, Vagas, Alunos Matriculados, Alunos ativos, % Ocupação, Início, Término, Último Lançamento, Dias em Atraso) SHALL ser clicável. O primeiro clique num cabeçalho SHALL ordenar a tabela por aquela coluna em ordem crescente; um novo clique no mesmo cabeçalho SHALL inverter para ordem decrescente; um novo clique SHALL voltar a crescente, alternando indefinidamente entre as duas direções. Clicar num cabeçalho diferente do que estava ativo SHALL trocar a ordenação para a nova coluna em ordem crescente, mantendo sempre uma única coluna ordenada por vez. O cabeçalho da coluna ativa SHALL exibir um indicador visual da direção atual (crescente ou decrescente). Este comportamento SHALL seguir os mesmos critérios de comparação já estabelecidos para a tabela de alunos da tela de detalhe da turma (comparação por valor bruto, texto com acentuação, valores ausentes por último).

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
- **WHEN** o usuário ordena a coluna "Início", "Término" ou "Último Lançamento"
- **THEN** as turmas são ordenadas pela data real (cronológica), não pela string formatada `dd/mm/aaaa`

#### Scenario: Coluna "Alunos Matriculados" ordena numericamente
- **WHEN** o usuário ordena a coluna "Alunos Matriculados"
- **THEN** as turmas são ordenadas pelo valor numérico de `totalAlunosMatriculados`, incluindo corretamente as turmas com `0` (não tratadas como ausentes/últimas, já que `0` é um valor real, não um dado faltante)

#### Scenario: Valores ainda carregando ou ausentes ficam por último
- **WHEN** a tabela é ordenada pela coluna "Último Lançamento" ou "Dias em Atraso" enquanto os dados de atraso de algumas turmas ainda estão carregando (ou a turma não tem valor, ex.: sem nenhuma aula)
- **THEN** essas linhas aparecem sempre no final da tabela, em ambas as direções, e se reposicionam automaticamente assim que o dado chega, sem exigir nova interação

#### Scenario: Coluna "Vagas" ordena numericamente, incluindo turmas com 0
- **WHEN** o usuário ordena a coluna "Vagas"
- **THEN** as turmas são ordenadas pelo valor numérico de vagas, incluindo corretamente as turmas com `0` vagas (valor default, não tratado como ausente/último)

#### Scenario: Coluna "% Ocupação" ordena numericamente, com ausentes por último
- **WHEN** o usuário ordena a coluna "% Ocupação"
- **THEN** as turmas são ordenadas pelo valor numérico do percentual calculado; turmas com "—" (vagas não definidas) aparecem sempre por último, em ambas as direções

### Requirement: Filtro adicional por código de turma
Na mesma barra dos filtros adicionais (Instrutor, Situação), o sistema SHALL disponibilizar um dropdown de seleção única "Código da turma", com o mesmo comportamento visual e de interação de Projeto/Aditivo. As opções do dropdown SHALL ser os códigos das turmas que atendem aos demais filtros já selecionados (Projeto, Aditivo, Meta, Instrutor, Situação) — o mesmo conjunto de turmas já buscado para popular a tabela, sem chamada de API adicional —, deduplicados e ordenados alfabeticamente em ordem crescente, com uma opção vazia ("Todos") para não filtrar por código. Quando um código é selecionado, a tabela SHALL exibir somente a(s) turma(s) cujo `codigo` corresponda exatamente ao valor selecionado. O filtro SHALL ser preservado na URL (parâmetro `codigo`, singular), seguindo o mesmo padrão dos demais filtros do Dashboard, e SHALL ser resetado ao trocar Projeto, Aditivo ou Meta, junto com Instrutor e Situação. Se o código selecionado deixar de existir entre as opções disponíveis (por mudança em qualquer um dos demais filtros, incluindo Instrutor ou Situação), o sistema SHALL limpar a seleção automaticamente.

#### Scenario: Opções refletem o escopo já filtrado
- **WHEN** o usuário já selecionou Projeto, Aditivo e, opcionalmente, Meta/Instrutor/Situação
- **THEN** o dropdown de código lista somente os códigos das turmas que atendem a essa combinação de filtros, em ordem alfabética crescente

#### Scenario: Selecionar um código filtra a tabela
- **WHEN** o usuário seleciona um código no dropdown
- **THEN** a tabela passa a exibir somente a turma (ou turmas, se houver mais de uma com o mesmo código no escopo) correspondente ao código selecionado

#### Scenario: Opção "Todos" remove o filtro de código
- **WHEN** o usuário seleciona a opção vazia ("Todos")
- **THEN** a tabela volta a exibir todas as turmas do escopo definido pelos demais filtros, sem restrição de código

#### Scenario: Trocar Instrutor ou Situação atualiza as opções disponíveis
- **WHEN** o usuário tem um código selecionado e muda o filtro de Instrutor ou de Situação
- **THEN** a lista de opções do dropdown de código é recalculada para refletir o novo escopo

#### Scenario: Seleção de código órfã é limpa automaticamente
- **WHEN** o código atualmente selecionado deixa de estar entre as turmas do escopo (por causa de uma mudança em Projeto, Aditivo, Meta, Instrutor ou Situação)
- **THEN** o filtro de código é limpo automaticamente (volta para "Todos"), sem exigir ação manual do usuário

#### Scenario: Trocar de Projeto/Aditivo/Meta reseta o filtro de código
- **WHEN** o usuário tem um código selecionado e troca o Projeto, o Aditivo ou a Meta
- **THEN** o filtro de código volta para "Todos", junto com Instrutor e Situação

### Requirement: Aplicação não oferece tradução automática do navegador
`frontend/index.html` SHALL declarar `<meta name="google" content="notranslate">` e `<html lang="pt-BR">`, para que o Google Translate (e o tradutor embutido do Chrome) SHALL NOT ofereça nem aplique tradução automática nesta aplicação — o sistema é de uso interno, integralmente em português, e textos curtos de interface (cabeçalhos de tabela, rótulos) são especialmente propensos a tradução automática incorreta e sem contexto.

#### Scenario: Navegador não oferece traduzir a página
- **WHEN** um usuário com Chrome (ou navegador baseado em Chromium com Google Translate) abre qualquer tela da aplicação
- **THEN** o navegador não exibe o prompt/ícone de oferecimento de tradução automática para a página

#### Scenario: Idioma declarado corretamente
- **WHEN** o HTML da aplicação é inspecionado
- **THEN** o atributo `lang` do elemento `<html>` é `pt-BR`, refletindo o idioma real do conteúdo

### Requirement: Exportação da tabela de turmas para Excel
Na tela do Dashboard, quando a tabela de turmas estiver sendo exibida (ao menos uma turma no resultado atual), o sistema SHALL disponibilizar um botão "Exportar para Excel" que gera e baixa um arquivo `.xlsx` contendo exatamente as turmas e colunas visíveis na tabela no momento do clique — respeitando os filtros já aplicados (Projeto, Aditivo, Meta, Instrutor, Situação, Código da turma) e a ordenação por coluna ativa. A geração do arquivo SHALL ocorrer inteiramente no navegador, sem chamada de rede adicional. Cada coluna do arquivo SHALL usar o mesmo rótulo de cabeçalho e o mesmo valor formatado exibido na tela (datas em `dd/mm/aaaa`, situação traduzida para texto legível, "—" para valores nulos, ausentes ou ainda não carregados no momento do clique). O botão SHALL NOT ser exibido quando não houver turmas para exportar (mesma condição que já controla a exibição da tabela).

#### Scenario: Exportar com filtros e ordenação aplicados
- **WHEN** o usuário tem Projeto, Aditivo e um filtro adicional (ex.: Situação = Concluída) selecionados, com a tabela ordenada por uma coluna, e clica em "Exportar para Excel"
- **THEN** o arquivo baixado contém somente as turmas que atendem a esses filtros, na mesma ordem exibida na tela

#### Scenario: Cabeçalhos e valores do arquivo espelham a tela
- **WHEN** o arquivo é aberto
- **THEN** os cabeçalhos das colunas e o texto de cada célula (situação traduzida, datas formatadas, "—" para nulos) são iguais aos exibidos na tabela do Dashboard

#### Scenario: Valor ainda carregando no momento da exportação
- **WHEN** o usuário exporta antes de `diasAtraso`/`dataUltimoLancamento` de alguma turma terminar de carregar
- **THEN** a célula correspondente no arquivo exporta como "—", não como o indicador visual de carregamento da tela

#### Scenario: Botão ausente sem dados
- **WHEN** a tabela de turmas está vazia (nenhuma turma corresponde aos filtros) ou os filtros obrigatórios (Projeto/Aditivo) ainda não foram selecionados
- **THEN** o botão "Exportar para Excel" não é exibido

### Requirement: Exportação da tabela de alunos para Excel
Na tela de detalhe da turma, quando a tabela de alunos ativos estiver sendo exibida (ao menos um aluno no resultado atual), o sistema SHALL disponibilizar um botão "Exportar para Excel" que gera e baixa um arquivo `.xlsx` contendo exatamente os alunos e colunas visíveis na tabela no momento do clique — respeitando a ordenação por coluna ativa. A geração do arquivo SHALL ocorrer inteiramente no navegador, sem chamada de rede adicional. Cada coluna do arquivo SHALL usar o mesmo rótulo de cabeçalho e o mesmo valor formatado exibido na tela (percentual com `%`, "—" para valores nulos, ausentes ou ainda não carregados no momento do clique). O nome do arquivo SHALL incluir o código da turma. O botão SHALL NOT ser exibido quando não houver alunos ativos para exportar.

#### Scenario: Exportar com ordenação aplicada
- **WHEN** o usuário ordena a tabela de alunos por uma coluna e clica em "Exportar para Excel"
- **THEN** o arquivo baixado contém os alunos na mesma ordem exibida na tela

#### Scenario: Cabeçalhos e valores do arquivo espelham a tela
- **WHEN** o arquivo é aberto
- **THEN** os cabeçalhos das colunas e o texto de cada célula (percentual formatado, "—" para nulos) são iguais aos exibidos na tabela de alunos

#### Scenario: Valor ainda carregando no momento da exportação
- **WHEN** o usuário exporta antes das faltas de algum aluno terminarem de carregar
- **THEN** a célula correspondente no arquivo exporta como "—", não como o indicador visual de carregamento da tela

#### Scenario: Botão ausente sem alunos ativos
- **WHEN** a turma não tem nenhum aluno ativo
- **THEN** o botão "Exportar para Excel" não é exibido

### Requirement: Ponto de entrada do painel de lançamentos atrasados
Quando Projeto e Aditivo estiverem selecionados, o Dashboard SHALL exibir um indicador/botão que, ao ser clicado, abre o painel "Lançamentos atrasados" (capability `painel-turmas-atrasadas`) com o escopo de filtros correntes (Projeto, Aditivo, Meta, Instrutor, Situação).

#### Scenario: Indicador visível com Projeto e Aditivo selecionados
- **WHEN** o usuário tem Projeto e Aditivo selecionados no Dashboard
- **THEN** o indicador/botão de "Lançamentos atrasados" é exibido na tela

#### Scenario: Indicador abre o painel
- **WHEN** o usuário clica no indicador/botão de "Lançamentos atrasados"
- **THEN** o painel é aberto como modal, consultando o escopo de filtros correntes do Dashboard

#### Scenario: Indicador ausente sem Projeto/Aditivo
- **WHEN** o Dashboard é exibido sem Projeto e Aditivo selecionados
- **THEN** o indicador/botão de "Lançamentos atrasados" não é exibido

### Requirement: Edição inline da coluna Vagas
A coluna "Vagas" da tabela de turmas SHALL ser editável diretamente na célula, como um campo numérico. Ao perder o foco do campo ou pressionar Enter, o novo valor SHALL ser validado (inteiro entre `0` e `25`) e persistido via `PUT /api/vagas/:idTurma`; a UI SHALL atualizar o valor exibido de forma otimista e reverter para o valor anterior caso a requisição falhe. Clicar ou interagir com o campo de Vagas SHALL NOT disparar a navegação da linha para a tela de detalhe da turma. O valor persistido SHALL ser recuperado automaticamente na próxima vez que o Dashboard for carregado (nova sessão, refresh, ou revisita à tela).

#### Scenario: Edição salva automaticamente ao sair do campo
- **WHEN** o usuário altera o valor de Vagas de uma turma e clica fora do campo (ou pressiona Enter)
- **THEN** o novo valor é enviado via `PUT /api/vagas/:idTurma` e passa a ser exibido na célula

#### Scenario: Valor persiste entre sessões
- **WHEN** o usuário edita o valor de Vagas de uma turma e, em seguida, recarrega a página (ou reabre o Dashboard depois)
- **THEN** a coluna "Vagas" daquela turma exibe o valor salvo anteriormente, não o default `0`

#### Scenario: Editar o campo não navega para o detalhe da turma
- **WHEN** o usuário clica no campo de Vagas de uma linha da tabela (inclusive nas setas do campo numérico)
- **THEN** a aplicação permanece no Dashboard, sem navegar para `/turmas/:idTurma`

#### Scenario: Erro ao salvar reverte o valor exibido
- **WHEN** o usuário edita o valor de Vagas e a requisição `PUT /api/vagas/:idTurma` falha
- **THEN** a célula volta a exibir o valor anterior (antes da edição), sem deixar a tela num estado inconsistente

#### Scenario: Valor inválido não é enviado
- **WHEN** o usuário tenta definir um valor negativo, não-inteiro ou maior que `25`
- **THEN** o valor não é persistido e a célula não assume o valor inválido

