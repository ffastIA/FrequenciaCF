## Why

Hoje o filtro "Código da turma" é um campo de texto livre, onde o usuário precisa saber e digitar o código exato de uma ou mais turmas (separadas por `;`). O pedido é substituir por um dropdown — igual a Projeto/Aditivo — que já mostra apenas os códigos das turmas que atendem aos demais filtros já selecionados (Projeto, Aditivo, Meta, Instrutor, Situação), em ordem alfabética crescente, evitando digitação e erro de digitação.

## What Changes

- **Campo de texto → `<select>`**: o filtro de código passa a ser um dropdown, no mesmo estilo visual de Projeto/Aditivo/Instrutor/Situação, na mesma posição atual (barra de filtros adicionais, após Situação).
- **Seleção única, não múltipla**: decisão confirmada com o responsável — o dropdown se comporta exatamente como Projeto/Aditivo (um valor por vez), substituindo a capacidade atual de filtrar vários códigos simultaneamente com `;`.
- **Opções = turmas já carregadas, sem chamada de API nova**: como a tabela já busca as turmas que atendem a Projeto/Aditivo/Meta/Instrutor/Situação (`GET /api/filtros/turmas`, sem o código), essa mesma lista já é exatamente o universo de códigos válidos para o dropdown — basta extrair, deduplicar e ordenar os códigos dela.
- **Ordem alfabética crescente**, com uma opção vazia ("Todos") para não filtrar por código.
- **Seleção "órfã" é limpa automaticamente**: se o código selecionado deixar de existir na lista atual (porque Instrutor, Situação, Meta, Aditivo ou Projeto mudaram), a seleção é removida da URL — evitando um filtro inválido/travado, mesmo comportamento implícito já existente para Aditivo/Meta quando o Projeto muda.
- **Parâmetro de URL renomeado**: `codigos` (plural, string com `;`) vira `codigo` (singular, um valor), refletindo a nova seleção única.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: o filtro de código de turma passa de campo de texto livre para dropdown de seleção única, com opções derivadas do escopo já filtrado.

## Impact

- **Frontend alterado**: `frontend/src/pages/Dashboard.jsx` (troca do `<input>` por `<select>`, novo cálculo de opções a partir de `turmas`, lógica de limpeza de seleção órfã, renomeação do parâmetro de URL).
- **Sem mudança de backend, sem endpoint novo, sem chamada de API adicional** — a mesma resposta já buscada para popular a tabela também popula o dropdown.
- **Sem mudança de CSS**: o `<select>` reaproveita o mesmo estilo já aplicado a todos os outros filtros (`filter-field select`).
- **Compatibilidade**: link antigo com `?codigos=X` deixa de filtrar (parâmetro renomeado) — aceitável, é um ajuste de UX interno, sem preocupação de compatibilidade externa.
