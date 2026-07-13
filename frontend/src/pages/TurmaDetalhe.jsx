import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getAlunos } from '../api/filtros';
import { getAtrasoTurma, getFaltasRecentes } from '../api/metricas';
import { useFaltasPorAlunos } from '../hooks/useFaltasPorAlunos';
import { STATUS_TURMA } from '../constants';
import { formatDateBR } from '../utils/formatDate';

// Alunos exibidos no detalhe: somente situação "ativo" (matricula.situacao = 7),
// decisão explícita do responsável do projeto.
const SITUACAO_ATIVO = 7;

function formatPercentual(percentual) {
  return percentual === null || percentual === undefined ? '—' : `${percentual}%`;
}

// Compara dois valores (já extraídos, não a string formatada da célula) respeitando
// a direção escolhida. null/undefined sempre vão por último, nas duas direções —
// só a comparação entre valores reais é invertida pela direção.
function compararValores(a, b, tipo, direcao) {
  const aNulo = a === null || a === undefined;
  const bNulo = b === null || b === undefined;
  if (aNulo && bNulo) return 0;
  if (aNulo) return 1;
  if (bNulo) return -1;

  const comparacao = tipo === 'texto' ? a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }) : a - b;
  return direcao === 'asc' ? comparacao : -comparacao;
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

  const faltas = useFaltasPorAlunos(idTurma, alunos);

  useEffect(() => {
    setCarregandoAlunos(true);
    setErro(null);

    Promise.all([getAlunos(idTurma, SITUACAO_ATIVO), getAtrasoTurma(idTurma), getFaltasRecentes(idTurma)])
      .then(([alunosResultado, atrasoResultado, faltasRecentesResultado]) => {
        setAlunos(alunosResultado);
        setAtraso(atrasoResultado);
        setFaltasRecentes(faltasRecentesResultado);
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregandoAlunos(false));
  }, [idTurma]);

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

  const colunaOrdenada = colunas.find((c) => c.chave === ordenacao.coluna);
  const alunosOrdenados = colunaOrdenada
    ? [...alunos].sort((a, b) =>
        compararValores(colunaOrdenada.valor(a), colunaOrdenada.valor(b), colunaOrdenada.tipo, ordenacao.direcao)
      )
    : alunos;

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
        </div>
      </section>

      <h2 className="section-title">Alunos ativos</h2>

      {carregandoAlunos ? (
        <p className="state-message">Carregando alunos...</p>
      ) : alunos.length === 0 ? (
        <p className="state-message">Nenhum aluno ativo nesta turma.</p>
      ) : (
        <section className="card table-card">
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
