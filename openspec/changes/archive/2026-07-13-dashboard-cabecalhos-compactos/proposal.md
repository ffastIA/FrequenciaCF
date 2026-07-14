## Why

Alguns cabeçalhos da tabela de turmas do Dashboard ("Último lançamento", "Dias de atraso") são longos e, como o CSS atual força `white-space: nowrap` nos cabeçalhos, empurram a largura das colunas além do necessário para o próprio dado exibido (datas curtas, números). O pedido é revisar os rótulos e permitir que os títulos longos quebrem em 2+ linhas, para que a largura da coluna seja guiada pelo conteúdo (dado), não pelo texto do cabeçalho.

## What Changes

- **Confirmação da ordem de colunas**: a sequência já implementada (Código, Curso, Instrutor, Situação, Alunos ativos, Início, Término, Último Lançamento, Dias em Atraso) já corresponde à sequência pedida — decisão confirmada com o responsável: "Alunos ativos" permanece logo após "Situação", sem reordenação de fato.
- **Renomeação de dois rótulos**: "Último lançamento" → "Último Lançamento"; "Dias de atraso" → "Dias em Atraso".
- **Cabeçalhos longos quebram em 2+ linhas**: o CSS dos cabeçalhos da tabela deixa de forçar `white-space: nowrap`, permitindo que "Alunos ativos", "Último Lançamento" e "Dias em Atraso" (e qualquer outro rótulo futuro mais longo) quebrem em várias linhas, com a largura da coluna determinada pelo dado (data/número), não pelo texto do cabeçalho.
- **Colunas de dado continuam sem quebra**: `.col-date`/`.col-num` mantêm `white-space: nowrap` nas células de dado (`<td>`), já que datas e números devem continuar numa linha só — só o cabeçalho (`<th>`) passa a poder quebrar.
- Aplica-se à tabela de turmas do Dashboard (não à tabela de alunos do drill-down, fora de escopo deste pedido).

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: rótulos de duas colunas da tabela de turmas e comportamento de quebra de linha dos cabeçalhos.

## Impact

- **Frontend alterado**: `frontend/src/pages/Dashboard.jsx` (rótulos no array `colunas`), `frontend/src/index.css` (cabeçalhos passam a poder quebrar linha; células de dado continuam sem quebra).
- **Sem mudança de backend**, sem mudança de dados, sem impacto em ordenação/filtros (a chave de cada coluna no array `colunas` não muda, só o texto exibido).
