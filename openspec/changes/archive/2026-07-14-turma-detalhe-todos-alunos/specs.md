## frontend-dashboard

### MODIFIED: Detalhe de turma — tabela de alunos

#### Description
Tabela de alunos na tela TurmaDetalhe exibe informações de frequência.

#### Changed Requirement
Adicionar dropdown de filtro por situação (tipo Projeto/Aditivo) antes da tabela de alunos. Dropdown lista todas as 9 situações possíveis + "Todos". Default = "Ativo" (situacao=7). Usuário pode mudar o filtro para ver alunos de qualquer outra situação. Coluna "Situação" continua visível para diferenciar alunos por estado.

#### Scenarios
- **Dropdown de filtro renderiza corretamente:**
  - Dropdown aparece com 10 opções: "Todos", "Não especificado", "Matriculado", "Concluiu", "Desistiu", "Evadido", "Não aprovado", "Não iniciou", "Ativo", "Transferido"
  - Default selecionado = "Ativo" (situacao=7)
  - Dropdown tem o mesmo estilo visual dos filtros Projeto/Aditivo do Dashboard

- **Filtro "Ativo" (default) exibe apenas alunos ativos:**
  - Ao carregar a página, dropdown está em "Ativo"
  - Tabela mostra apenas alunos com situacao=7
  - API é chamada com `/api/filtros/alunos?idTurma=X&situacao=7`

- **Mudar filtro para "Evadido" exibe apenas evadidos:**
  - Usuário clica no dropdown e seleciona "Evadido" (situacao=4)
  - Tabela atualiza para mostrar apenas alunos com situacao=4
  - API é chamada com `/api/filtros/alunos?idTurma=X&situacao=4`
  - URL também atualiza: `/turmas/123?situacao=4`

- **Filtro "Todos" exibe todos os alunos:**
  - Usuário seleciona "Todos"
  - Tabela exibe todos os alunos da turma (todas as situações)
  - API é chamada com `/api/filtros/alunos?idTurma=X` (sem parâmetro situacao)
  - URL: `/turmas/123?situacao=` ou sem o parâmetro

- **Ordenação respeita o filtro selecionado:**
  - Se filtro é "Ativo", ordenação só ordena os alunos ativos
  - Se filtro é "Todos", ordenação ordena todos os alunos

- **Export respeita o filtro selecionado:**
  - Se filtro é "Ativo", export contém apenas alunos ativos
  - Se filtro é "Evadido", export contém apenas evadidos
  - Se filtro é "Todos", export contém todos os alunos

- **URL preserva o filtro selecionado:**
  - Ao recarregar a página com `/turmas/123?situacao=4`, dropdown fica em "Evadido"
  - Ao voltar via breadcrumb para Dashboard e retornar à turma, mantém o filtro salvo na URL

#### Acceptance Criteria
- ✅ Dropdown de filtro de situação está visível no topo da tabela (antes do cabeçalho da tabela)
- ✅ Dropdown lista todas as 10 opções (Todos + 9 situações)
- ✅ Default selecionado = "Ativo"
- ✅ Tabela inicia mostrando apenas alunos ativos
- ✅ Mudar o filtro atualiza a tabela imediatamente (sem recarregar a página)
- ✅ Coluna "Situação" renderiza corretamente para cada aluno exibido
- ✅ Ordenação respeita o filtro selecionado
- ✅ Export para Excel respeita o filtro selecionado
- ✅ URL é atualizada com o parâmetro `situacao` ao mudar o filtro
- ✅ Recarregar a página preserva o filtro selecionado (via URL)
- ✅ Nenhuma chamada de escrita ao backend
