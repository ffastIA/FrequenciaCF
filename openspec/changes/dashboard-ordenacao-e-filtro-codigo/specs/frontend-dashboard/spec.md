## ADDED Requirements

### Requirement: Ordenação por coluna na tabela de turmas do Dashboard
Na tela do Dashboard, cada cabeçalho da tabela de turmas (Código, Curso, Instrutor, Situação, Início, Término, Último lançamento, Dias de atraso) SHALL ser clicável. O primeiro clique num cabeçalho SHALL ordenar a tabela por aquela coluna em ordem crescente; um novo clique no mesmo cabeçalho SHALL inverter para ordem decrescente; um novo clique SHALL voltar a crescente, alternando indefinidamente entre as duas direções. Clicar num cabeçalho diferente do que estava ativo SHALL trocar a ordenação para a nova coluna em ordem crescente, mantendo sempre uma única coluna ordenada por vez. O cabeçalho da coluna ativa SHALL exibir um indicador visual da direção atual (crescente ou decrescente). Este comportamento SHALL seguir os mesmos critérios de comparação já estabelecidos para a tabela de alunos da tela de detalhe da turma (comparação por valor bruto, texto com acentuação, valores ausentes por último).

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

## MODIFIED Requirements

### Requirement: Filtros adicionais de Instrutor, Situação e Código da turma
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
