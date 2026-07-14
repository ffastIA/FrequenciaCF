## Why

Hoje o Dashboard mostra "Dias em Atraso" turma a turma, dentro da tabela geral — não existe uma visão dedicada que responda rapidamente "quantas turmas estão em atraso agora, qual o atraso médio, e quais são elas". Um coordenador precisa varrer a tabela inteira e comparar valores manualmente para ter esse panorama. Um painel de drill-down dedicado, com os agregados (total e média) e uma lista só das turmas realmente atrasadas, torna esse diagnóstico imediato.

## What Changes

- Novo painel (modal) "Lançamentos atrasados", acionado a partir do Dashboard, exibindo:
  - Total de turmas em atraso e média de dias de atraso entre elas
  - Busca por turma (código/nome) e exportação da lista para Excel (`.xlsx`), reaproveitando o utilitário de exportação da change `frontend-exportacao-excel`
  - Tabela paginada com turma, projeto, instrutor, dias de atraso e último lançamento, cada linha navegando para o detalhe da turma já existente (`/turmas/:idTurma`)
- Nova definição de "turma em atraso": `diasAtraso > 7` (prazo ideal documentado no painel). Turmas com `diasAtraso: null` (sem nenhuma aula passada) NÃO entram nessa contagem.
- Novo endpoint agregado no backend (`metricas-frequencia`) que calcula, para o escopo de turmas informado, o total de turmas em atraso, a média de dias de atraso entre elas, e a lista completa dessas turmas — numa única chamada, em vez de uma chamada por turma.
- Novo ponto de entrada no Dashboard (`frontend-dashboard`) para abrir o painel a partir da tela atual.

## Capabilities

### New Capabilities
- `painel-turmas-atrasadas`: modal de drill-down com os agregados (total/média) e a tabela paginada/buscável de turmas em atraso, navegando para o detalhe de cada turma.

### Modified Capabilities
- `metricas-frequencia`: novo endpoint agregado que retorna, para um conjunto de turmas, o total em atraso, a média de dias de atraso e a lista dessas turmas — introduz também a definição de limiar ("em atraso" = `diasAtraso > 7`), que hoje não existe na capability.
- `frontend-dashboard`: adiciona um ponto de entrada (ex.: indicador/botão) na tela do Dashboard para abrir o painel `painel-turmas-atrasadas`.

## Impact

- **Backend**: novo método em `backend/services/MetricasFrequenciaService.js` e nova rota em `backend/routes/api/metricas.js` (ou arquivo correspondente), documentados em `backend/API.md` e `backend/tests.http`. Continua somente leitura (`SELECT`).
- **Frontend**: novo componente de modal/painel em `frontend/src/pages/` (ou `components/`), consumindo o novo endpoint; pequena alteração em `Dashboard.jsx` para o ponto de entrada; exportação reaproveita `frontend/src/utils/exportarExcel.js` (introduzido pela change `frontend-exportacao-excel`), sem duplicar lógica de geração de arquivo.
- **Pré-requisito de ordem**: `frontend-exportacao-excel` deve ser aplicada antes desta change (ou junto), já que o painel depende do utilitário `exportarExcel.js` que ela introduz.
- **Sem mudança de schema**; banco continua somente leitura.
