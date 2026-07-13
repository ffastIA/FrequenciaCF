class FrequenciaModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  async getFrequenciasPorTurma(idTurma, dataInicio, dataFim) {
    const sql = `
      SELECT f.*, au.id_turma, au.data AS data_aula
      FROM frequencia f
      INNER JOIN aula au ON au.id_aula = f.id_aula
      WHERE au.id_turma = ?
        AND au.data BETWEEN ? AND ?
    `;
    return this.query(sql, [idTurma, dataInicio, dataFim]);
  }

  // Aulas realizadas (status = 1) sem nenhuma frequência lançada
  async getFrequenciasNaoLancadas(idTurmas = [], dataInicio, dataFim) {
    if (idTurmas.length === 0) return [];

    const placeholders = idTurmas.map(() => '?').join(', ');
    const sql = `
      SELECT au.*
      FROM aula au
      LEFT JOIN frequencia f ON f.id_aula = au.id_aula
      WHERE au.id_turma IN (${placeholders})
        AND au.data BETWEEN ? AND ?
        AND au.status = 1
        AND f.id_frequencia IS NULL
    `;
    return this.query(sql, [...idTurmas, dataInicio, dataFim]);
  }

  // aulasPrevistas = toda aula da turma no período, independente de status.
  // quantidadeFaltas = frequencia do aluno com presenca = 2 dentro dessas aulas.
  async getFaltasEPrevistasPorAluno(idTurma, idAluno, dataInicio, dataFim) {
    const sql = `
      SELECT
        COUNT(*) AS aulas_previstas,
        COALESCE(SUM(CASE WHEN f.presenca = 2 THEN 1 ELSE 0 END), 0) AS quantidade_faltas
      FROM aula au
      LEFT JOIN frequencia f ON f.id_aula = au.id_aula AND f.id_aluno = ?
      WHERE au.id_turma = ?
        AND au.data BETWEEN ? AND ?
    `;
    const rows = await this.query(sql, [idAluno, idTurma, dataInicio, dataFim]);
    return {
      aulasPrevistas: Number(rows[0].aulas_previstas),
      quantidadeFaltas: Number(rows[0].quantidade_faltas),
    };
  }

  // Aulas do período sem nenhum registro de frequência lançado (para nenhum aluno)
  async getAulasSemFrequenciaLancada(idTurma, dataInicio, dataFim) {
    const sql = `
      SELECT COUNT(*) AS aulas_sem_frequencia
      FROM aula au
      WHERE au.id_turma = ?
        AND au.data BETWEEN ? AND ?
        AND NOT EXISTS (SELECT 1 FROM frequencia f WHERE f.id_aula = au.id_aula)
    `;
    const rows = await this.query(sql, [idTurma, dataInicio, dataFim]);
    return Number(rows[0].aulas_sem_frequencia);
  }

  // Aula mais recente da turma (data <= hoje) com frequência efetivamente lançada.
  // "Lançada" exige as DUAS condições:
  //   1) au.status = 1 (aula realizada) — aulas futuras/agendadas (status = 0) já vêm
  //      com frequencia pré-copiada da aula anterior (mesmo presenca por aluno), então
  //      só presenca <> 0 não basta: pegaria uma cópia adiantada como se fosse hoje.
  //   2) existe frequencia com presenca <> 0 — presenca = 0 é placeholder de "não lançado".
  // "hoje" é calculado pela aplicação (fuso America/Sao_Paulo), não por CURDATE()
  // do MySQL, para não depender do fuso configurado no servidor de banco.
  async getUltimaAulaLancadaPorTurma(idTurma, hoje) {
    const sql = `
      SELECT au.data
      FROM aula au
      WHERE au.id_turma = ?
        AND au.data <= ?
        AND au.status = 1
        AND EXISTS (SELECT 1 FROM frequencia f WHERE f.id_aula = au.id_aula AND f.presenca <> 0)
      ORDER BY au.data DESC
      LIMIT 1
    `;
    const rows = await this.query(sql, [idTurma, hoje]);
    return rows[0] || null;
  }

  // Fallback: aula mais antiga da turma com data <= dataLimite (turma nunca lançou nada)
  async getPrimeiraAulaPorTurma(idTurma, dataLimite) {
    const sql = `
      SELECT au.data
      FROM aula au
      WHERE au.id_turma = ?
        AND au.data <= ?
      ORDER BY au.data ASC
      LIMIT 1
    `;
    const rows = await this.query(sql, [idTurma, dataLimite]);
    return rows[0] || null;
  }

  // Aula mais recente (data <= hoje) com frequência efetivamente lançada entre todas
  // as turmas do instrutor (turma.id_instrutor, não aula.id_instrutor). Mesma definição
  // de "lançada" de getUltimaAulaLancadaPorTurma: au.status = 1 (realizada) E existe
  // frequencia com presenca <> 0 (aulas agendadas com frequencia pré-copiada não contam).
  // "hoje" calculado pela aplicação (fuso America/Sao_Paulo), não por CURDATE() do MySQL.
  async getUltimaAulaLancadaPorInstrutor(idInstrutor, hoje) {
    const sql = `
      SELECT au.data
      FROM aula au
      INNER JOIN turma t ON t.id_turma = au.id_turma
      WHERE t.id_instrutor = ?
        AND au.data <= ?
        AND au.status = 1
        AND EXISTS (SELECT 1 FROM frequencia f WHERE f.id_aula = au.id_aula AND f.presenca <> 0)
      ORDER BY au.data DESC
      LIMIT 1
    `;
    const rows = await this.query(sql, [idInstrutor, hoje]);
    return rows[0] || null;
  }

  // Últimas N aulas REALIZADAS (status = 1) da turma, com data <= dataLimite.
  // status = 1 exclui aulas agendadas/não realizadas, que podem ter frequencia
  // pré-copiada de uma aula anterior (mesma armadilha do "último lançamento").
  // Ordena por data DESC, id_aula DESC: quando há mais de uma aula na mesma data
  // (turnos/módulos diferentes), o id_aula desempata de forma estável.
  async getUltimasAulasRealizadasPorTurma(idTurma, dataLimite, quantidade) {
    const sql = `
      SELECT id_aula, data
      FROM aula
      WHERE id_turma = ?
        AND status = 1
        AND data <= ?
      ORDER BY data DESC, id_aula DESC
      LIMIT ?
    `;
    return this.query(sql, [idTurma, dataLimite, quantidade]);
  }

  // Quantidade de faltas (presenca = 2) de cada aluno matriculado na turma,
  // restrita a um conjunto específico de aulas (as "últimas N realizadas").
  // Aluno sem registro de frequencia numa aula não conta falta para ela (LEFT JOIN).
  async getFaltasPorAlunoEmAulas(idTurma, idsAula = []) {
    const matriculados = await this.query(
      'SELECT DISTINCT id_aluno FROM matricula WHERE id_turma = ?',
      [idTurma]
    );

    if (idsAula.length === 0) {
      return matriculados.map((m) => ({ idAluno: m.id_aluno, quantidadeFaltas: 0 }));
    }

    const placeholders = idsAula.map(() => '?').join(', ');
    const sql = `
      SELECT m.id_aluno,
        COALESCE(SUM(CASE WHEN f.presenca = 2 THEN 1 ELSE 0 END), 0) AS quantidade_faltas
      FROM matricula m
      LEFT JOIN frequencia f ON f.id_aluno = m.id_aluno AND f.id_aula IN (${placeholders})
      WHERE m.id_turma = ?
      GROUP BY m.id_aluno
    `;
    const rows = await this.query(sql, [...idsAula, idTurma]);
    return rows.map((r) => ({ idAluno: r.id_aluno, quantidadeFaltas: Number(r.quantidade_faltas) }));
  }

  // Fallback: aula mais antiga (data <= dataLimite) entre as turmas do instrutor
  async getPrimeiraAulaPorInstrutor(idInstrutor, dataLimite) {
    const sql = `
      SELECT au.data
      FROM aula au
      INNER JOIN turma t ON t.id_turma = au.id_turma
      WHERE t.id_instrutor = ?
        AND au.data <= ?
      ORDER BY au.data ASC
      LIMIT 1
    `;
    const rows = await this.query(sql, [idInstrutor, dataLimite]);
    return rows[0] || null;
  }
}

module.exports = FrequenciaModel;
