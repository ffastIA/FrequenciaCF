// Formata datas vindas da API (ISO: "2022-08-08" ou "2022-08-08T03:00:00.000Z")
// como dd/mm/aaaa. Valores nulos/ausentes viram "—".
export function formatDateBR(value) {
  if (!value) return '—';
  const isoDate = String(value).slice(0, 10);
  const [ano, mes, dia] = isoDate.split('-');
  if (!ano || !mes || !dia) return '—';
  return `${dia}/${mes}/${ano}`;
}

// AAAA-MM-DD de hoje, para compor nomes de arquivo exportados.
export function dataDeHojeParaArquivo() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}
