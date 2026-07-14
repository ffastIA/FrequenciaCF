## 1. Rótulos

- [x] 1.1 `Dashboard.jsx`: renomear `rotulo` de `ultimoLancamento` para "Último Lançamento"
- [x] 1.2 `Dashboard.jsx`: renomear `rotulo` de `diasAtraso` para "Dias em Atraso"
- [x] 1.3 Confirmar que a ordem das colunas no array `colunas` já corresponde à sequência pedida (Código, Curso, Instrutor, Situação, Alunos ativos, Início, Término, Último Lançamento, Dias em Atraso) — sem mudança de código nessa parte

## 2. CSS: cabeçalhos quebram linha, dados não

- [x] 2.1 `index.css`: ajustado com escopo mais estrito que o previsto — em vez de editar `.data-table th`/`.col-date, .col-num` diretamente (o que afetaria também a tabela de alunos do drill-down, já que a classe é compartilhada), adicionada classe `.table-turmas` só no `<table>` do Dashboard (`Dashboard.jsx`) e regra `.table-turmas th { white-space: normal; max-width: 100px; line-height: 1.3; }`, respeitando o Non-Goal do design.md
- [x] 2.2 `index.css`: `.table-turmas td.col-date, .table-turmas td.col-num { white-space: nowrap; }` — mesma lógica de "só células de dado", mas escopada ao Dashboard
- [x] 2.3 Ajustar `line-height`/padding do cabeçalho se necessário para não ficar visualmente apertado com 2 linhas

## 3. Testes manuais no navegador

- [x] 3.1 Confirmar ordem final das colunas na tela: Código, Curso, Instrutor, Situação, Alunos ativos, Início, Término, Último Lançamento, Dias em Atraso
- [x] 3.2 Confirmar que "Último Lançamento", "Dias em Atraso" e "Alunos ativos" quebram em 2+ linhas no cabeçalho
- [x] 3.3 Confirmar que as células de dado (datas, números) continuam numa linha só, sem quebra
- [x] 3.4 Confirmar visualmente que as colunas de data/número ficaram mais estreitas que antes (largura guiada pelo dado, não pelo cabeçalho)
- [x] 3.5 Clicar nos cabeçalhos renomeados para confirmar que a ordenação continua funcionando normalmente (chave não mudou, só o rótulo)
- [x] 3.6 Confirmar que o filtro por código de turma e os demais filtros continuam funcionando (regressão)
- [x] 3.7 Sem erros no console
