import { get } from './client';

export function getFaltas(idTurma, idAluno, dataInicio, dataFim) {
  return get('/api/metricas/faltas', { idTurma, idAluno, dataInicio, dataFim });
}

export function getAtrasoTurma(idTurma) {
  return get('/api/metricas/atraso-lancamento/turma', { idTurma });
}

export function getAtrasoInstrutor(idInstrutor) {
  return get('/api/metricas/atraso-lancamento/instrutor', { idInstrutor });
}

export function getFaltasRecentes(idTurma) {
  return get('/api/metricas/faltas-recentes', { idTurma });
}

export function getTurmasAtrasadas(params) {
  return get('/api/metricas/atraso-lancamento/turmas-atrasadas', params);
}
