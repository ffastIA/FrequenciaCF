## Context

Hoje não existe conceito de "turma em atraso" (um limiar) em nenhuma camada — só o valor bruto `diasAtraso` por turma, calculado em `MetricasFrequenciaService.getAtrasoLancamentoPorTurma(idTurma)` e exposto por `GET /api/metricas/atraso-lancamento/turma?idTurma=X`. O Dashboard (`frontend/src/pages/Dashboard.jsx`) já busca **todas** as turmas do escopo filtrado (Projeto/Aditivo obrigatórios; Meta/Instrutor/Situação/Código opcionais) via `GET /api/filtros/turmas`, sem paginação server-side, e calcula `diasAtraso` de cada uma em paralelo via `useAtrasoPorTurmas` (uma chamada HTTP por turma). Não existe, em nenhuma tela, um conceito de "todas as turmas do sistema" sem esse escopo Projeto/Aditivo — `TurmaModel` não tem um método de listagem sem esses parâmetros.

A change `frontend-exportacao-excel` (proposta em paralelo) padroniza toda exportação do sistema em Excel (`.xlsx`), introduzindo `frontend/src/utils/exportarExcel.js` — uma função genérica `exportarParaExcel(nomeArquivo, colunas, linhas)` já usada pelo Dashboard e pelo detalhe da turma. A exportação do painel desta change SHALL reaproveitar esse mesmo utilitário, em vez de gerar CSV separadamente — mantendo um único mecanismo de exportação em todo o frontend.

## Goals / Non-Goals

**Goals:**
- Painel "Lançamentos atrasados" mostrando, para o escopo de turmas já filtrado no Dashboard (mesmos parâmetros de Projeto/Aditivo/Meta/Instrutor/Situação/Código): total de turmas com `diasAtraso > 7`, média de `diasAtraso` entre elas, e uma tabela buscável/paginada dessas turmas.
- Endpoint agregado no backend que centraliza a definição de "turma em atraso" (limiar de 7 dias), evitando duplicar essa regra no frontend.
- Reaproveitar a navegação já existente para `/turmas/:idTurma` a partir de cada linha.

**Non-Goals:**
- Limiar de dias configurável (nem pelo usuário na UI, nem por arquivo — fixo em 7 dias nesta versão; configuração via arquivo JSON é evolução futura, ver Decision 2).
- Paginação/busca no backend — dado que o escopo já é sempre restrito a Projeto/Aditivo (não é a base de turmas inteira do sistema), a lista retornada tende a ser pequena; paginação e busca ficam no cliente, mesmo padrão já usado no filtro de código do Dashboard.
- Abrir o painel sem um Projeto/Aditivo já selecionado — a mesma restrição que já existe para a tabela principal do Dashboard se aplica aqui.
- Exportação via backend — o arquivo Excel é gerado no cliente a partir da lista já carregada, via `exportarExcel.js`.

## Decisions

1. **Novo endpoint agregado, calculado a partir dos métodos por-turma já existentes** — `GET /api/metricas/atraso-lancamento/turmas-atrasadas`, aceitando os mesmos filtros de `GET /api/filtros/turmas` (`idProjeto`, `idProjetoAditivo` obrigatórios; `idMeta`, `idInstrutor`, `status` opcionais). Implementação: reutiliza `TurmaModel.getTurmasPorProjetoAditivo` para resolver o conjunto de turmas do escopo, depois chama `getAtrasoLancamentoPorTurma(idTurma)` para cada uma em paralelo (`Promise.all`, mesmo padrão N-chamadas que o frontend já faz hoje — só que agora dentro de um único request HTTP), filtra `diasAtraso > 7` (excluindo `null`) e calcula total/média sobre o resultado filtrado.
   - **Alternativa considerada e descartada**: derivar os agregados inteiramente no cliente, a partir do estado que o Dashboard já tem (`turmas` + `atrasos` de `useAtrasoPorTurmas`), sem endpoint novo — tecnicamente possível, já que o Dashboard já carrega o escopo inteiro sem paginação. Descartada porque duplicaria a definição de "em atraso" (limiar de 7 dias) no frontend, e acoplaria o painel ao estado interno do Dashboard (não funcionaria se o painel precisar ser aberto de outro contexto no futuro). Trade-off aceito: o painel refaz as mesmas N chamadas por-turma que o Dashboard já fez para popular sua própria tabela — dado que o escopo (Projeto/Aditivo) já limita isso a um número pequeno de turmas, o custo adicional é aceitável.
   - **Alternativa considerada e descartada**: nova query SQL agregada (`JOIN`/subqueries calculando `diasAtraso` diretamente em SQL para todas as turmas de uma vez). Rejeitada por replicar em SQL uma lógica condicional já não-trivial (fallback de aula mais antiga, exceção de turma concluída, piso em zero) que hoje vive em JS — risco de divergência entre o valor por turma (`/atraso-lancamento/turma`) e o valor agregado, para o mesmo `idTurma`.

