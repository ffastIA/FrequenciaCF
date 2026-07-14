## 1. Backend: endpoint agregado de turmas atrasadas

- [x] 1.1 Adicionar `PRAZO_DIAS = 7` (constante) e `getTurmasAtrasadas(idProjeto, idProjetoAditivo, filtros)` em `backend/services/MetricasFrequenciaService.js`: resolve as turmas do escopo via `TurmaModel.getTurmasPorProjetoAditivo`, calcula `diasAtraso` de cada uma em paralelo reutilizando `getAtrasoLancamentoPorTurma`, filtra `diasAtraso > PRAZO_DIAS`, e monta `{ total, mediaDiasAtraso, turmas }`
- [x] 1.2 `mediaDiasAtraso` SHALL ser `null` quando `total = 0` (evitar divisão por zero), e arredondado para inteiro quando houver turmas
- [x] 1.3 Cada item de `turmas` SHALL incluir `idTurma`, código, nome, `cursoDescricao`, `instrutorNome`, `diasAtraso`, `dataUltimoLancamento` — **desvio deliberado**: a tabela `turma` não tem uma coluna própria de "nome" (só `codigo`); o campo foi omitido e `codigo` + `cursoDescricao` cobrem a identificação da turma, mesmo padrão já usado no Dashboard/TurmaDetalhe
- [x] 1.4 Adicionar rota `GET /atraso-lancamento/turmas-atrasadas` em `backend/routes/api/metricas.js`, com validação Joi: `idProjeto`/`idProjetoAditivo` obrigatórios (number), `idMeta`/`idInstrutor`/`status` opcionais — mesmo padrão de validação já usado nas rotas de filtros/turmas
- [x] 1.5 Confirmar que a rota é somente leitura (`GET`, sem escrita), consistente com o guard de `backend/config/database.js`
- [x] 1.6 Documentar o novo endpoint em `backend/API.md` (request/response de exemplo, seguindo o padrão dos endpoints de atraso já documentados)
- [x] 1.7 Adicionar exemplo de chamada em `backend/tests.http`

## 2. Frontend: cliente da API e componente do painel

- [x] 2.1 Adicionar `getTurmasAtrasadas(params)` em `frontend/src/api/metricas.js`, chamando o novo endpoint
- [x] 2.2 Criar componente de modal `PainelLancamentosAtrasados` (ex.: `frontend/src/components/PainelLancamentosAtrasados.jsx`) com: cabeçalho (título, texto de critério, botão fechar), cartões de total/média, campo de busca, botão de exportar, tabela e paginação
- [x] 2.3 Implementar busca client-side (filtro por código/nome, case-insensitive) sobre a lista carregada — busca por `codigo` ou `cursoDescricao` (ver desvio da tarefa 1.3)
- [x] 2.4 Implementar paginação client-side (tamanho de página fixo) com "Mostrando X a Y de Z turmas" e navegação numérica
- [x] 2.5 Implementar exportação Excel client-side a partir da lista filtrada pela busca ativa, reaproveitando `exportarParaExcel` de `frontend/src/utils/exportarExcel.js` (introduzido pela change `frontend-exportacao-excel`)
- [x] 2.6 Cada linha da tabela navega para `/turmas/:idTurma`, reaproveitando a navegação já usada na tabela do Dashboard
- [x] 2.7 Ordenar a lista por `diasAtraso` decrescente por padrão

## 3. Frontend: ponto de entrada no Dashboard

- [x] 3.1 Em `frontend/src/pages/Dashboard.jsx`, adicionar estado de abertura do painel e um indicador/botão visível somente quando Projeto e Aditivo estiverem selecionados
- [x] 3.2 Ao abrir o painel, repassar os filtros correntes da URL (Projeto, Aditivo, Meta, Instrutor, Situação) como parâmetros da chamada ao novo endpoint
- [x] 3.3 Fechar o painel restaura o Dashboard sem alterar os filtros/URL atuais

## 4. Verificação

- [x] 4.1 Testar o endpoint novo via `tests.http`/curl com escopo real (Projeto/Aditivo com turmas atrasadas conhecidas) e conferir `total`/`mediaDiasAtraso`/`turmas` — testado com `idProjeto=18&idProjetoAditivo=3` (total=8, mediaDiasAtraso=544) e escopo vazio `idProjeto=4&idProjetoAditivo=1` (total=0, mediaDiasAtraso=null); erro 400 confirmado sem `idProjetoAditivo`
- [x] 4.2 Rodar o frontend e abrir o painel a partir do Dashboard: conferir indicadores, busca, paginação, exportação e navegação para o detalhe da turma — verificado no navegador: indicadores corretos, busca "JG2" filtrou para 1/8 sem nova chamada de API, "Mostrando 1 a 8 de 8 turmas" sem controles de página (só 8 itens), exportação gerou `turmas-atrasadas-2026-07-13.xlsx` válido, clique na linha navegou para `/turmas/:idTurma` e "Voltar ao dashboard" preservou os filtros da URL
- [x] 4.3 Conferir estado vazio (escopo sem nenhuma turma em atraso) e estado sem Projeto/Aditivo selecionado (indicador ausente) — confirmado: total 0, média "—", mensagem de lista vazia, sem botão de exportar; botão "Lançamentos atrasados" ausente sem Projeto/Aditivo selecionados
