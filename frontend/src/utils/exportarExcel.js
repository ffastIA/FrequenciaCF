import * as XLSX from 'xlsx';

// Gera e baixa uma planilha .xlsx a partir das linhas já filtradas/ordenadas
// exibidas na tela. `colunas` é `{ rotulo, valor: (linha) => string }[]` — os
// mesmos rótulos e valores já formatados usados na renderização da tabela,
// não os extratores brutos usados para ordenação.
export function exportarParaExcel(nomeArquivo, colunas, linhas) {
  const dados = linhas.map((linha) =>
    Object.fromEntries(colunas.map((coluna) => [coluna.rotulo, coluna.valor(linha)]))
  );
  const planilha = XLSX.utils.json_to_sheet(dados, { header: colunas.map((c) => c.rotulo) });
  const livro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(livro, planilha, 'Planilha1');
  XLSX.writeFile(livro, nomeArquivo);
}
