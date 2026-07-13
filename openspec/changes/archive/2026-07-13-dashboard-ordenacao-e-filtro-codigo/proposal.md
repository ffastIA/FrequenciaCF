## Why

A tabela de turmas do Dashboard (página inicial) sempre aparece na ordem devolvida pela API, sem forma de ordenar por coluna — a mesma limitação já resolvida na tela de detalhe da turma (change `detalhe-ordenacao-colunas`). Além disso, quando o usuário já sabe o código de uma ou mais turmas específicas (ex.: acompanhamento pontual, sem querer navegar pela cascata de filtros até achar visualmente a linha certa), não há como pular direto para elas — é preciso rolar a tabela inteira.

## What Changes

- **Ordenação por coluna na tabela de turmas do Dashboard**: mesmo comportamento já implementado na tabela de alunos da tela de detalhe — clicar no cabeçalho de qualquer coluna (Código, Curso, Instrutor, Situação, Início, Término, Último lançamento, Dias de atraso) ordena a tabela por ela, alternando crescente/decrescente a cada clique, com indicador visual e uma única coluna ativa por vez.
- **Lógica de ordenação compartilhada**: a comparação (texto com acentuação, número, `null` sempre por último) é extraída para um utilitário comum (`frontend/src/utils/ordenacao.js`), reaproveitado tanto pelo Dashboard quanto pela tela de detalhe (refatoração mínima, sem mudar o comportamento já validado nesta última).
- **Novo filtro opcional "Código da turma"**: campo de texto na mesma barra de filtros adicionais (junto de Instrutor e Situação), abaixo da linha de Meta, onde o usuário digita o código de uma ou mais turmas separados por ponto e vírgula (ex.: `IR2-2602;OBR2-2602`). A tabela passa a mostrar somente as turmas cujo código bata (exato, sem diferenciar maiúsculas/minúsculas, ignorando espaços) com algum dos códigos informados.
- **Filtro aplicado no cliente, não no backend**: como a tabela já tem todas as turmas do escopo carregadas, o filtro por código é uma restrição adicional sobre os dados já em memória — sem chamada nova à API.
- **Preservado na URL**, como os demais filtros do Dashboard: refresh, voltar do drill-down e link compartilhado mantêm os códigos digitados. Resetado junto com Instrutor/Situação ao trocar Projeto/Aditivo/Meta.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: tabela de turmas do Dashboard ganha ordenação por coluna e um filtro opcional por código de turma(s).

## Impact

- **Frontend alterado**: `frontend/src/pages/Dashboard.jsx` (estado/URL do filtro de código, estado de ordenação, cabeçalhos clicáveis), `frontend/src/pages/TurmaDetalhe.jsx` (passa a importar a lógica de comparação do utilitário compartilhado, em vez de tê-la duplicada), novo `frontend/src/utils/ordenacao.js`, `frontend/src/index.css` (reaproveita o estilo de cabeçalho clicável já existente).
- **Sem mudança de backend**, sem endpoints novos, sem dependências novas.
- **Sem impacto em outras telas** além do reaproveitamento do utilitário de ordenação.
