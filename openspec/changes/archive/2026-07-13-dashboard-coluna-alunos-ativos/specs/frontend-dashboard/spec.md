## MODIFIED Requirements

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
