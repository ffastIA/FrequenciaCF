class ProjetoAditivoModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async getAditivosPorProjeto(idProjeto) {
    return this.query(
      'SELECT * FROM projeto_aditivo WHERE id_projeto = ?',
      [idProjeto]
    );
  }
}

module.exports = ProjetoAditivoModel;
