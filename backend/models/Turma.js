class TurmaModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  // filtros: { idMeta, idInstrutor, status }
  // status (situação da turma): 0 não especificado / 1 não iniciada / 2 iniciada / 3 concluída / 4 cancelada
  async getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, filtros = {}) {
    const { idMeta, idInstrutor, status } = filtros;

    // totalAlunosAtivos via subquery correlacionado (não JOIN): uma relação 1:N com
    // matricula duplicaria as linhas de turma e exigiria GROUP BY em todo o SELECT t.*.
    let sql = `
      SELECT t.*, c.descricao AS cursoDescricao, i.nome AS instrutorNome,
        (SELECT COUNT(*) FROM matricula m WHERE m.id_turma = t.id_turma AND m.situacao = 7) AS totalAlunosAtivos
      FROM turma t
      INNER JOIN meta_turma mt ON t.id_meta_turma = mt.id_meta_turma
      LEFT JOIN curso c ON c.id_curso = t.id_curso
      LEFT JOIN instrutor i ON i.id_instrutor = t.id_instrutor
      WHERE mt.id_projeto = ?
        AND mt.id_projeto_aditivo = ?
    `;
    const params = [idProjeto, idProjetoAditivo];

    if (idMeta !== undefined && idMeta !== null) {
      sql += ' AND t.id_meta_turma = ?';
      params.push(idMeta);
    }

    if (idInstrutor !== undefined && idInstrutor !== null) {
      sql += ' AND t.id_instrutor = ?';
      params.push(idInstrutor);
    }

    if (status !== undefined && status !== null) {
      sql += ' AND t.status = ?';
      params.push(status);
    }

    return this.query(sql, params);
  }

  async getTurmaById(id) {
    const rows = await this.query('SELECT * FROM turma WHERE id_turma = ?', [id]);
    return rows[0] || null;
  }
}

module.exports = TurmaModel;
