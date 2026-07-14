const SITUACAO_MAP = {
  0: 'Não especificado',
  1: 'Matriculado',
  2: 'Concluiu',
  3: 'Desistiu',
  4: 'Evadido',
  5: 'Não aprovado',
  6: 'Não iniciou',
  7: 'Ativo',
  8: 'Transferido',
};

export function formatSituacaoAluno(situacao) {
  return SITUACAO_MAP[situacao] ?? 'Desconhecido';
}
