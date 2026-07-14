function formatDate(date) {
  if (typeof date === 'string') return date.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

// "Hoje" é sempre calculado no fuso de Brasília (America/Sao_Paulo), não em UTC:
// usar toISOString() diretamente adiantaria a data em até 3h no fim do dia,
// e não dependemos do fuso configurado no servidor MySQL (CURDATE()) para
// manter uma única fonte de verdade para "hoje" em todo o sistema.
function today() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}

function minDate(a, b) {
  return a < b ? a : b;
}

// "Turma em atraso" = diasAtraso > PRAZO_DIAS_ATRASO (limiar exclusivo). Fixo nesta
// versão; evolução futura planejada: ler de um arquivo de persistência JSON, com
// fallback para este valor caso o arquivo esteja ausente (ver design da change
// dashboard-lancamentos-atrasados).
const PRAZO_DIAS_ATRASO = 7;

function diffDays(fromStr, toStr) {
  const from = new Date(`${fromStr}T00:00:00Z`);
  const to = new Date(`${toStr}T00:00:00Z`);
  return Math.round((to - from) / (1000 * 60 * 60 * 24));
}

class MetricasFrequenciaService {
  constructor(frequenciaModel, turmaModel) {
    this.frequencia = frequenciaModel;
    this.turma = turmaModel;
  }

  // Métricas 1 e 2: quantidade e percentual de faltas por aluno/turma,
  // com aulasSemFrequenciaLancada como indicador de pendência de lançamento.
  async getFaltasPorAluno(idTurma, idAluno, dataInicio, dataFim) {
    const hoje = today();

    let inicioEfetivo = dataInicio;
    if (!inicioEfetivo) {
      const turma = await this.turma.getTurmaById(idTurma);
      inicioEfetivo = formatDate(turma.data_inicio);
    }

    const fimEfetivo = dataFim ? minDate(dataFim, hoje) : hoje;

    const { aulasPrevistas, quantidadeFaltas } =
      await this.frequencia.getFaltasEPrevistasPorAluno(idTurma, idAluno, inicioEfetivo, fimEfetivo);

    const aulasSemFrequenciaLancada =
      await this.frequencia.getAulasSemFrequenciaLancada(idTurma, inicioEfetivo, fimEfetivo);

    const percentualFaltas =
      aulasPrevistas === 0 ? null : Number(((quantidadeFaltas / aulasPrevistas) * 100).toFixed(2));

    return {
      idAluno,
      idTurma,
      dataInicio: inicioEfetivo,
      dataFim: fimEfetivo,
      aulasPrevistas,
      quantidadeFaltas,
      percentualFaltas,
      aulasSemFrequenciaLancada,
    };
  }

  // Métrica 3a: dias de atraso no lançamento, por turma.
  // dataUltimoLancamento é o lançamento real (null se a turma nunca lançou nada),
  // distinto de dataReferencia/diasAtraso, que usam o fallback (aula mais antiga)
  // quando não há nenhum lançamento, para o cálculo de atraso continuar fazendo sentido.
  //
  // Turmas concluídas (status = 3) são exceção: diasAtraso "congela" na data de
  // término (data_fim - dataReferencia) em vez de continuar crescendo com "hoje"
  // para sempre depois que a turma já acabou. Se o último lançamento aconteceu
  // depois do término (~13% das turmas concluídas em produção — ex.: correção
  // tardia), diasAtraso é 0, não negativo: o trabalho foi concluído, sem pendência.
  // A busca de dataReferencia/dataUltimoLancamento em si NÃO muda — continua
  // restrita a "data <= hoje", preservando seu significado de data real do
  // último lançamento independente da situação da turma.
  async getAtrasoLancamentoPorTurma(idTurma) {
    const hoje = today();

    const ultimaLancada = await this.frequencia.getUltimaAulaLancadaPorTurma(idTurma, hoje);
    const dataUltimoLancamento = ultimaLancada ? formatDate(ultimaLancada.data) : null;

    let referencia = ultimaLancada;
    if (!referencia) {
      referencia = await this.frequencia.getPrimeiraAulaPorTurma(idTurma, hoje);
    }
    if (!referencia) {
      return { idTurma, diasAtraso: null, dataReferencia: null, dataUltimoLancamento: null };
    }

    const dataReferencia = formatDate(referencia.data);

    const turma = await this.turma.getTurmaById(idTurma);
    if (turma && turma.status === 3 && turma.data_fim) {
      const dataFim = formatDate(turma.data_fim);
      const diasAtraso = Math.max(0, diffDays(dataReferencia, dataFim));
      return { idTurma, diasAtraso, dataReferencia, dataUltimoLancamento };
    }

    return { idTurma, diasAtraso: diffDays(dataReferencia, hoje), dataReferencia, dataUltimoLancamento };
  }

