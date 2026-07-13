class InstrutorModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async getInstrutoresPorTurmas(idTurmas = []) {
    if (idTurmas.length === 0) return [];

    const placeholders = idTurmas.map(() => '?').join(', ');
    const sql = `
      SELECT DISTINCT i.*
      FROM instrutor i
      INNER JOIN turma t ON t.id_instrutor = i.id_instrutor
      WHERE t.id_turma IN (${placeholders})
    `;
    return this.query(sql, idTurmas);
  }

  async getInstrutorById(id) {
    const rows = await this.query(
      'SELECT * FROM instrutor WHERE id_instrutor = ?',
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = InstrutorModel;
