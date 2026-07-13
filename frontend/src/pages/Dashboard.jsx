import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { getProjetos, getAditivos, getMetas, getTurmas, getInstrutores } from '../api/filtros';
import { useAtrasoPorTurmas } from '../hooks/useAtrasoPorTurmas';
import { STATUS_TURMA, STATUS_TURMA_OPTIONS } from '../constants';
import { formatDateBR } from '../utils/formatDate';

// Situação padrão do dashboard: "Iniciada" (status = 2), refletindo o foco em turmas
// em andamento. Na URL, ausência de `status` = padrão Iniciada; `status=todas` = Todas
// (escolha explícita, preservável); qualquer outro valor = aquela situação específica.
const STATUS_PADRAO = '2';
const STATUS_TODAS = 'todas';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filtros derivam da URL (fonte de verdade): refresh, voltar e link compartilhado
  // reproduzem a mesma seleção.
  const idProjeto = searchParams.get('idProjeto') || '';
  const idProjetoAditivo = searchParams.get('idProjetoAditivo') || '';
  const idMeta = searchParams.get('idMeta') || '';
  const idInstrutor = searchParams.get('idInstrutor') || '';
  const statusParam = searchParams.get('status');
  // valor do select: '' = Todas; '2' = Iniciada (padrão quando ausente); etc.
  const status = statusParam === null ? STATUS_PADRAO : statusParam === STATUS_TODAS ? '' : statusParam;

  const [projetos, setProjetos] = useState([]);
  const [aditivos, setAditivos] = useState([]);
  const [metas, setMetas] = useState([]);
  const [instrutoresDisponiveis, setInstrutoresDisponiveis] = useState([]);

  const [turmas, setTurmas] = useState([]);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [erro, setErro] = useState(null);

  const atrasos = useAtrasoPorTurmas(turmas);

  // Atualiza os query params numa única escrita (mantém a garantia de nunca disparar
  // busca com combinação "no meio do caminho": upstream e downstream mudam juntos).
  function updateParams(mutator) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        mutator(next);
        return next;
      },
      { replace: false }
    );
  }

  // Carrega projetos ao montar a página
  useEffect(() => {
    getProjetos().then(setProjetos).catch((e) => setErro(e.message));
  }, []);

  // Aditivos do Projeto selecionado
  useEffect(() => {
    setAditivos([]);
    if (!idProjeto) return;
    getAditivos(idProjeto).then(setAditivos).catch((e) => setErro(e.message));
  }, [idProjeto]);

  // Metas do Aditivo selecionado
  useEffect(() => {
    setMetas([]);
    if (!idProjetoAditivo) return;
    getMetas(idProjetoAditivo).then(setMetas).catch((e) => setErro(e.message));
  }, [idProjetoAditivo]);

  // Instrutores disponíveis = escopo Projeto/Aditivo/Meta, SEM os filtros adicionais
  useEffect(() => {
    if (!idProjeto || !idProjetoAditivo) {
      setInstrutoresDisponiveis([]);
      return;
    }
    getTurmas({ idProjeto, idProjetoAditivo, idMeta: idMeta || undefined })
      .then((escopo) => getInstrutores(escopo.map((t) => t.id_turma)))
      .then(setInstrutoresDisponiveis)
      .catch((e) => setErro(e.message));
  }, [idProjeto, idProjetoAditivo, idMeta]);

  // Tabela de turmas = todos os filtros aplicados (reage à URL)
  useEffect(() => {
    if (!idProjeto || !idProjetoAditivo) {
      setTurmas([]);
      return;
    }
    setCarregandoTurmas(true);
    setErro(null);
    getTurmas({
      idProjeto,
      idProjetoAditivo,
      idMeta: idMeta || undefined,
      idInstrutor: idInstrutor || undefined,
      status: status !== '' ? status : undefined,
    })
      .then(setTurmas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregandoTurmas(false));
  }, [idProjeto, idProjetoAditivo, idMeta, idInstrutor, status]);

  // Trocar Projeto/Aditivo/Meta reseta os filtros dependentes (Situação volta ao
  // padrão Iniciada, removendo o param `status`).
  function handleProjetoChange(value) {
    updateParams((p) => {
      value ? p.set('idProjeto', value) : p.delete('idProjeto');
      p.delete('idProjetoAditivo');
      p.delete('idMeta');
      p.delete('idInstrutor');
      p.delete('status');
    });
  }

  function handleAditivoChange(value) {
    updateParams((p) => {
      value ? p.set('idProjetoAditivo', value) : p.delete('idProjetoAditivo');
      p.delete('idMeta');
      p.delete('idInstrutor');
      p.delete('status');
    });
  }

  function handleMetaChange(value) {
    updateParams((p) => {
      value ? p.set('idMeta', value) : p.delete('idMeta');
      p.delete('idInstrutor');
      p.delete('status');
    });
  }

  function handleInstrutorChange(value) {
    updateParams((p) => {
      value ? p.set('idInstrutor', value) : p.delete('idInstrutor');
    });
  }

  function handleStatusChange(value) {
    updateParams((p) => {
      // '' = Todas (explícito, para não reverter ao padrão Iniciada); senão a situação.
      p.set('status', value === '' ? STATUS_TODAS : value);
    });
  }

  return (
    <div>
      <h1 className="page-title">Dashboard de Turmas</h1>

      {erro && <p className="state-message state-error">{erro}</p>}

      <section className="card">
        <div className="filter-bar">
          <label className="filter-field">
            <span>Projeto</span>
            <select value={idProjeto} onChange={(e) => handleProjetoChange(e.target.value)}>
              <option value="">Selecione...</option>
              {projetos.map((p) => (
                <option key={p.id_projeto} value={p.id_projeto}>
                  {p.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Aditivo</span>
            <select
              value={idProjetoAditivo}
              onChange={(e) => handleAditivoChange(e.target.value)}
              disabled={!idProjeto}
            >
              <option value="">Selecione...</option>
              {aditivos.map((a) => (
                <option key={a.id_projeto_aditivo} value={a.id_projeto_aditivo}>
                  {a.numero?.trim() || a.id_projeto_aditivo}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-field">
            <span>Meta (opcional)</span>
            <select
              value={idMeta}
              onChange={(e) => handleMetaChange(e.target.value)}
              disabled={!idProjetoAditivo}
            >
              <option value="">Todas</option>
              {metas.map((m) => (
                <option key={m.id_meta_turma} value={m.id_meta_turma}>
                  {m.meta}
                </option>
              ))}
            </select>
          </label>
        </div>

        {idProjeto && idProjetoAditivo ? (
          <div className="filter-bar filter-bar-secondary">
            <label className="filter-field">
              <span>Instrutor</span>
              <select value={idInstrutor} onChange={(e) => handleInstrutorChange(e.target.value)}>
                <option value="">Todos</option>
                {instrutoresDisponiveis.map((i) => (
                  <option key={i.id_instrutor} value={i.id_instrutor}>
                    {i.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span>Situação</span>
              <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                <option value="">Todas</option>
                {STATUS_TURMA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}
      </section>

      {idProjeto && idProjetoAditivo ? (
        carregandoTurmas ? (
          <p className="state-message">Carregando turmas...</p>
        ) : turmas.length === 0 ? (
          <p className="state-message">Nenhuma turma encontrada para os filtros selecionados.</p>
        ) : (
          <section className="card table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Curso</th>
                  <th>Instrutor</th>
                  <th>Situação</th>
                  <th className="col-date">Início</th>
                  <th className="col-date">Término</th>
                  <th className="col-date">Último lançamento</th>
                  <th className="col-num">Dias de atraso</th>
                </tr>
              </thead>
              <tbody>
                {turmas.map((turma) => {
                  const atraso = atrasos[turma.id_turma];
                  const carregandoAtraso = !atraso || atraso.carregando;
                  return (
                    <tr
                      key={turma.id_turma}
                      className="clickable"
                      onClick={() =>
                        navigate(`/turmas/${turma.id_turma}`, {
                          state: { turma, from: location.pathname + location.search },
                        })
                      }
                    >
                      <td>{turma.codigo}</td>
                      <td>{turma.cursoDescricao}</td>
                      <td>{turma.instrutorNome}</td>
                      <td>
                        <span className={`badge status-${turma.status}`}>
                          {STATUS_TURMA[turma.status]}
                        </span>
                      </td>
                      <td className="col-date">{formatDateBR(turma.data_inicio)}</td>
                      <td className="col-date">{formatDateBR(turma.data_fim)}</td>
                      <td className="col-date">
                        {carregandoAtraso ? '...' : formatDateBR(atraso.dataUltimoLancamento)}
                      </td>
                      <td className="col-num">
                        {carregandoAtraso ? '...' : atraso.erro ? '—' : atraso.diasAtraso ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )
      ) : null}
    </div>
  );
}
