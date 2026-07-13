## ADDED Requirements

### Requirement: Ordenação por coluna na tabela de alunos do detalhe da turma
Na tela de detalhe da turma (`/turmas/:idTurma`), cada cabeçalho da tabela de alunos (Aluno, Quantidade de faltas, Percentual de faltas, Faltas nas últimas 4 aulas) SHALL ser clicável. O primeiro clique num cabeçalho SHALL ordenar a tabela por aquela coluna em ordem crescente; um novo clique no mesmo cabeçalho SHALL inverter para ordem decrescente; um novo clique SHALL voltar a crescente, alternando indefinidamente entre as duas direções (sem um terceiro estado "sem ordenação" após o primeiro clique). Clicar num cabeçalho diferente do que estava ativo SHALL trocar a ordenação para a nova coluna em ordem crescente, mantendo sempre uma única coluna ordenada por vez. O cabeçalho da coluna ativa SHALL exibir um indicador visual da direção atual (crescente ou decrescente).

#### Scenario: Primeiro clique ordena crescente
- **WHEN** o usuário clica pela primeira vez no cabeçalho de uma coluna
- **THEN** a tabela é reordenada por aquela coluna em ordem crescente, e o cabeçalho exibe o indicador de "crescente"

#### Scenario: Segundo clique na mesma coluna inverte para decrescente
- **WHEN** o usuário clica novamente no cabeçalho da coluna que já está ordenando a tabela
- **THEN** a tabela é reordenada em ordem decrescente, e o indicador do cabeçalho muda para "decrescente"

#### Scenario: Terceiro clique volta a crescente
- **WHEN** o usuário clica uma terceira vez no mesmo cabeçalho (já em ordem decrescente)
- **THEN** a tabela volta a ordem crescente

#### Scenario: Clicar em outra coluna substitui a ordenação ativa
- **WHEN** a tabela está ordenada por uma coluna e o usuário clica no cabeçalho de outra coluna
- **THEN** a tabela passa a ser ordenada pela nova coluna em ordem crescente, e o indicador visual da coluna anterior desaparece

### Requirement: Ordenação por valor real, não pelo texto exibido na célula
A ordenação SHALL comparar o valor subjacente de cada coluna (número para colunas numéricas, texto para a coluna de aluno), não a string formatada exibida na célula (`—`, `X%`, `X/N`, `...`). Colunas de texto SHALL ser comparadas de forma alfabética considerando acentuação e ignorando maiúsculas/minúsculas (locale pt-BR). Linhas cujo valor da coluna ordenada ainda esteja carregando ou seja ausente/nulo SHALL aparecer sempre por último, independentemente da direção de ordenação escolhida.

#### Scenario: Ordenação numérica correta
- **WHEN** o usuário ordena a coluna "Quantidade de faltas" em ordem crescente
- **THEN** as linhas aparecem em ordem numérica (ex.: 0, 1, 2, 10), não em ordem alfabética de texto (que colocaria "10" antes de "2")

#### Scenario: Nomes com acentuação ordenados corretamente
- **WHEN** o usuário ordena a coluna "Aluno" em ordem crescente
- **THEN** nomes com acentos (ex.: "Álvaro", "Ébano") aparecem na posição alfabética correta, não deslocados para o início ou fim por causa do caractere acentuado

#### Scenario: Valores ausentes ficam por último em ambas as direções
- **WHEN** a coluna "Percentual de faltas" é ordenada (crescente ou decrescente) e alguns alunos têm `percentualFaltas: null` (turma sem aulas previstas) ou o dado ainda está carregando
- **THEN** essas linhas aparecem sempre no final da tabela, em ambas as direções de ordenação

#### Scenario: Ordenação se ajusta conforme os dados assíncronos chegam
- **WHEN** a tabela está ordenada por uma coluna cujos valores ainda estão sendo carregados por aluno
- **THEN** conforme cada valor chega, a linha correspondente é reposicionada de acordo com a ordenação ativa, sem exigir uma nova interação do usuário
