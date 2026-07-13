class CursoModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async getCursoPorTurma(idTurma) {
    const sql = `
      SELECT c.*
      FROM curso c
      INNER JOIN turma t ON t.id_curso = c.id_curso
      WHERE t.id_turma = ?
    `;
    const rows = await this.query(sql, [idTurma]);
    return rows[0] || null;
  }
}

module.exports = CursoModel;
