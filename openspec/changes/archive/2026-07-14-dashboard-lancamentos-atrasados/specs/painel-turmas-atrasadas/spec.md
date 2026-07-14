## ADDED Requirements

### Requirement: Abertura do painel a partir do Dashboard
O painel "Lançamentos atrasados" SHALL ser aberto como modal sobre a tela do Dashboard, a partir de um ponto de entrada visível somente quando Projeto e Aditivo já estiverem selecionados. O painel SHALL reutilizar exatamente os filtros correntes da URL do Dashboard (Projeto, Aditivo, Meta, Instrutor, Situação) como escopo de turmas consultado — SHALL NOT ter seleção de filtro própria.

#### Scenario: Painel indisponível sem Projeto/Aditivo
- **WHEN** o Dashboard é exibido sem Projeto e Aditivo selecionados
- **THEN** o ponto de entrada do painel "Lançamentos atrasados" não é exibido (ou fica desabilitado)

#### Scenario: Painel reflete o escopo filtrado do Dashboard
- **WHEN** o usuário tem Projeto, Aditivo e Instrutor selecionados no Dashboard e abre o painel
- **THEN** o painel consulta e exibe apenas turmas atrasadas dentro desse mesmo escopo (Projeto + Aditivo + Instrutor)

### Requirement: Cabeçalho e critério do painel
O painel SHALL exibir o título "Lançamentos atrasados", um botão de fechar, e um texto explicativo do critério usado: turmas com lançamento de frequência fora do prazo, considerando o prazo ideal de até 7 dias após a última aula.

#### Scenario: Fechar o painel
- **WHEN** o usuário clica no botão de fechar do painel
- **THEN** o painel é fechado e o Dashboard volta a ficar totalmente visível, sem perder os filtros aplicados

### Requirement: Indicadores agregados do painel
O painel SHALL exibir dois indicadores: o total de turmas em atraso no escopo consultado, e a média de dias de atraso entre essas turmas (arredondada para número inteiro).

#### Scenario: Indicadores exibidos após carregamento
- **WHEN** o painel termina de carregar os dados do escopo consultado
- **THEN** exibe o total de turmas em atraso e a média de dias de atraso arredondada

#### Scenario: Nenhuma turma em atraso no escopo
- **WHEN** o escopo consultado não tem nenhuma turma com `diasAtraso` acima do limiar
- **THEN** o painel exibe total igual a `0`, sem exibir uma média (ex.: "—"), e a tabela mostra uma mensagem de lista vazia

### Requirement: Busca por turma dentro do painel
O painel SHALL disponibilizar um campo de busca que filtra a tabela pelo nome ou código da turma, aplicado no cliente sobre a lista já carregada, sem nova chamada de API.

#### Scenario: Buscar por código ou nome
- **WHEN** o usuário digita um trecho do código ou do nome de uma turma no campo de busca
- **THEN** a tabela exibe somente as turmas atrasadas cujo código ou nome contenha esse trecho (sem diferenciar maiúsculas/minúsculas), sem nova requisição ao backend

### Requirement: Exportação da lista de turmas atrasadas
O painel SHALL disponibilizar um botão "Exportar para Excel" que gera e baixa um arquivo `.xlsx`, no cliente (reaproveitando `exportarParaExcel` de `frontend/src/utils/exportarExcel.js`, introduzido pela change `frontend-exportacao-excel`), contendo as turmas atrasadas atualmente carregadas (respeitando a busca ativa, se houver), com as mesmas colunas exibidas na tabela.

#### Scenario: Exportar lista filtrada
- **WHEN** o usuário tem um termo de busca ativo e clica em "Exportar para Excel"
- **THEN** o arquivo `.xlsx` gerado contém somente as turmas que atendem à busca ativa, não a lista completa do escopo

### Requirement: Tabela de turmas atrasadas
A tabela do painel SHALL exibir, para cada turma em atraso, nesta ordem: código e nome da turma, projeto, instrutor, dias de atraso, e data do último lançamento (formato `dd/mm/aaaa`, "—" quando `null`). As linhas SHALL ser ordenadas por dias de atraso em ordem decrescente por padrão. Cada linha SHALL ser clicável, navegando para `/turmas/:idTurma` da turma correspondente.

#### Scenario: Ordenação padrão por atraso decrescente
- **WHEN** o painel carrega a lista de turmas atrasadas
- **THEN** a turma com maior `diasAtraso` aparece primeiro na tabela

#### Scenario: Navegação para o detalhe da turma
- **WHEN** o usuário clica numa linha (ou no indicador de navegação da linha) da tabela do painel
- **THEN** a aplicação navega para `/turmas/:idTurma` daquela turma

### Requirement: Paginação da tabela do painel
Quando a lista de turmas atrasadas (após aplicar a busca, se houver) exceder o tamanho de uma página, o painel SHALL paginar a tabela no cliente, exibindo a contagem "Mostrando X a Y de Z turmas" e controles de navegação entre páginas.

#### Scenario: Lista maior que uma página
- **WHEN** o número de turmas atrasadas filtradas é maior que o tamanho de página do painel
- **THEN** a tabela exibe apenas a página atual, com navegação para as demais páginas e o texto "Mostrando X a Y de Z turmas" refletindo a página exibida

#### Scenario: Lista cabe em uma página
- **WHEN** o número de turmas atrasadas filtradas é menor ou igual ao tamanho de página
- **THEN** a tabela exibe todas as turmas numa única página, sem controles de paginação
