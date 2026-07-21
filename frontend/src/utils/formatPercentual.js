export function formatPercentual(percentual) {
  return percentual === null || percentual === undefined ? '—' : `${percentual}%`;
}
