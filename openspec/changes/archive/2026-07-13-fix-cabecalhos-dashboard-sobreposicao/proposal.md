## Why

Reportado pelo responsável: o cabeçalho "Alunos Matriculados" está se sobrepondo visualmente ao cabeçalho "Alunos ativos" (as palavras "MATRICULADOS" e "ATIVOS" aparecem coladas, sem espaço, na segunda linha de cada cabeçalho). Causa raiz confirmada: `.table-turmas th` tem `max-width: 100px`, insuficiente para a palavra "MATRICULADOS" (12 caracteres, sem espaço interno) quebrar de forma legível — o texto vaza visualmente para a célula vizinha, já que células de tabela não recortam conteúdo por padrão.

## What Changes

- **`max-width` dos cabeçalhos do Dashboard aumentado de `100px` para `150px`**: testado interativamente (CSS temporário no navegador, revertido antes desta proposta) contra a tabela real — resolve a sobreposição em "Alunos Matriculados"/"Alunos ativos" sem prejudicar nenhuma outra coluna (as mais curtas, como "Início"/"Término", continuam compactas; `max-width` só define um teto, não uma largura mínima).
- **`overflow-wrap: break-word` adicionado como salvaguarda**: para o caso de um rótulo futuro ainda mais longo que não caiba nem quebrando em espaços, o texto passa a poder quebrar dentro de uma palavra em vez de continuar vazando para a coluna vizinha (testado: não interfere nos rótulos atuais, que cabem confortavelmente em 150px sem precisar quebrar no meio de uma palavra).

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: ajuste do requisito de quebra de cabeçalho para garantir que a quebra nunca resulte em sobreposição visual entre colunas adjacentes.

## Impact

- **Frontend alterado**: `frontend/src/index.css` (`.table-turmas th`).
- **Sem mudança de HTML/JS**, sem mudança de dados, sem impacto em ordenação/filtros.
- **Escopo**: só a tabela de turmas do Dashboard (`.table-turmas`), mesma classe de escopo já usada para não afetar a tabela de alunos do drill-down.
