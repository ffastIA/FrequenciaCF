import { get, put } from './client';

export function getVagas() {
  return get('/api/vagas');
}

export function setVagas(idTurma, vagas) {
  return put(`/api/vagas/${idTurma}`, { vagas });
}
