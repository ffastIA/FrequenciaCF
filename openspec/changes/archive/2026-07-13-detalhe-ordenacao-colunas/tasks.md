## 1. Lógica de ordenação

- [x] 1.1 Estado `{ coluna, direcao }` em `TurmaDetalhe.jsx` (coluna: `'nome' | 'quantidadeFaltas' | 'percentualFaltas' | 'faltasRecentes' | null`; direcao: `'asc' | 'desc'`)
- [x] 1.2 Handler de clique no cabeçalho: mesma coluna inverte direção; coluna diferente troca para a nova, começando em `asc`
- [x] 1.3 Funções extratoras de valor bruto por coluna (nome, quantidadeFaltas, percentualFaltas, faltasRecentesPorAluno) — independentes da string formatada da célula
- [x] 1.4 Comparador genérico: texto via `localeCompare('pt-BR', { sensitivity: 'base' })`; número via subtração; `null`/`undefined` sempre por último em ambas as direções
- [x] 1.5 Lista de alunos ordenada derivada a cada render (não duplicar em outro `useState`), para acompanhar os dados assíncronos conforme chegam

## 2. UI

- [x] 2.1 Cabeçalhos da tabela viram clicáveis (cursor pointer, `onClick`)
- [x] 2.2 Indicador visual de coluna/direção ativa (ex.: seta ▲/▼ ao lado do texto do cabeçalho)
- [x] 2.3 Estilo do cabeçalho clicável no CSS (hover, indicador), sem quebrar o layout existente da tabela

## 3. Testes manuais no navegador

- [x] 3.1 Clicar em "Aluno": ordena alfabeticamente (considerando acentuação) em ordem crescente; clicar de novo inverte para decrescente
- [x] 3.2 Clicar em "Quantidade de faltas": ordena numericamente (não como texto), alternando crescente/decrescente
- [x] 3.3 Clicar em "Percentual de faltas" numa turma com algum aluno com `percentualFaltas: null`: linha nula fica sempre por último, nas duas direções
- [x] 3.4 Clicar em "Faltas (últimas 4 aulas)": ordena pelo numerador (quantidade de faltas), não pela string "X/N"
- [x] 3.5 Trocar de coluna no meio de uma ordenação: nova coluna assume, indicador da anterior some, nova começa em crescente
- [x] 3.6 Observar comportamento durante o carregamento assíncrono das faltas: linhas se reordenam conforme os dados chegam, sem erro
- [x] 3.7 Sem erros no console; nenhuma requisição de rede nova disparada pela ordenação (é só client-side)
