import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getAlunos } from '../api/filtros';
import { getAtrasoTurma, getFaltasRecentes } from '../api/metricas';
import { useFaltasPorAlunos } from '../hooks/useFaltasPorAlunos';
import { STATUS_TURMA } from '../constants';
import { formatDateBR, dataDeHojeParaArquivo } from '../utils/formatDate';
import { compararValores } from '../utils/ordenacao';
import { exportarParaExcel } from '../utils/exportarExcel';
import { formatSituacaoAluno } from '../utils/formatSituacaoAluno';

const SITUACOES_ALUNO = {
  0: { label: 'Não especificado', value: 0 },
  1: { label: 'Matriculado', value: 1 },
  2: { label: 'Concluiu', value: 2 },
  3: { label: 'Desistiu', value: 3 },
  4: { label: 'Evadido', value: 4 },
  5: { label: 'Não aprovado', value: 5 },
  6: { label: 'Não iniciou', value: 6 },
  7: { label: 'Ativo', value: 7 },
  8: { label: 'Transferido', value: 8 },
};

function formatPercentual(percentual) {
  return percentual === null || percentual === undefined ? '—' : `${percentual}%`;
}

export default function TurmaDetalhe() {
  const { idTurma } = useParams();
  const location = useLocation();
  const turma = location.state?.turma;
  // URL de origem do dashboard (com os filtros); fallback "/" no acesso direto
  const from = location.state?.from || '/';

  const [alunos, setAlunos] = useState([]);
  const [carregandoAlunos, setCarregandoAlunos] = useState(true);
  const [atraso, setAtraso] = useState(null);
  const [faltasRecentes, setFaltasRecentes] = useState(null);
  const [erro, setErro] = useState(null);
  const [ordenacao, setOrdenacao] = useState({ coluna: null, direcao: 'asc' });
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('7');

  const faltas = useFaltasPorAlunos(idTurma, alunos);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const situacaoUrl = queryParams.get('situacao');

    if (situacaoUrl !== null) {
      setSituacaoSelecionada(situacaoUrl);
    } else {
      setSituacaoSelecionada('7');
    }
  }, [location.search]);

  useEffect(() => {
    setCarregandoAlunos(true);
    setErro(null);

    const situacaoParam = situacaoSelecionada === '' ? undefined : parseInt(situacaoSelecionada, 10);

    Promise.all([getAlunos(idTurma, situacaoParam), getAtrasoTurma(idTurma), getFaltasRecentes(idTurma)])
      .then(([alunosResultado, atrasoResultado, faltasRecentesResultado]) => {
        setAlunos(alunosResultado);
        setAtraso(atrasoResultado);
        setFaltasRecentes(faltasRecentesResultado);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregandoAlunos(false));
  }, [idTurma, situacaoSelecionada]);

  // Mapa idAluno -> quantidadeFaltas nas últimas N aulas realizadas (mesma janela
  // para todos os alunos da turma, vinda de uma única chamada por turma).
  const faltasRecentesPorAluno = Object.fromEntries(
    (faltasRecentes?.porAluno || []).map((f) => [f.idAluno, f.quantidadeFaltas])
  );

  // Colunas da tabela de alunos: cada uma expõe um extrator de valor BRUTO (não a
  // string formatada da célula) para a ordenação comparar corretamente números como
  // número e texto como texto. null = "sem dado ainda" (carregando ou inexistente).
  const colunas = [
    { chave: 'nome', rotulo: 'Aluno', tipo: 'texto', valor: (aluno) => aluno.nome },
    {
      chave: 'situacao',
      rotulo: 'Situação',
      tipo: 'numero',
      valor: (aluno) => aluno.situacao ?? null,
    },
    {
      chave: 'quantidadeFaltas',
      rotulo: 'Quantidade de faltas',
      tipo: 'numero',
      valor: (aluno) => {
        const falta = faltas[aluno.id_aluno];
        return falta && !falta.carregando && !falta.erro ? falta.quantidadeFaltas : null;
      },
    },
    {
      chave: 'percentualFaltas',
      rotulo: 'Percentual de faltas',
      tipo: 'numero',
      valor: (aluno) => {
        const falta = faltas[aluno.id_aluno];
        return falta && !falta.carregando && !falta.erro ? falta.percentualFaltas : null;
      },
    },
    {
      chave: 'faltasRecentes',
      rotulo: 'Faltas (últimas 4 aulas)',
      tipo: 'numero',
      valor: (aluno) => {
        if (!faltasRecentes || faltasRecentes.aulasConsideradas === 0) return null;
        return faltasRecentesPorAluno[aluno.id_aluno] ?? 0;
      },
    },
  ];

  function handleOrdenar(chave) {
    setOrdenacao((atual) =>
      atual.coluna === chave
        ? { coluna: chave, direcao: atual.direcao === 'asc' ? 'desc' : 'asc' }
        : { coluna: chave, direcao: 'asc' }
    );
  }

  function handleMudarSituacao(valor) {
    setSituacaoSelecionada(valor);

    const params = new URLSearchParams(location.search);
    if (valor === '') {
      params.delete('situacao');
    } else {
      params.set('situacao', valor);
    }
    window.history.replaceState(null, '', `?${params.toString()}`);
  }

  const colunaOrdenada = colunas.find((c) => c.chave === ordenacao.coluna);
  const alunosOrdenados = colunaOrdenada
    ? [...alunos].sort((a, b) =>
        compararValores(colunaOrdenada.valor(a), colunaOrdenada.valor(b), colunaOrdenada.tipo, ordenacao.direcao)
      )
    : alunos;

  // Colunas de exportação: mesmo rótulo e mesmo valor FORMATADO exibido na
  // célula (percentual com "%", "X/N" de faltas recentes, "—" para nulos).
  const colunasExportacao = [
    { rotulo: 'Aluno', valor: (aluno) => aluno.nome },
    { rotulo: 'Situação', valor: (aluno) => formatSituacaoAluno(aluno.situacao ?? 0) },
    {
      rotulo: 'Quantidade de faltas',
      valor: (aluno) => {
        const falta = faltas[aluno.id_aluno];
        const carregandoFalta = !falta || falta.carregando;
        return carregandoFalta ? '—' : falta.erro ? '—' : falta.quantidadeFaltas;
      },
    },
    {
      rotulo: 'Percentual de faltas',
      valor: (aluno) => {
        const falta = faltas[aluno.id_aluno];
        const carregandoFalta = !falta || falta.carregando;
        return carregandoFalta ? '—' : falta.erro ? '—' : formatPercentual(falta.percentualFaltas);
      },
    },
    {
      rotulo: 'Faltas (últimas 4 aulas)',
      valor: (aluno) => {
        const aulasConsideradas = faltasRecentes?.aulasConsideradas ?? 0;
        if (!faltasRecentes) return '—';
        if (aulasConsideradas === 0) return '—';
        const faltasRecentesAluno = faltasRecentesPorAluno[aluno.id_aluno] ?? 0;
        return `${faltasRecentesAluno}/${aulasConsideradas}`;
      },
    },
  ];

  function handleExportar() {
    const codigoTurma = turma?.codigo || idTurma;
    exportarParaExcel(`alunos-${codigoTurma}-${dataDeHojeParaArquivo()}.xlsx`, colunasExportacao, alunosOrdenados);
  }

  return (
    <div>
      <p className="back-link">
        <Link to={from}>&larr; Voltar ao dashboard</Link>
      </p>

      <h1 className="page-title">Turma {turma ? turma.codigo : idTurma}</h1>

      {erro && <p className="state-message state-error">{erro}</p>}

      <section className="card info-card">
        {turma && (
          <dl className="info-grid">
            <div>
              <dt>Curso</dt>
              <dd>{turma.cursoDescricao}</dd>
            </div>
            <div>
              <dt>Instrutor</dt>
              <dd>{turma.instrutorNome}</dd>
            </div>
            <div>
              <dt>Situação</dt>
              <dd>
                <span className={`badge status-${turma.status}`}>{STATUS_TURMA[turma.status]}</span>
              </dd>
            </div>
            <div>
              <dt>Início</dt>
              <dd>{formatDateBR(turma.data_inicio)}</dd>
            </div>
            <div>
              <dt>Término</dt>
              <dd>{formatDateBR(turma.data_fim)}</dd>
            </div>
          </dl>
        )}

        <div className="metric-row">
          <div className="metric-highlight">
            <span className="metric-label">Dias de atraso no lançamento</span>
            <span className="metric-value">{atraso ? atraso.diasAtraso ?? '—' : '...'}</span>
          </div>
          <div className="metric-highlight">
            <span className="metric-label">Último lançamento de frequência</span>
            <span className="metric-value">
              {atraso ? formatDateBR(atraso.dataUltimoLancamento) : '...'}
            </span>
          </div>
          <div className="metric-highlight">
            <span className="metric-label">Alunos listados</span>
            <span className="metric-value">{alunos.length}</span>
          </div>
        </div>
      </section>

      <div className="filter-bar">
        <div className="filter-field">
          <span>Situação</span>
          <select value={situacaoSelecionada} onChange={(e) => handleMudarSituacao(e.target.value)}>
            <option value="">Todos</option>
            {Object.entries(SITUACOES_ALUNO).map(([key, obj]) => (
              <option key={key} value={key}>
                {obj.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {carregandoAlunos ? (
        <p className="state-message">Carregando alunos...</p>
      ) : alunos.length === 0 ? (
        <p className="state-message">Nenhum aluno nesta turma.</p>
      ) : (
        <section className="card table-card">
          <div className="table-toolbar">
            <button type="button" className="btn-secondary" onClick={handleExportar}>
              Exportar para Excel
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                {colunas.map((coluna) => (
                  <th
                    key={coluna.chave}
                    className={coluna.tipo === 'numero' ? 'col-num sortable' : 'sortable'}
                    onClick={() => handleOrdenar(coluna.chave)}
                  >
                    {coluna.rotulo}
                    {ordenacao.coluna === coluna.chave && (
                      <span className="sort-indicator">{ordenacao.direcao === 'asc' ? ' ▲' : ' ▼'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alunosOrdenados.map((aluno) => {
                const falta = faltas[aluno.id_aluno];
                const carregandoFalta = !falta || falta.carregando;
                const aulasConsideradas = faltasRecentes?.aulasConsideradas ?? 0;
                const faltasRecentesAluno = faltasRecentesPorAluno[aluno.id_aluno] ?? 0;
                return (
                  <tr key={aluno.id_aluno}>
                    <td>{aluno.nome}</td>
                    <td>{formatSituacaoAluno(aluno.situacao ?? 0)}</td>
                    <td className="col-num">
                      {carregandoFalta ? '...' : falta.erro ? '—' : falta.quantidadeFaltas}
                    </td>
                    <td className="col-num">
                      {carregandoFalta ? '...' : falta.erro ? '—' : formatPercentual(falta.percentualFaltas)}
                    </td>
                    <td className="col-num">
                      {!faltasRecentes
                        ? '...'
                        : aulasConsideradas === 0
                          ? '—'
                          : `${faltasRecentesAluno}/${aulasConsideradas}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
