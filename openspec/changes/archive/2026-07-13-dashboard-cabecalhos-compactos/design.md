## Context

`Dashboard.jsx` renderiza os cabeçalhos da tabela de turmas a partir do array `colunas` (`{ chave, rotulo, tipo, classe, valor }`), já usado para ordenação por coluna. `frontend/src/index.css` tem `.data-table th { white-space: nowrap; ... }`, e a classe compartilhada `.col-date, .col-num { white-space: nowrap; }` é aplicada tanto ao `<th>` quanto ao `<td>` das colunas de data/número (mesma classe, dois elementos). Isso significa que simplesmente remover `nowrap` do `th` genérico não basta — a regra mais específica `.col-date`/`.col-num` ainda forçaria `nowrap` nos cabeçalhos "Início", "Término", "Último Lançamento" e "Dias em Atraso" (que usam essas classes).

## Goals / Non-Goals

**Goals:**
- Cabeçalhos longos quebram em 2+ linhas, deixando a largura da coluna guiada pelo dado.
- Rótulos "Último Lançamento" e "Dias em Atraso" atualizados.
- Nenhuma célula de dado (`<td>`) muda de comportamento — datas e números continuam numa linha só.
- Ordenação e filtros continuam funcionando exatamente como antes (nenhuma mudança de `chave`, só de `rotulo` e CSS).

**Non-Goals:**
- Mudar a ordem das colunas (já confirmada como correta).
- Aplicar a mesma mudança de quebra de cabeçalho na tabela de alunos do drill-down (`TurmaDetalhe.jsx`) — fora do pedido, pode ser proposto depois se desejado.

## Decisions

1. **Diferenciar `th` e `td` dentro de `.col-date`/`.col-num`**: em vez de remover `nowrap` da regra compartilhada (o que afetaria também as células de dado), a regra passa a ter dois níveis: `.col-date, .col-num { text-align: center; }` (sem `nowrap`) e uma regra mais específica `.data-table td.col-date, .data-table td.col-num { white-space: nowrap; }` restrita às células de dado. Isso preserva o comportamento atual das linhas da tabela e só libera a quebra nos cabeçalhos.

2. **`max-width` nos cabeçalhos, não só `white-space: normal`**: com `table-layout: auto` (padrão, sem mudança), o navegador só quebra o texto do cabeçalho quando a largura disponível já está sendo espremida por outra coisa — com bastante espaço livre na tabela, "Último Lançamento" tenderia a continuar numa linha só mesmo com `white-space: normal`. Um `max-width` (ex.: `100px`) no `<th>` força a quebra de forma confiável, sem nunca deixar a coluna **mais estreita** que o necessário para os dados (o `max-width` só limita a contribuição do próprio cabeçalho ao cálculo de largura da coluna; a largura final da coluna continua determinada pelo maior entre cabeçalho e dado).

3. **Rótulos exatos conforme pedido**: "Último Lançamento" (L maiúsculo em Lançamento) e "Dias em Atraso" (troca "de" → "em", Título Case). Nota: o CSS já aplica `text-transform: uppercase` nos cabeçalhos, então a diferença de capitalização não é visível no resultado renderizado — mas o texto-fonte (`rotulo` no array `colunas`) é atualizado mesmo assim, por clareza semântica e caso o estilo de uppercase mude no futuro.

## Risks / Trade-offs

- [`max-width` fixo pode não ser ideal em todas as resoluções de tela] → Valor conservador (~100px), testado visualmente; fácil de ajustar depois se necessário.
- [Diferença de capitalização dos rótulos não é visível hoje, por causa do `uppercase` do CSS] → Aceito — o pedido é sobre o texto-fonte, não necessariamente sobre o resultado visual renderizado.

## Migration Plan

Mudança pontual de frontend (rótulos + CSS), sem dependências, sem impacto em dados ou backend. Rollback: reverter os dois arquivos.

## Open Questions

Nenhuma — ordem de colunas confirmada com o responsável (mantém "Alunos ativos" após "Situação").
