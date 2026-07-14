## Context

`frontend/src/index.css` tem `.table-turmas th { white-space: normal; max-width: 100px; line-height: 1.3; }`, adicionado na change `dashboard-cabecalhos-compactos` para permitir que cabeçalhos longos quebrem em 2+ linhas. Naquele momento, o rótulo mais longo era "Último Lançamento" (2 palavras, ambas curtas o suficiente para caber em 100px). A change seguinte (`dashboard-coluna-alunos-matriculados`) introduziu "Alunos Matriculados", cuja segunda palavra ("MATRICULADOS", em maiúsculas por causa do `text-transform: uppercase` do cabeçalho) é mais larga que 100px e não tem espaço interno para quebrar — o texto continua sendo renderizado na largura real da palavra (fora do `max-width` da célula, já que `max-width` numa célula de tabela com `table-layout: auto` limita a contribuição ao cálculo de largura da coluna, mas não recorta/força o conteúdo a caber), sobrepondo visualmente a célula vizinha à direita ("Alunos ativos").

## Goals / Non-Goals

**Goals:**
- Eliminar a sobreposição visual entre "Alunos Matriculados" e "Alunos ativos".
- Garantir que nenhuma combinação futura de rótulo longo produza o mesmo problema (não só um ajuste pontual para essas duas colunas).
- Não alterar a largura das colunas mais curtas (Início, Término, etc.), que devem continuar compactas.

**Non-Goals:**
- Reduzir o tamanho da fonte dos cabeçalhos para "forçar" o texto a caber — muda a identidade visual da tabela por um problema que tem solução mais direta (ajustar a largura/quebra).
- Abreviar os rótulos (ex.: "Alunos Matric.") — não solicitado; o valor completo já foi definido explicitamente pelo responsável em change anterior.

## Decisions

1. **Aumentar `max-width` de `100px` para `150px`**: testado interativamente contra a tabela real via CSS injetado no navegador (não persistido até esta proposta) — 100px quebrava "MATRICULADOS" no meio (cortando a última letra) mesmo com `overflow-wrap`; 150px acomoda a palavra inteira numa linha, resultando em "ALUNOS" / "MATRICULADOS" e "ALUNOS" / "ATIVOS" bem formatados, sem sobreposição. Colunas mais curtas (Início, Término) não ficam mais largas por causa disso — `max-width` é um teto, não uma largura forçada; a largura real da coluna continua determinada pelo conteúdo mais largo entre cabeçalho e dados daquela coluna.

2. **`overflow-wrap: break-word` como rede de segurança, não como solução principal**: testado isoladamente com `word-break: break-word` (mais agressivo) e o resultado quebrou até palavras curtas como "ALUNOS" desnecessariamente — descartado. `overflow-wrap: break-word` sozinho só quebra dentro de uma palavra quando ela realmente não cabe no espaço disponível (com o `max-width: 150px` já resolvendo os rótulos atuais, essa quebra não chega a ser acionada hoje) — funciona como proteção para um rótulo futuro ainda mais longo, sem afetar o comportamento atual.

3. **Escopo mantido em `.table-turmas`**: mesma classe já usada para isolar o Dashboard da tabela de alunos do drill-down (`TurmaDetalhe.jsx`), que não é afetada por esta correção.

## Risks / Trade-offs

- [`max-width: 150px` um pouco mais largo pode deixar a tabela como um todo um pouco mais larga em telas pequenas] → Aceitável: é um teto por coluna, e a maioria das colunas (Início, Término, Situação) continua bem mais estreita que 150px; o ganho de legibilidade (sem sobreposição) supera o custo.

## Migration Plan

Mudança de uma regra CSS, sem dependências, sem impacto em dados/backend. Deploy do frontend novo é suficiente. Rollback: reverter o valor de `max-width`.

## Open Questions

Nenhuma — correção testada interativamente contra a tabela real antes de ser formalizada.
