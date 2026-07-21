## MODIFIED Requirements

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
