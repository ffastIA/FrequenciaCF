import { get } from './client';

export function getProjetos() {
  return get('/api/filtros/projetos');
}

export function getAditivos(idProjeto) {
  return get('/api/filtros/aditivos', { idProjeto });
}

export function getMetas(idProjetoAditivo) {
  return get('/api/filtros/metas', { idProjetoAditivo });
}

export function getTurmas({ idProjeto, idProjetoAditivo, idMeta, idInstrutor, status }) {
  return get('/api/filtros/turmas', { idProjeto, idProjetoAditivo, idMeta, idInstrutor, status });
}

export function getInstrutores(idTurmas) {
  return get('/api/filtros/instrutores', { idTurmas: idTurmas.join(',') });
}

export function getAlunos(idTurma, situacao) {
  return get('/api/filtros/alunos', { idTurma, situacao });
}
