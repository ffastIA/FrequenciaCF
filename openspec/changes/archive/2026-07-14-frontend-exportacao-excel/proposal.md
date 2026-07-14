## Why

O projeto nunca teve exportação implementada — a "Fase 3 (Exportação)" foi deliberadamente adiada no início do desenvolvimento (`IMPLEMENTATION_GUIDE.md`: "Frontend antes da Phase 3 — exportação fica para o final"), e nenhum código de CSV existe hoje. O pedido agora é: implementar exportação para **Excel (.xlsx)** diretamente — não CSV —, em todas as páginas que têm tabela, refletindo a tabela exatamente como está na tela no momento do clique (filtros e ordenação já aplicados). Escopo propositalmente simples por agora; funcionalidades mais completas (múltiplas planilhas, seleção de colunas, formatação avançada) ficam para avaliação futura.

## What Changes

- **Botão "Exportar para Excel" nas duas telas com tabela**: Dashboard (tabela de turmas) e detalhe da turma / drill-down (tabela de alunos ativos).
- **Geração 100% no cliente, sem endpoint novo no backend**: o `IMPLEMENTATION_GUIDE.md` original previa endpoints de exportação no backend (via SheetJS), mas como a tabela renderizada já reflete filtros e ordenação aplicados só no frontend (código de turma, instrutor, situação, ordenação por coluna), gerar o arquivo no backend exigiria duplicar toda essa lógica lá. Gerar no cliente, a partir dos mesmos dados já carregados e já ordenados/filtrados, é mais simples e garante que o arquivo reflita exatamente o que está na tela — sem chamada de rede adicional.
- **Biblioteca `xlsx` (SheetJS, edição comunitária/gratuita)**: mesma biblioteca já prevista no guia original, usada aqui em modo client-side (gera o arquivo e aciona o download diretamente no navegador).
- **Conteúdo do arquivo = exatamente as linhas e colunas visíveis no momento do clique**: mesmos rótulos de cabeçalho da tabela na tela, mesmos valores formatados (datas `dd/mm/aaaa`, situação traduzida, "—" para valores ausentes/nulos ou ainda não carregados), na mesma ordem (respeitando a ordenação por coluna ativa) e already filtrados (respeitando os filtros já aplicados, incluindo o filtro de código de turma no Dashboard).
- **Botão só aparece quando há dados para exportar** (mesma condição que já exibe a tabela), evitando gerar um arquivo vazio.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: novo botão de exportação para Excel na tabela de turmas do Dashboard e na tabela de alunos do detalhe da turma.

## Impact

- **Frontend alterado**: `frontend/package.json` (nova dependência `xlsx`), novo utilitário `frontend/src/utils/exportarExcel.js` (ou similar, reaproveitado pelas duas telas), `frontend/src/pages/Dashboard.jsx` e `frontend/src/pages/TurmaDetalhe.jsx` (botão + chamada ao utilitário).
- **Sem mudança de backend, sem endpoint novo**; banco continua somente leitura — a exportação não faz nenhuma chamada ao backend além das que a tela já faz para exibir a tabela.
- **Diverge do plano original do `IMPLEMENTATION_GUIDE.md`** (que prévia endpoints de exportação no backend) — decisão registrada e justificada em `design.md`, dada a evolução real da arquitetura do frontend desde que aquele plano foi escrito.
