class AlunoModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  // situacao (matricula.situacao): 0 não especificado / 1 matriculado / 2 concluiu /
  // 3 desistiu / 4 evadido / 5 não aprovado / 6 não iniciou / 7 ativo / 8 transferido
  async getAlunosPorTurma(idTurma, situacao) {
    let sql = `
      SELECT a.*, m.situacao
      FROM aluno a
      INNER JOIN matricula m ON m.id_aluno = a.id_aluno
      WHERE m.id_turma = ?
    `;
    const params = [idTurma];

    if (situacao !== undefined && situacao !== null) {
      sql += ' AND m.situacao = ?';
      params.push(situacao);
    }

    return this.query(sql, params);
  }

  async getAlunoById(id) {
    const rows = await this.query('SELECT * FROM aluno WHERE id_aluno = ?', [id]);
    return rows[0] || null;
  }
}

module.exports = AlunoModel;
