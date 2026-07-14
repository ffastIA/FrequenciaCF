## MODIFIED Requirements

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
