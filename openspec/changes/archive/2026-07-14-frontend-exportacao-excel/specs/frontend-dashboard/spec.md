## ADDED Requirements

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
