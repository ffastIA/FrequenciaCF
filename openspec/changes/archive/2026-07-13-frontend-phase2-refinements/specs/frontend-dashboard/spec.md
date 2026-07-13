## MODIFIED Requirements

### Requirement: Colunas da tabela de turmas
A tabela de turmas SHALL exibir, para cada turma: código, curso (`cursoDescricao`), instrutor (`instrutorNome`), situação (`status` traduzido para texto legível), data de início (`data_inicio`), data de término (`data_fim`), data do último lançamento de frequência (`dataUltimoLancamento`, obtida na mesma chamada de atraso já feita por turma) e dias de atraso no lançamento (`diasAtraso`). Todas as datas SHALL ser exibidas no formato `dd/mm/aaaa`; valores nulos SHALL ser exibidos como "—".

#### Scenario: Situação exibida como texto
- **WHEN** uma turma tem `status = 3`
- **THEN** a coluna de situação exibe "Concluída" (não o número `3`)

#### Scenario: Período da turma visível
- **WHEN** a tabela de turmas é exibida
- **THEN** cada linha mostra as datas de início e término da turma no formato `dd/mm/aaaa`

#### Scenario: Último lançamento visível na tabela
- **WHEN** a chamada de atraso de uma turma retorna `dataUltimoLancamento`
- **THEN** a linha correspondente exibe essa data formatada; se `null` (turma nunca lançou), exibe "—"

### Requirement: Tela de detalhe da turma
A rota `/turmas/:idTurma` SHALL exibir os dados básicos da turma (quando disponíveis via navegação a partir do Dashboard) — incluindo data de início e data de término —, seu `diasAtraso` e a data do último lançamento de frequência (`dataUltimoLancamento`, exibindo "—" quando `null`), e uma tabela somente com os alunos **ativos** da turma (via `GET /api/filtros/alunos?idTurma=X&situacao=7`), cada um com `quantidadeFaltas` e `percentualFaltas` (via `GET /api/metricas/faltas?idTurma=X&idAluno=Y`, uma chamada por aluno em paralelo). Quando a turma não tiver nenhum aluno em situação "ativo", a tela SHALL exibir mensagem específica de que não há alunos ativos (distinta de "sem alunos matriculados"). Quando a tela é acessada diretamente (sem navegação prévia pelo Dashboard), os dados básicos da turma podem estar indisponíveis, mas `diasAtraso`, último lançamento e a tabela de alunos SHALL continuar funcionando normalmente.

#### Scenario: Detalhe mostra atraso, último lançamento e faltas por aluno ativo
- **WHEN** o usuário acessa `/turmas/:idTurma` a partir de um clique na tabela do Dashboard
- **THEN** a tela exibe início/término da turma, `diasAtraso`, a data do último lançamento formatada, e uma tabela contendo somente os alunos com `matricula.situacao = 7`, com `quantidadeFaltas` e `percentualFaltas` de cada um

#### Scenario: Turma sem alunos ativos
- **WHEN** a turma acessada não tem nenhum aluno com `matricula.situacao = 7` (ex.: turma concluída)
- **THEN** a tela exibe uma mensagem indicando que não há alunos **ativos** nesta turma, sem erro

#### Scenario: Acesso direto sem estado de navegação
- **WHEN** a rota `/turmas/:idTurma` é acessada diretamente (ex.: link direto, F5), sem o estado de navegação do Dashboard
- **THEN** a tela ainda exibe `diasAtraso`, último lançamento e a tabela de alunos ativos corretamente, mesmo sem os dados básicos (código/curso/instrutor/situação/datas) da turma

## ADDED Requirements

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
