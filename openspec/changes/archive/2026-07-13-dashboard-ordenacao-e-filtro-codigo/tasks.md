## 1. Utilitário de ordenação compartilhado

- [x] 1.1 Criar `frontend/src/utils/ordenacao.js`, movendo `compararValores` (texto via `localeCompare` pt-BR; número via subtração; `null`/`undefined` sempre por último em ambas as direções) de `TurmaDetalhe.jsx` para lá
- [x] 1.2 Refatorar `TurmaDetalhe.jsx` para importar `compararValores` do novo utilitário, removendo a cópia local — sem mudar nenhum comportamento já validado

## 2. Ordenação por coluna no Dashboard

- [x] 2.1 Estado `{ coluna, direcao }` em `Dashboard.jsx` (colunas: código, curso, instrutor, situação, dataInicio, dataFim, ultimoLancamento, diasAtraso)
- [x] 2.2 Definir colunas com extrator de valor bruto por coluna: texto (código/curso/instrutor), número (`turma.status` para Situação, `atraso.diasAtraso`), timestamp (`data_inicio`/`data_fim`/`atraso.dataUltimoLancamento` via `new Date(...).getTime()`, `null` se ausente/carregando)
- [x] 2.3 Handler de clique no cabeçalho: mesma coluna inverte direção; coluna diferente troca para a nova, começando em `asc`
- [x] 2.4 Lista de turmas ordenada derivada a cada render (a partir de `turmas` + `atrasos`), para acompanhar os dados assíncronos de atraso conforme chegam
- [x] 2.5 Cabeçalhos clicáveis com indicador visual (reaproveitar classes `sortable`/`sort-indicator` já existentes no CSS)

## 3. Filtro por código de turma

- [x] 3.1 Novo campo de texto "Código da turma" na `filter-bar-secondary`, ao lado de Instrutor e Situação, abaixo da linha de Meta
- [x] 3.2 Novo parâmetro de URL (ex.: `codigos`) lido/escrito com o mesmo padrão dos demais filtros (`updateParams`)
- [x] 3.3 Lógica de filtro client-side: `split(';')`, `trim()` e `toUpperCase()` em cada item, comparado contra `turma.codigo.toUpperCase()`; aplicado sobre a lista de turmas antes da ordenação
- [x] 3.4 Resetar o filtro de código (junto com Instrutor/Situação) nos handlers de troca de Projeto/Aditivo/Meta
- [x] 3.5 Confirmar que o filtro de código NÃO entra na consulta de instrutores disponíveis (mesma regra já aplicada a Instrutor/Situação)

## 4. Testes manuais no navegador

- [x] 4.1 Ordenar por "Código": alfabético crescente/decrescente
- [x] 4.2 Ordenar por "Situação": segue a progressão 0-4, não a ordem alfabética do texto traduzido
- [x] 4.3 Ordenar por "Início"/"Término"/"Último lançamento": ordem cronológica correta; linhas com atraso ainda carregando ficam por último e se reposicionam ao carregar
- [x] 4.4 Ordenar por "Dias de atraso": numérico correto, turmas sem valor (`null`) sempre por último
- [x] 4.5 Trocar de coluna no meio de uma ordenação: nova coluna assume, indicador anterior some
- [x] 4.6 Filtrar por um único código: tabela mostra só a turma correspondente
- [x] 4.7 Filtrar por múltiplos códigos separados por `;` (com espaços/minúsculas): tabela mostra as turmas correspondentes
- [x] 4.8 Código sem correspondência: mensagem de "nenhuma turma encontrada", campo continua preenchido
- [x] 4.9 Trocar Projeto/Aditivo/Meta: campo de código é limpo junto com Instrutor/Situação
- [x] 4.10 Refresh numa URL com `codigos` preenchido: filtro é restaurado
- [x] 4.11 Confirmar que `TurmaDetalhe.jsx` continua funcionando exatamente igual após a refatoração do utilitário compartilhado (regressão)
- [x] 4.12 Sem erros no console; nenhuma requisição de rede nova disparada pelo filtro de código ou pela ordenação
