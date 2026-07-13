## Why

Na tela de detalhe da turma (drill-down), a tabela de alunos ativos sempre aparece na ordem devolvida pela API, sem forma de ordenar por uma coluna específica. Para identificar rapidamente, por exemplo, os alunos com mais faltas recentes ou o maior percentual de faltas, o usuário precisa ler a tabela inteira manualmente. O pedido é permitir clicar no cabeçalho de qualquer coluna para ordenar a tabela por ela, alternando entre crescente e decrescente a cada clique — tanto para colunas de texto (nome do aluno) quanto de número (faltas, percentual).

## What Changes

- **Ordenação por coluna, só no frontend**: clicar no cabeçalho de uma coluna da tabela de alunos (Aluno, Quantidade de faltas, Percentual de faltas, Faltas nas últimas 4 aulas) ordena as linhas por aquela coluna. Sem mudança de backend — a tabela já tem todos os dados carregados no cliente.
- **Alternância crescente/decrescente**: primeiro clique num cabeçalho ordena crescente; clicar de novo no mesmo cabeçalho inverte para decrescente; clicar de novo volta a crescente (alternância contínua entre os dois estados, sem um terceiro estado "sem ordenação" depois do primeiro clique).
- **Trocar de coluna reinicia a ordenação**: clicar num cabeçalho diferente do que estava ativo ordena a nova coluna em ordem crescente, substituindo a ordenação anterior (só uma coluna ordenada por vez).
- **Indicador visual**: o cabeçalho da coluna ativa mostra visualmente a direção da ordenação atual (crescente ou decrescente).
- **Ordenação por valor real, não pelo texto exibido**: colunas numéricas ordenam pelo valor numérico (não como texto), e valores ausentes/carregando (`—`, `...`) sempre vão para o final da lista, independentemente da direção escolhida.
- **Texto ordenado de forma correta em português**: nomes de aluno são comparados de forma alfabética considerando acentuação (`localeCompare` em pt-BR), não pela ordem bruta de código de caractere.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: tabela de alunos da tela de detalhe da turma ganha ordenação clicável por coluna.

## Impact

- **Frontend alterado**: `frontend/src/pages/TurmaDetalhe.jsx` (estado de ordenação, lógica de comparação, cabeçalhos clicáveis), `frontend/src/index.css` (indicador visual de coluna/direção ativa).
- **Sem mudança de backend**, sem endpoints novos, sem dependências novas (ordenação feita com `Array.prototype.sort` nativo).
- **Sem impacto em outras telas** — escopo é só a tabela de alunos da tela de detalhe (drill-down), não a tabela de turmas do Dashboard.
