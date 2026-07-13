## Context

Hoje o Dashboard mantém os filtros em `useState` local. Ao navegar para `/turmas/:idTurma`, o React Router desmonta o Dashboard; ao voltar, ele remonta com estado inicial vazio — daí a perda dos filtros. O link "Voltar ao dashboard" aponta para `/` (raiz limpa), o que reforça a perda. Estado atual dos filtros: `idProjeto`, `idProjetoAditivo`, `idMeta` (cascata) + `idInstrutor`, `status` (adicionais). Mapeamento de situação: `STATUS_TURMA` → `2 = "Iniciada"`.

## Goals / Non-Goals

**Goals:**
- Voltar do drill-down restaura os filtros anteriores, inclusive por botão nativo de voltar, refresh e link compartilhado.
- Situação inicia em "Iniciada" (`status = 2`), refletindo o propósito de acompanhar turmas em andamento.
- Sem mudança de backend; banco somente leitura preservado.

**Non-Goals:**
- Persistir seleção entre sessões diferentes (fechou o navegador) além do que a URL naturalmente permite (favoritar/compartilhar).
- Tornar o valor padrão de Situação configurável pelo usuário.
- Paginação, autenticação, exportação — fora de escopo.

## Decisions

1. **URL como fonte de verdade dos filtros (`useSearchParams`)**: os cinco filtros passam a viver nos query params. O Dashboard lê os filtros da URL e, ao alterar um filtro, atualiza a URL; o efeito de busca de turmas reage à URL. Escolhido pelo responsável em vez de estado em memória: torna o dashboard compartilhável/favoritável e resistente a refresh, ao custo de recarregar os dados (~1s de atrasos) ao voltar — custo aceito.

2. **Voltar do drill-down**: ao clicar numa linha, além de `state: { turma }`, a navegação leva `state: { from }` com a URL de origem do dashboard (`pathname + search`). O link "Voltar ao dashboard" usa esse `from` (fallback `/` quando ausente, ex.: acesso direto ao detalhe). O botão nativo de voltar do navegador já funciona porque a entrada anterior do histórico é a URL do dashboard com os query params. Assim, tanto o link quanto o back nativo restauram os mesmos filtros.

3. **Padrão "Iniciada" com "Todas" explícito**: quando a URL não traz Situação, o Dashboard se comporta como "Iniciada" (`status = 2`) — é o padrão em carregamento novo e após reset (troca de Projeto/Aditivo). "Todas" é uma escolha explícita e SHALL ser representável e preservável na URL de forma distinta do padrão (ex.: um sentinela como `status=todas`), para que voltar/refresh não reintroduza "Iniciada" quando o usuário quis "Todas". A codificação exata do sentinela fica a critério da implementação, desde que o comportamento observável (padrão = Iniciada; "Todas" preservado) seja respeitado.

4. **Reset volta ao padrão, não a "Todas"**: como "Iniciada" passa a ser o padrão do filtro, trocar Projeto/Aditivo (que reseta os filtros dependentes) leva a Situação de volta a "Iniciada", mantendo o comportamento consistente com "valor padrão".

5. **Regra de sincronização atômica preservada**: a proteção da phase1 contra buscas "no meio do caminho" (Projeto/Aditivo/Meta mudando juntos no mesmo evento) continua valendo. Com a URL como fonte de verdade, a atualização dos params dependentes deve ocorrer no mesmo `setSearchParams` (uma escrita), para não disparar duas buscas nem uma busca com combinação inconsistente.

## Risks / Trade-offs

- [Recarregar dados ao voltar (~1s)] → Aceito explicitamente; medido na phase1 (~200 turmas em paralelo ≈ 1s). Mitigável no futuro com um endpoint em lote, se virar incômodo.
- [Distinção padrão "Iniciada" vs. "Todas" na URL] → Resolvida com sentinela explícito para "Todas"; sem isso, "Todas" seria indistinguível de "sem filtro" e o padrão reintroduziria "Iniciada" ao voltar. Coberto por cenário de spec.
- [URLs mais longas/expostas] → Aceitável: são apenas IDs de filtro, sem dado pessoal (consistente com a regra de não colocar dado sensível em query string — aqui não há dado sensível).

## Migration Plan

Mudança apenas de frontend, sem migração de dados. Deploy do frontend novo é suficiente; URLs antigas (sem params) continuam válidas e caem no padrão. Rollback: reverter o frontend.

## Open Questions

Nenhuma — mecanismo de preservação (URL) confirmado com o responsável.
