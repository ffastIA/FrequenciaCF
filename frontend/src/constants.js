export const STATUS_TURMA = {
  0: 'Não especificado',
  1: 'Não iniciada',
  2: 'Iniciada',
  3: 'Concluída',
  4: 'Cancelada',
};

export const STATUS_TURMA_OPTIONS = Object.entries(STATUS_TURMA).map(([value, label]) => ({
  value: Number(value),
  label,
}));
