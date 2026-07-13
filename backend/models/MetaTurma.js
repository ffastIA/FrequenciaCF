class MetaTurmaModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async getMetasPorAditivo(idProjetoAditivo) {
    return this.query(
      'SELECT * FROM meta_turma WHERE id_projeto_aditivo = ?',
      [idProjetoAditivo]
    );
  }
}

module.exports = MetaTurmaModel;
