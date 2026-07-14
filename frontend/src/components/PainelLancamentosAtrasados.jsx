import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTurmasAtrasadas } from '../api/metricas';
import { formatDateBR, dataDeHojeParaArquivo } from '../utils/formatDate';
import { exportarParaExcel } from '../utils/exportarExcel';

const TAMANHO_PAGINA = 10;
const PRAZO_DIAS_ATRASO = 7;

// Painel "Lançamentos atrasados": modal sobre o Dashboard (não é uma rota), que
// reutiliza exatamente o escopo de filtros correntes do Dashboard (Projeto/Aditivo
// obrigatórios; Meta/Instrutor/Situação opcionais) — sem seleção de filtro própria.
export default function PainelLancamentosAtrasados({ aberto, onFechar, filtros }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);

  const { idProjeto, idProjetoAditivo, idMeta, idInstrutor, status } = filtros;

  useEffect(() => {
    if (!aberto) return;
    setBusca('');
    setPagina(1);
  }, [aberto]);

  useEffect(() => {
    if (!aberto || !idProjeto || !idProjetoAditivo) return;
    setCarregando(true);
    setErro(null);
    getTurmasAtrasadas({
      idProjeto,
      idProjetoAditivo,
      idMeta: idMeta || undefined,
      idInstrutor: idInstrutor || undefined,
      status: status !== '' ? status : undefined,
    })
      .then(setDados)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, [aberto, idProjeto, idProjetoAditivo, idMeta, idInstrutor, status]);

  if (!aberto) return null;

  const turmas = dados?.turmas || [];

  // Busca client-side por código ou curso (a turma não tem um campo de "nome"
  // próprio no schema; o curso é o identificador textual mais próximo disso),
  // sem diferenciar maiúsculas/minúsculas, sobre a lista já carregada.
  const termoBusca = busca.trim().toLowerCase();
  const turmasFiltradas = termoBusca
    ? turmas.filter(
        (t) =>
          t.codigo?.toLowerCase().includes(termoBusca) ||
          t.cursoDescricao?.toLowerCase().includes(termoBusca)
      )
    : turmas;

  // Ordenação padrão (única): dias de atraso decrescente. Este painel não expõe
  // ordenação por coluna clicável — é uma lista já pré-filtrada, não uma tabela
  // de uso geral como o Dashboard/TurmaDetalhe.
  const turmasOrdenadas = [...turmasFiltradas].sort((a, b) => b.diasAtraso - a.diasAtraso);

  const totalPaginas = Math.max(1, Math.ceil(turmasOrdenadas.length / TAMANHO_PAGINA));
  const paginaEfetiva = Math.min(pagina, totalPaginas);
  const inicio = (paginaEfetiva - 1) * TAMANHO_PAGINA;
  const turmasPagina = turmasOrdenadas.slice(inicio, inicio + TAMANHO_PAGINA);

  const colunasExportacao = [
    { rotulo: 'Código', valor: (t) => t.codigo },
    { rotulo: 'Curso', valor: (t) => t.cursoDescricao },
    { rotulo: 'Instrutor', valor: (t) => t.instrutorNome },
    { rotulo: 'Dias em Atraso', valor: (t) => t.diasAtraso },
    { rotulo: 'Último Lançamento', valor: (t) => formatDateBR(t.dataUltimoLancamento) },
  ];

  function handleExportar() {
    exportarParaExcel(
      `turmas-atrasadas-${dataDeHojeParaArquivo()}.xlsx`,
      colunasExportacao,
      turmasOrdenadas
    );
  }

  function handleAbrirTurma(turma) {
    navigate(`/turmas/${turma.idTurma}`, {
      state: {
        turma: { codigo: turma.codigo, cursoDescricao: turma.cursoDescricao, instrutorNome: turma.instrutorNome },
        from: location.pathname + location.search,
      },
    });
  }

  return (
    <div className="modal-backdrop" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Lançamentos atrasados</h2>
            <p className="modal-subtitle">
              Turmas com lançamento de frequência fora do prazo, considerando o prazo ideal de
              até {PRAZO_DIAS_ATRASO} dias após a última aula.
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onFechar} aria-label="Fechar">
            &times;
          </button>
        </div>

        {erro && <p className="state-message state-error">{erro}</p>}

        {carregando ? (
          <p className="state-message">Carregando turmas atrasadas...</p>
        ) : (
          <>
            <div className="metric-row">
              <div className="metric-highlight">
                <span className="metric-label">Turmas em atraso</span>
                <span className="metric-value">{dados?.total ?? 0}</span>
              </div>
              <div className="metric-highlight">
                <span className="metric-label">Média de dias de atraso</span>
                <span className="metric-value">{dados?.mediaDiasAtraso ?? '—'}</span>
              </div>
            </div>

            <div className="modal-toolbar">
              <label className="filter-field">
                <span>Buscar por código ou curso</span>
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Ex.: IR2-2602 ou Robótica"
                />
              </label>
              {turmasOrdenadas.length > 0 && (
                <button type="button" className="btn-secondary" onClick={handleExportar}>
                  Exportar para Excel
                </button>
              )}
            </div>

            {turmasOrdenadas.length === 0 ? (
              <p className="state-message">Nenhuma turma em atraso neste escopo.</p>
            ) : (
              <>
                <div className="table-card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Curso</th>
                        <th>Instrutor</th>
                        <th className="col-num">Dias em Atraso</th>
                        <th className="col-date">Último Lançamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turmasPagina.map((turma) => (
                        <tr key={turma.idTurma} className="clickable" onClick={() => handleAbrirTurma(turma)}>
                          <td>{turma.codigo}</td>
                          <td>{turma.cursoDescricao}</td>
                          <td>{turma.instrutorNome}</td>
                          <td className="col-num">{turma.diasAtraso}</td>
                          <td className="col-date">{formatDateBR(turma.dataUltimoLancamento)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="modal-pagination">
                  <span>
                    Mostrando {inicio + 1} a {Math.min(inicio + TAMANHO_PAGINA, turmasOrdenadas.length)} de{' '}
                    {turmasOrdenadas.length} turmas
                  </span>
                  {totalPaginas > 1 && (
                    <div className="modal-pagination-controls">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setPagina((p) => Math.max(1, p - 1))}
                        disabled={paginaEfetiva === 1}
                      >
                        Anterior
                      </button>
                      <span>
                        Página {paginaEfetiva} de {totalPaginas}
                      </span>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                        disabled={paginaEfetiva === totalPaginas}
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
