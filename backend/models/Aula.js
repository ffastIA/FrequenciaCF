class AulaModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async getAulasPorTurma(idTurma, dataInicio, dataFim) {
    return this.query(
      'SELECT * FROM aula WHERE id_turma = ? AND data BETWEEN ? AND ?',
      [idTurma, dataInicio, dataFim]
    );
  }

  // status da aula: 0 prevista / 1 realizada
  async getAulasRealizadas(idTurmas = [], dataInicio, dataFim) {
    if (idTurmas.length === 0) return [];

    const placeholders = idTurmas.map(() => '?').join(', ');
    const sql = `
      SELECT *
      FROM aula
      WHERE id_turma IN (${placeholders})
        AND data BETWEEN ? AND ?
        AND status = 1
    `;
    return this.query(sql, [...idTurmas, dataInicio, dataFim]);
  }
}

module.exports = AulaModel;