  // Métrica 3b: dias de atraso no lançamento, agregado por instrutor (turma.id_instrutor).
  async getAtrasoLancamentoPorInstrutor(idInstrutor) {
    const hoje = today();

    const ultimaLancada = await this.frequencia.getUltimaAulaLancadaPorInstrutor(idInstrutor, hoje);
    const dataUltimoLancamento = ultimaLancada ? formatDate(ultimaLancada.data) : null;

    let referencia = ultimaLancada;
    if (!referencia) {
      referencia = await this.frequencia.getPrimeiraAulaPorInstrutor(idInstrutor, hoje);
    }
    if (!referencia) {
      return { idInstrutor, diasAtraso: null, dataReferencia: null, dataUltimoLancamento: null };
    }

    const dataReferencia = formatDate(referencia.data);
    return { idInstrutor, diasAtraso: diffDays(dataReferencia, hoje), dataReferencia, dataUltimoLancamento };
  }

  // Agregado de "turmas em atraso" para um escopo de Projeto/Aditivo (mesmos filtros
  // de TurmaModel.getTurmasPorProjetoAditivo): total, média de diasAtraso entre elas
  // (arredondada, null se total = 0), e a lista dessas turmas. Reaproveita
  // getAtrasoLancamentoPorTurma turma a turma, em paralelo.
  async getTurmasAtrasadas(idProjeto, idProjetoAditivo, filtros = {}) {
    const turmas = await this.turma.getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, filtros);

    const atrasos = await Promise.all(
      turmas.map((turma) => this.getAtrasoLancamentoPorTurma(turma.id_turma))
    );

    const atrasadas = turmas
      .map((turma, i) => ({ turma, atraso: atrasos[i] }))
      .filter(({ atraso }) => atraso.diasAtraso !== null && atraso.diasAtraso > PRAZO_DIAS_ATRASO);

    const total = atrasadas.length;
    const mediaDiasAtraso =
      total === 0
        ? null
        : Math.round(atrasadas.reduce((soma, { atraso }) => soma + atraso.diasAtraso, 0) / total);

    return {
      total,
      mediaDiasAtraso,
      turmas: atrasadas.map(({ turma, atraso }) => ({
        idTurma: turma.id_turma,
        codigo: turma.codigo,
        cursoDescricao: turma.cursoDescricao,
        instrutorNome: turma.instrutorNome,
        diasAtraso: atraso.diasAtraso,
        dataUltimoLancamento: atraso.dataUltimoLancamento,
      })),
    };
  }

  // Quantidade de faltas por aluno nas últimas `quantidadeAulas` aulas REALIZADAS da
  // turma (status = 1). aulasConsideradas reflete quantas aulas realmente existem
  // (pode ser menor que quantidadeAulas em turma recém-iniciada).
  async getFaltasRecentesPorTurma(idTurma, quantidadeAulas = 4) {
    const hoje = today();

    const aulas = await this.frequencia.getUltimasAulasRealizadasPorTurma(idTurma, hoje, quantidadeAulas);
    const idsAula = aulas.map((a) => a.id_aula);

    const porAluno = await this.frequencia.getFaltasPorAlunoEmAulas(idTurma, idsAula);

    return { idTurma, aulasConsideradas: idsAula.length, porAluno };
  }
}

module.exports = MetricasFrequenciaService;
