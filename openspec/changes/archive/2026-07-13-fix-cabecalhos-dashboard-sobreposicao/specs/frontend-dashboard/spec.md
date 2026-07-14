## MODIFIED Requirements

### Requirement: Colunas da tabela de turmas
A tabela de turmas SHALL exibir, para cada turma, nesta ordem: código, curso (`cursoDescricao`), instrutor (`instrutorNome`), situação (`status` traduzido para texto legível), total de alunos matriculados — rotulada "Alunos Matriculados" (`totalAlunosMatriculados`, alunos com `matricula.situacao = 1` naquela turma), total de alunos ativos — rotulada "Alunos ativos" (`totalAlunosAtivos`, alunos com `matricula.situacao = 7` naquela turma), data de início (`data_inicio`), data de término (`data_fim`), data do último lançamento de frequência — rotulada "Último Lançamento" (`dataUltimoLancamento`, obtida na mesma chamada de atraso já feita por turma) — e dias de atraso no lançamento — rotulada "Dias em Atraso" (`diasAtraso`). Todas as datas SHALL ser exibidas no formato `dd/mm/aaaa`; valores nulos SHALL ser exibidos como "—". As colunas de alunos matriculados e de alunos ativos SHALL exibir o número diretamente a partir da resposta de `GET /api/filtros/turmas`, sem chamada de rede adicional nem estado de carregamento próprio. Os cabeçalhos das colunas SHALL permitir quebra de texto em duas ou mais linhas quando o rótulo for longo, para que a largura de cada coluna seja determinada pelo conteúdo exibido (data/número/texto da linha), não pelo comprimento do texto do cabeçalho; as células de dado (`<td>`) das colunas de data e número SHALL continuar sem quebra de linha. A quebra de cabeçalho SHALL NUNCA resultar em sobreposição visual entre colunas adjacentes — quando uma palavra do rótulo não couber inteira na largura disponível mesmo quebrando em espaços, o texto SHALL quebrar dentro da própria palavra em vez de vazar sobre a coluna vizinha.

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

#### Scenario: Total de alunos matriculados visível na tabela, entre Situação e Alunos ativos
- **WHEN** a tabela de turmas é exibida
- **THEN** cada linha mostra, entre as colunas "Situação" e "Alunos ativos", o número de alunos matriculados daquela turma (`totalAlunosMatriculados`), sem atraso de carregamento

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
