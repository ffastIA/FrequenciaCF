// Compara dois valores (já extraídos, não a string formatada da célula) respeitando
// a direção escolhida. null/undefined sempre vão por último, nas duas direções —
// só a comparação entre valores reais é invertida pela direção.
export function compararValores(a, b, tipo, direcao) {
  const aNulo = a === null || a === undefined;
  const bNulo = b === null || b === undefined;
  if (aNulo && bNulo) return 0;
  if (aNulo) return 1;
  if (bNulo) return -1;

  const comparacao = tipo === 'texto' ? a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }) : a - b;
  return direcao === 'asc' ? comparacao : -comparacao;
}
