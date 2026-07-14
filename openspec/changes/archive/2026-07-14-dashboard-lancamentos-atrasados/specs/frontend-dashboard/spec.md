## ADDED Requirements

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
