import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { getProjetos, getAditivos, getMetas, getTurmas, getInstrutores } from '../api/filtros';
import { useAtrasoPorTurmas } from '../hooks/useAtrasoPorTurmas';
import { useVagas } from '../hooks/useVagas';
import { STATUS_TURMA, STATUS_TURMA_OPTIONS } from '../constants';
import { formatDateBR, dataDeHojeParaArquivo } from '../utils/formatDate';
import { formatPercentual } from '../utils/formatPercentual';
import { compararValores } from '../utils/ordenacao';
import { exportarParaExcel } from '../utils/exportarExcel';
import PainelLancamentosAtrasados from '../components/PainelLancamentosAtrasados';

// Situação padrão do dashboard: "Iniciada" (status = 2), refletindo o foco em turmas
// em andamento. Na URL, ausência de `status` = padrão Iniciada; `status=todas` = Todas
// (escolha explícita, preservável); qualquer outro valor = aquela situação específica.
const STATUS_PADRAO = '2';
const STATUS_TODAS = 'todas';

// Converte uma data (string ISO vinda da API) em timestamp para ordenação
// cronológica; null quando ausente ou inválida (fica sempre por último).
function dataParaTimestamp(valor) {
  if (!valor) return null;
  const tempo = new Date(valor).getTime();
  return Number.isNaN(tempo) ? null : tempo;
}

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
  const codigo = searchParams.get('codigo') || '';

  const [projetos, setProjetos] = useState([]);
  const [aditivos, setAditivos] = useState([]);
  const [metas, setMetas] = useState([]);
  const [instrutoresDisponiveis, setInstrutoresDisponiveis] = useState([]);

  const [turmas, setTurmas] = useState([]);
  const [carregandoTurmas, setCarregandoTurmas] = useState(false);
  const [erro, setErro] = useState(null);
  const [ordenacao, setOrdenacao] = useState({ coluna: null, direcao: 'asc' });
  const [painelAtrasadasAberto, setPainelAtrasadasAberto] = useState(false);

  const atrasos = useAtrasoPorTurmas(turmas);
  const { vagas, vagasEmEdicao, handleVagasChange, handleVagasSalvar } = useVagas();

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
      .then((resultado) => {
        setTurmas(resultado);
        // Limpa o código selecionado se ele não existir mais no escopo recém-
        // buscado (checado aqui, com os dados que de fato chegaram, para não
        // remover a seleção prematuramente enquanto a busca ainda está em
        // andamento — ex.: refresh numa URL com "codigo" já preenchido).
        if (codigo && !resultado.some((t) => t.codigo === codigo)) {
          updateParams((p) => p.delete('codigo'));
        }
      })
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
      p.delete('codigo');
    });
  }

  function handleAditivoChange(value) {
    updateParams((p) => {
      value ? p.set('idProjetoAditivo', value) : p.delete('idProjetoAditivo');
      p.delete('idMeta');
      p.delete('idInstrutor');
      p.delete('status');
      p.delete('codigo');
    });
  }

  function handleMetaChange(value) {
    updateParams((p) => {
      value ? p.set('idMeta', value) : p.delete('idMeta');
      p.delete('idInstrutor');
      p.delete('status');
      p.delete('codigo');
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

  function handleCodigoChange(value) {
    updateParams((p) => {
      value ? p.set('codigo', value) : p.delete('codigo');
    });
  }

  // Dropdown de código: as opções já são exatamente as turmas buscadas (escopo
  // Projeto/Aditivo/Meta/Instrutor/Situação), sem chamada de API adicional.
  const codigosDisponiveis = [...new Set(turmas.map((t) => t.codigo))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'));

  // Filtro de código: aplicado no cliente sobre as turmas já carregadas, sem nova
  // requisição. Seleção única, comparação exata por código. (A limpeza de uma
  // seleção "órfã" — código que saiu do escopo — é feita no próprio efeito que
  // busca "turmas", assim que os dados novos chegam; ver useEffect acima.)
  const turmasFiltradas = codigo ? turmas.filter((t) => t.codigo === codigo) : turmas;

  // Colunas da tabela: cada uma expõe um extrator de valor BRUTO (não a string
  // formatada da célula) para a ordenação comparar corretamente número/data como
  // número e texto como texto. "Situação" ordena pela progressão do status (0-4),
  // não pelo texto traduzido. null = "sem dado ainda" (carregando ou inexistente).
  const colunas = [
    { chave: 'codigo', rotulo: 'Código', tipo: 'texto', classe: '', valor: (t) => t.codigo },
    { chave: 'curso', rotulo: 'Curso', tipo: 'texto', classe: '', valor: (t) => t.cursoDescricao },
    { chave: 'instrutor', rotulo: 'Instrutor', tipo: 'texto', classe: '', valor: (t) => t.instrutorNome },
    { chave: 'situacao', rotulo: 'Situação', tipo: 'numero', classe: '', valor: (t) => t.status },
    {
      chave: 'vagas',
      rotulo: 'Vagas',
      tipo: 'numero',
      classe: 'col-num',
      valor: (t) => vagas[t.id_turma] ?? 0,
    },
    {
      chave: 'alunosMatriculados',
      rotulo: 'Alunos Matriculados',
      tipo: 'numero',
      classe: 'col-num',
      valor: (t) => t.totalAlunosMatriculados,
    },
    {
      chave: 'alunosAtivos',
      rotulo: 'Alunos ativos',
      tipo: 'numero',
      classe: 'col-num',
      valor: (t) => t.totalAlunosAtivos,
    },
    {
      chave: 'percentualOcupacao',
      rotulo: '% Ocupação',
      tipo: 'numero',
      classe: 'col-num',
      valor: (t) => {
        const vagasTurma = vagas[t.id_turma] ?? 0;
        if (vagasTurma <= 0) return null;
        return Number(((t.totalAlunosAtivos / vagasTurma) * 100).toFixed(2));
      },
    },
    {
      chave: 'inicio',
      rotulo: 'Início',
      tipo: 'numero',
      classe: 'col-date',
      valor: (t) => dataParaTimestamp(t.data_inicio),
    },
    {
      chave: 'termino',
      rotulo: 'Término',
      tipo: 'numero',
      classe: 'col-date',
      valor: (t) => dataParaTimestamp(t.data_fim),
    },
    {
      chave: 'ultimoLancamento',
      rotulo: 'Último Lançamento',
      tipo: 'numero',
      classe: 'col-date',
      valor: (t) => {
        const atraso = atrasos[t.id_turma];
        if (!atraso || atraso.carregando || atraso.erro) return null;
        return dataParaTimestamp(atraso.dataUltimoLancamento);
      },
    },
    {
      chave: 'diasAtraso',
      rotulo: 'Dias em Atraso',
      tipo: 'numero',
      classe: 'col-num',
      valor: (t) => {
        const atraso = atrasos[t.id_turma];
        if (!atraso || atraso.carregando || atraso.erro) return null;
        return atraso.diasAtraso ?? null;
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
  const turmasOrdenadas = colunaOrdenada
    ? [...turmasFiltradas].sort((a, b) =>
        compararValores(colunaOrdenada.valor(a), colunaOrdenada.valor(b), colunaOrdenada.tipo, ordenacao.direcao)
      )
    : turmasFiltradas;

  // Colunas de exportação: mesmo rótulo e mesmo valor FORMATADO exibido na
  // célula (não o extrator bruto de `colunas`, que serve à ordenação).
  const colunasExportacao = [
    { rotulo: 'Código', valor: (t) => t.codigo },
    { rotulo: 'Curso', valor: (t) => t.cursoDescricao },
    { rotulo: 'Instrutor', valor: (t) => t.instrutorNome },
    { rotulo: 'Situação', valor: (t) => STATUS_TURMA[t.status] },
    { rotulo: 'Vagas', valor: (t) => vagas[t.id_turma] ?? 0 },
    { rotulo: 'Alunos Matriculados', valor: (t) => t.totalAlunosMatriculados },
    { rotulo: 'Alunos ativos', valor: (t) => t.totalAlunosAtivos },
    {
      rotulo: '% Ocupação',
      valor: (t) =>
        formatPercentual(
          vagas[t.id_turma] > 0
            ? Number(((t.totalAlunosAtivos / vagas[t.id_turma]) * 100).toFixed(2))
            : null
        ),
    },
    { rotulo: 'Início', valor: (t) => formatDateBR(t.data_inicio) },
    { rotulo: 'Término', valor: (t) => formatDateBR(t.data_fim) },
    {
      rotulo: 'Último Lançamento',
      valor: (t) => {
        const atraso = atrasos[t.id_turma];
        if (!atraso || atraso.carregando || atraso.erro) return '—';
        return formatDateBR(atraso.dataUltimoLancamento);
      },
    },
    {
      rotulo: 'Dias em Atraso',
      valor: (t) => {
        const atraso = atrasos[t.id_turma];
        if (!atraso || atraso.carregando || atraso.erro) return '—';
        return atraso.diasAtraso ?? '—';
      },
    },
  ];

  function handleExportar() {
    exportarParaExcel(`turmas-${dataDeHojeParaArquivo()}.xlsx`, colunasExportacao, turmasOrdenadas);
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

            <label className="filter-field">
              <span>Código da turma (opcional)</span>
              <select value={codigo} onChange={(e) => handleCodigoChange(e.target.value)}>
                <option value="">Todos</option>
                {codigosDisponiveis.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : null}

        {idProjeto && idProjetoAditivo ? (
          <div className="filter-bar filter-bar-secondary">
            <button type="button" className="btn-secondary" onClick={() => setPainelAtrasadasAberto(true)}>
              Lançamentos atrasados
            </button>
          </div>
        ) : null}
      </section>

      <PainelLancamentosAtrasados
        aberto={painelAtrasadasAberto}
        onFechar={() => setPainelAtrasadasAberto(false)}
        filtros={{ idProjeto, idProjetoAditivo, idMeta, idInstrutor, status }}
      />

      {idProjeto && idProjetoAditivo ? (
        carregandoTurmas ? (
          <p className="state-message">Carregando turmas...</p>
        ) : turmasOrdenadas.length === 0 ? (
          <p className="state-message">Nenhuma turma encontrada para os filtros selecionados.</p>
        ) : (
          <section className="card table-card">
            <div className="table-toolbar">
              <button type="button" className="btn-secondary" onClick={handleExportar}>
                Exportar para Excel
              </button>
            </div>
            <table className="data-table table-turmas">
              <thead>
                <tr>
                  {colunas.map((coluna) => (
                    <th
                      key={coluna.chave}
                      className={[coluna.classe, 'sortable'].filter(Boolean).join(' ')}
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
                {turmasOrdenadas.map((turma) => {
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
                      <td className="col-num" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="number"
                          min="0"
                          max="25"
                          step="1"
                          className="input-vagas"
                          value={vagasEmEdicao[turma.id_turma] ?? vagas[turma.id_turma] ?? 0}
                          onChange={(e) => handleVagasChange(turma.id_turma, e.target.value)}
                          onBlur={() => handleVagasSalvar(turma.id_turma)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') e.target.blur();
                          }}
                        />
                      </td>
                      <td className="col-num">{turma.totalAlunosMatriculados}</td>
                      <td className="col-num">{turma.totalAlunosAtivos}</td>
                      <td className="col-num">
                        {formatPercentual(
                          vagas[turma.id_turma] > 0
                            ? Number(((turma.totalAlunosAtivos / vagas[turma.id_turma]) * 100).toFixed(2))
                            : null
                        )}
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
