## Context

O Dashboard (`frontend/src/pages/Dashboard.jsx`) já mantém, em memória do componente, `totalAlunosAtivos` de cada turma (vindo de `GET /api/filtros/turmas`) e um mapa `vagas` por `id_turma` (buscado uma vez via `useVagas()`, capability `vagas-turma`). Ambos os dados já estão disponíveis no componente antes de renderizar a tabela — não é necessária nenhuma chamada de API adicional para calcular o percentual de ocupação.

A tabela segue o mesmo padrão em três listas paralelas já usado pelas colunas anteriores (`vagas`, `alunosMatriculados`): o array `colunas` (cabeçalho + extrator para ordenação), o `<tbody>` com `<td>`s manuais na mesma ordem, e `colunasExportacao` (mesmo rótulo e valor formatado da exportação Excel).

## Goals / Non-Goals

**Goals:**
- Exibir o percentual de ocupação (`alunos ativos / vagas × 100`) de cada turma, calculado no cliente.
- Tratar `vagas = 0` (default, ainda não definido pelo usuário) como "sem dado" (`"—"`), não como `0%` nem `Infinity%`/`NaN%`.
- Permitir valores acima de `100%` sem limite artificial.

**Non-Goals:**
- Nenhuma mudança de API/backend — o cálculo não depende de nenhum dado que já não esteja carregado.
- Nenhuma mudança em como vagas são definidas/persistidas (isso já existe, capability `vagas-turma`).

## Decisions

**Cálculo 100% client-side, sem novo endpoint.** `totalAlunosAtivos` e `vagas[idTurma]` já estão no componente; adicionar um endpoint de backend só para expor um cálculo derivado de dados já disponíveis no cliente seria uma abstração desnecessária.

**Arredondamento: `Number(((ativos / vagas) * 100).toFixed(2))`.** Mesmo padrão já usado no backend para `percentualFaltas` (`MetricasFrequenciaService.js`), mantendo consistência de precisão (2 casas decimais) entre os dois indicadores percentuais do sistema, mesmo este sendo calculado no frontend.

**`vagas === 0` → valor `null`, exibido como `"—"`.** Mesma convenção já usada em toda a aplicação para "dado ausente/não aplicável" (datas nulas, `percentualFaltas` nulo, atraso nulo). Evita divisão por zero (`Infinity`/`NaN`) sem introduzir um terceiro estado visual novo.

**Sem teto em 100%.** Turma com mais alunos ativos do que vagas cadastradas (comum quando o valor de vagas ainda não foi atualizado) mostra o percentual real (ex.: `120%`), permitindo identificar visualmente essa inconsistência em vez de escondê-la atrás de um "100%+".

**Coluna aplica-se a todas as turmas da tabela, sem filtrar por situação.** A ausência de vagas definidas (→ `"—"`) já cobre naturalmente turmas concluídas/canceladas que tipicamente não têm vagas preenchidas; não há necessidade de uma regra explícita de "só calcula para Iniciada", o que manteria a coluna consistente com as demais (que também não têm lógica condicional por status).

**Posição e integração:** novo item em `colunas` entre `alunosAtivos` e `inicio`; novo `<td className="col-num">` na mesma posição no `<tbody>`; novo item em `colunasExportacao` na mesma posição, usando o valor já formatado (`"X%"` ou `"—"`). Participa da ordenação existente por valor bruto (número ou `null`), sem lógica adicional — mesmo mecanismo já usado por `diasAtraso`/`ultimoLancamento`/`vagas`.

## Risks / Trade-offs

- **[Trade-off] Percentual reflete o valor de vagas no momento do carregamento da página, não em tempo real durante a edição de outra aba/sessão.** Aceitável: mesma característica já existente para `vagas` e para os demais dados da tabela (sem WebSocket/polling neste projeto).
- **[Risco] Arredondamento de 2 casas decimais pode exibir percentuais como `133.33%`, mais "ruidoso" visualmente do que um inteiro.** Mitigação: manter consistência com `percentualFaltas` (já usa 2 casas) é mais importante do que otimizar a leitura visual deste campo específico; ajuste de casas decimais é uma mudança trivial e isolada caso o usuário prefira menos precisão depois.

## Migration Plan

Nenhuma. Mudança é puramente aditiva na UI, sem alteração de dados persistidos, endpoints ou schema.

## Open Questions

Nenhuma pendente — tratamento de vagas=0, escopo da coluna (todas as turmas) e ausência de teto em 100% já foram validados com o usuário durante o planejamento desta change.
