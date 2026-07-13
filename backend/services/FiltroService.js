class FiltroService {
  constructor(projetoModel, aditivoModel, metaModel, turmaModel, instrutorModel) {
    this.projeto = projetoModel;
    this.aditivo = aditivoModel;
    this.meta = metaModel;
    this.turma = turmaModel;
    this.instrutor = instrutorModel;
  }

  // Cascata 1
  async getProjetos() {
    return this.projeto.getProjetos();
  }

  // Cascata 2
  async getAditivosPorProjeto(idProjeto) {
    return this.aditivo.getAditivosPorProjeto(idProjeto);
  }

  // Cascata 3
  async getMetasPorAditivo(idProjetoAditivo) {
    return this.meta.getMetasPorAditivo(idProjetoAditivo);
  }

  // Cascata 4 - Núcleo da lógica (inclui filtro de situação da turma)
  async getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, idMeta, idInstrutor, status) {
    return this.turma.getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, {
      idMeta,
      idInstrutor,
      status,
    });
  }

  // Cascata 5
  async getInstrutoresPorTurmas(idTurmas) {
    return this.instrutor.getInstrutoresPorTurmas(idTurmas);
  }
}

module.exports = FiltroService;
