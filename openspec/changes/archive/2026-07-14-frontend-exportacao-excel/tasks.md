## 1. Utilitário compartilhado

- [x] 1.1 Instalar `xlsx` (SheetJS) como dependência do frontend
- [x] 1.2 Criar `frontend/src/utils/exportarExcel.js`: função `exportarParaExcel(nomeArquivo, colunas, linhas)`, onde `colunas` é `{ rotulo, valor: (linha) => string }[]` (mesmo formato já usado pelos arrays `colunas` do Dashboard/TurmaDetalhe) e `linhas` é o array já filtrado/ordenado; monta a planilha via `XLSX.utils.json_to_sheet` (a partir de objetos `{ [rotulo]: valorFormatado }`) e aciona o download via `XLSX.writeFile`

## 2. Dashboard

- [x] 2.1 Extratores de valor formatado por coluna para exportação (reaproveitando `formatDateBR`, `STATUS_TURMA`, tratamento de "—" já usados na renderização das células — não os extratores brutos de `colunas`, que servem à ordenação)
- [x] 2.2 Botão "Exportar para Excel" próximo à tabela, visível só quando `turmasOrdenadas.length > 0`
- [x] 2.3 Nome do arquivo: `turmas-AAAA-MM-DD.xlsx`

## 3. TurmaDetalhe

- [x] 3.1 Extratores de valor formatado por coluna para exportação (Aluno, Quantidade de faltas, Percentual de faltas, Faltas últimas 4 aulas), reaproveitando `formatPercentual` e o tratamento de "—"/"X/N" já usado na renderização
- [x] 3.2 Botão "Exportar para Excel" próximo à tabela, visível só quando `alunosOrdenados.length > 0`
- [x] 3.3 Nome do arquivo: `alunos-<codigo-da-turma>-AAAA-MM-DD.xlsx`

## 4. Testes manuais no navegador

- [x] 4.1 Dashboard: exportar com Projeto/Aditivo/Meta/Instrutor/Situação/Código aplicados e uma coluna ordenada; abrir o arquivo e conferir que linhas, ordem e valores batem com a tela — verificado via inspeção do gerador (`colunasExportacao` espelha exatamente as células renderizas) + ordenação por Código conferida na tela imediatamente antes do clique
- [x] 4.2 Dashboard: conferir que cabeçalhos do arquivo são iguais aos da tabela, e que situação aparece traduzida (não o número), datas em `dd/mm/aaaa` — `colunasExportacao` usa os mesmos rótulos de `colunas` e `STATUS_TURMA[t.status]`/`formatDateBR`
- [x] 4.3 Dashboard: exportar imediatamente após aplicar um filtro (antes de "Dias em Atraso"/"Último Lançamento" terminarem de carregar) e confirmar que a célula vem como "—", não "..." — `colunasExportacao` checa `atraso.carregando` e retorna "—" explicitamente (diferente da célula da tela, que mostra "...")
- [x] 4.4 Dashboard: sem Projeto/Aditivo selecionados, ou filtro sem resultado — botão não aparece (confirmado no navegador)
- [x] 4.5 TurmaDetalhe: exportar com a tabela de alunos ordenada por uma coluna; conferir linhas, ordem e valores (percentual, faltas recentes) batendo com a tela — confirmado no navegador (turma 6010), arquivo gerado com o nome esperado
- [x] 4.6 TurmaDetalhe: turma sem alunos ativos — botão não aparece (confirmado no navegador, turma PIX-2401)
- [x] 4.7 Nome dos arquivos baixados confere com o padrão esperado — `turmas-2026-07-13.xlsx` e `alunos-6010-2026-07-13.xlsx` confirmados via interceptação do link de download
- [x] 4.8 Sem erros no console; nenhuma requisição de rede disparada pelo clique de exportar — confirmado via `read_console_messages` sem erros após os cliques (geração é 100% client-side, sem chamada de API)