2. **Limiar fixo de 7 dias nesta versão, como constante no backend** (`MetricasFrequenciaService`, não em query param) — corresponde ao texto "prazo ideal de até 7 dias" do painel de referência. Turmas com `diasAtraso: null` (sem nenhuma aula passada) SHALL NOT contar como atrasadas.
   - Alternativa descartada agora: expor `limiarDias` como query param opcional — adiciona flexibilidade não pedida nesta etapa (YAGNI).
   - **Evolução futura já decidida (fora do escopo desta change)**: o limiar deixará de ser uma constante em código e passará a vir de um **arquivo de persistência JSON** (configuração lida pelo backend, não input do usuário via UI/query param) — permitindo ajustar o prazo sem alterar código nem fazer novo deploy. Isso é intencionalmente adiado: implementar agora seria prematuro sem um segundo caso de uso validando o formato do arquivo de configuração. Quando essa evolução for proposta, o valor do limiar usado por este endpoint (e por qualquer outro que venha a depender do mesmo conceito) deve passar a ler desse arquivo, mantendo um fallback para `7` caso o arquivo esteja ausente.

3. **Paginação e busca client-side**, reaproveitando o padrão já usado no filtro de código de turma do Dashboard (comparação sem chamada de API adicional). A resposta do endpoint traz a lista completa das turmas atrasadas do escopo; o componente do painel pagina/filtra localmente.

4. **Exportação em Excel (`.xlsx`) gerada no cliente**, reaproveitando `frontend/src/utils/exportarExcel.js` (função `exportarParaExcel`, introduzida pela change `frontend-exportacao-excel`) a partir da lista já carregada pelo painel — sem novo endpoint de exportação, mantendo o backend somente leitura e sem responsabilidade de formatação de arquivo, e sem duplicar lógica de geração de planilha já existente no restante do sistema.

5. **Ponto de entrada no Dashboard**: um indicador/card (mostrando a contagem já calculada por essa mesma chamada) que abre o painel como modal sobre a tela atual, reutilizando os filtros correntes da URL do Dashboard como parâmetros do endpoint — sem estado de filtro próprio dentro do painel.

## Risks / Trade-offs

- [Painel refaz N chamadas por-turma já feitas pelo Dashboard para sua própria tabela] → Aceitável dado o escopo pequeno (Projeto/Aditivo); mesmo padrão de custo já validado nas telas existentes.
- [Definição de "em atraso" fixa em 7 dias, sem configuração] → Decisão consciente (YAGNI); revisitar via nova change se o usuário pedir limiar configurável.
- [Endpoint novo depende de `TurmaModel.getTurmasPorProjetoAditivo`, que exige `idProjeto`+`idProjetoAditivo`] → Painel só pode ser aberto com esses filtros já selecionados no Dashboard, igual à tabela principal; não há caso de uso de "turmas atrasadas em todo o sistema" hoje.

## Migration Plan

Mudança aditiva: novo endpoint, novo componente de frontend, pequena alteração no Dashboard para o ponto de entrada. Sem migração de dados, sem mudança de contrato de endpoints existentes. Rollback: remover a rota nova e o ponto de entrada no Dashboard.

## Open Questions

Nenhuma.
