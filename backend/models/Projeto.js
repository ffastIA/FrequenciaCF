class ProjetoModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async getProjetos() {
    return this.query('SELECT * FROM projeto');
  }

  async getProjetoById(id) {
    const rows = await this.query('SELECT * FROM projeto WHERE id_projeto = ?', [id]);
    return rows[0] || null;
  }
}

module.exports = ProjetoModel;
