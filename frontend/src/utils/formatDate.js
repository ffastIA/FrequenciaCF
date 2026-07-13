// Formata datas vindas da API (ISO: "2022-08-08" ou "2022-08-08T03:00:00.000Z")
// como dd/mm/aaaa. Valores nulos/ausentes viram "—".
export function formatDateBR(value) {
  if (!value) return '—';
  const isoDate = String(value).slice(0, 10);
  const [ano, mes, dia] = isoDate.split('-');
  if (!ano || !mes || !dia) return '—';
  return `${dia}/${mes}/${ano}`;
}
