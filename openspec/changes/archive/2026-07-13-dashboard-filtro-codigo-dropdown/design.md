## Context

`Dashboard.jsx` já busca `turmas` via `GET /api/filtros/turmas` usando exatamente `idProjeto`, `idProjetoAditivo`, `idMeta`, `idInstrutor` e `status` (o parâmetro `codigos` nunca é enviado ao backend — o filtro de código sempre foi aplicado no cliente, sobre essa mesma lista). Isso significa que `turmas` **já é** o universo exato de turmas que atendem a "Projeto, Aditivo, Meta (opcional), Instrutor e Situação" — exatamente o que o dropdown de código precisa listar. Não há necessidade de nenhuma chamada nova.

O padrão de Instrutor já estabelece o precedente de um dropdown cujas opções vêm de um escopo calculado (turmas do Projeto/Aditivo/Meta), populado num `useEffect` próprio. O padrão de reset em cascata (Projeto limpa Aditivo/Meta/Instrutor/Situação/código; Aditivo limpa Meta/Instrutor/Situação/código) já existe nos handlers atuais.

## Goals / Non-Goals

**Goals:**
- Dropdown de código, seleção única, no mesmo estilo visual dos demais filtros.
- Opções = códigos únicos das turmas em `turmas` (já filtradas por Projeto/Aditivo/Meta/Instrutor/Situação), ordenados alfabeticamente crescente.
- Sem chamada de API nova.
- Seleção inválida (turma que saiu do escopo) é limpa automaticamente.

**Non-Goals:**
- Manter a capacidade de filtrar múltiplos códigos ao mesmo tempo — decisão explícita do responsável de trocar por seleção única, igual a Projeto/Aditivo.
- Mudar a posição do filtro na tela (continua na barra secundária, após Situação).
- Mudar o mecanismo de ordenação por clique já existente na coluna "Código" da tabela — este pedido é só sobre o filtro, não sobre a ordenação da tabela.

## Decisions

1. **Opções derivadas de `turmas` (estado já existente), sem novo `useEffect` de fetch**: diferente de Instrutor (que busca um escopo próprio via `getInstrutores`, porque instrutor não é um campo direto de `turma`), código **já é** um campo de cada item em `turmas` — `[...new Set(turmas.map(t => t.codigo))].sort((a, b) => a.localeCompare(b, 'pt-BR'))` é suficiente, recalculado a cada render (mesmo padrão leve já usado para `colunas`, sem necessidade de `useMemo` nesta base de código).

2. **Valor do `<option>` = string do código (não `id_turma`)**: mantém a URL legível e compartilhável (`?codigo=IR2-2602`, não `?codigo=5986`), e é consistente com o que já era usado no filtro de texto anterior (comparação por string de código). Se dois `id_turma` diferentes tiverem o mesmo `codigo` dentro do mesmo escopo (não observado nos testes, mas não impossível), selecionar aquele código mostraria todas as turmas com aquele código — mesmo comportamento de "correspondência por string" que o filtro de texto anterior já tinha.

3. **Parâmetro de URL renomeado de `codigos` para `codigo`**: reflete a mudança de "lista de valores separados por `;`" para "um valor único", evitando um nome de parâmetro que sugere pluralidade quando não é mais o caso. Compatibilidade com links antigos (`?codigos=X`) não é mantida — aceitável para uma ferramenta interna.

4. **Seleção órfã limpa dentro do próprio `.then()` da busca de `turmas`, não num `useEffect` separado**: a ideia original era um efeito próprio observando `turmas`/`codigo`, mas isso tem uma corrida real — no acesso direto/refresh com `codigo` já preenchido na URL, `turmas` começa vazio no primeiro render (estado inicial), e um efeito separado rodaria nesse mesmo ciclo, antes da busca real terminar, apagando a seleção prematuramente (mesmo tentando usar `carregandoTurmas` como guarda: esse estado também só reflete `true` a partir do próximo commit, não do mesmo ciclo em que os efeitos iniciais rodam). A correção: a checagem de "código ainda existe no escopo" roda dentro do `.then((resultado) => ...)` do efeito que já busca `turmas`, usando o `resultado` que de fato chegou da API — elimina a corrida por completo, sem precisar de um segundo efeito nem de flags de estado adicionais. Cobre todos os casos que afetam o escopo (Projeto, Aditivo, Meta, Instrutor, Situação), já que qualquer um deles dispara essa mesma busca.

5. **Opção vazia "Todos" preservada**: mantém o filtro opcional (sem código selecionado = mostrar todas as turmas do escopo), consistente com o comportamento anterior de campo vazio.

## Risks / Trade-offs

- [Perda da filtragem por múltiplos códigos simultâneos] → Decisão explícita do responsável; quem precisar comparar turmas específicas usa a ordenação por coluna "Código" já existente para localizá-las na lista.
- [Renomeação do parâmetro de URL quebra links antigos com `?codigos=`] → Aceitável para uso interno; não há indício de links `codigos=` compartilhados/salvos que precisem continuar funcionando.

## Migration Plan

Mudança só de frontend, sem dependências novas, sem migração de dados. Deploy do frontend novo é suficiente. Rollback: reverter `Dashboard.jsx`.

## Open Questions

Nenhuma — seleção única confirmada com o responsável.
