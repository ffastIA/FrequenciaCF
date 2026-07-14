## Context

`TurmaModel.getTurmasPorProjetoAditivo` já traz `totalAlunosAtivos` via subquery correlacionado (`matricula.situacao = 7`), adicionado na change `dashboard-coluna-alunos-ativos`. `matricula.situacao` tem 9 valores possíveis (documentados em `backend/models/Aluno.js`): `0` não especificado / `1` matriculado / `2` concluiu / `3` desistiu / `4` evadido / `5` não aprovado / `6` não iniciou / `7` ativo / `8` transferido. Esta change usa o mesmo mecanismo para `situacao = 1` ("matriculado").

No frontend, `Dashboard.jsx` já tem a infraestrutura completa para colunas simples vindas da mesma resposta (`colunas` array com `{ chave, rotulo, tipo, classe, valor }`, ordenação por clique via `compararValores`, cabeçalhos que quebram linha via `.table-turmas th`) — "Alunos ativos" é o precedente direto a replicar.

## Goals / Non-Goals

**Goals:**
- Contagem de alunos matriculados (`situacao = 1`) visível por turma, sem chamada de rede adicional.
- Posicionada exatamente entre "Situação" e "Alunos ativos", como pedido.
- Mesmo comportamento de ordenação e quebra de cabeçalho que as demais colunas — sem CSS novo.

**Non-Goals:**
- Filtro dedicado (select/input) para esta coluna — o pedido usa "filtro" no sentido de "mesma mecânica de ordenação por clique no cabeçalho", não um novo controle de filtro na barra de filtros (que já tem Instrutor/Situação/Código da turma); não há pedido de um filtro adicional de UI para alunos matriculados.
- Mudar a definição ou o comportamento da coluna "Alunos ativos" já existente.

## Decisions

1. **Segundo subquery correlacionado na mesma query, não uma chamada separada**: como a turma já é buscada uma vez por linha, adicionar `(SELECT COUNT(*) FROM matricula m WHERE m.id_turma = t.id_turma AND m.situacao = 1) AS totalAlunosMatriculados` ao lado do subquery de `totalAlunosAtivos` é a extensão mais direta — mesma tabela, mesmo padrão, sem `JOIN` (que duplicaria linhas de turma). Medido em produção: ~80ms com as duas contagens juntas, mesma ordem de grandeza que só uma.

2. **Posição fixa entre "Situação" e "Alunos ativos"**: conforme pedido explicitamente pelo responsável — a nova coluna entra no array `colunas` antes da entrada de `alunosAtivos`.

3. **"Filtro" = ordenação por clique, não um controle de UI novo**: o pedido diz "com filtro implementado da mesma forma que as outras colunas" — todas as colunas do Dashboard já são ordenáveis por clique no cabeçalho (não têm um filtro de UI dedicado, exceto Instrutor/Situação/Código da turma, que são filtros de escopo diferentes, na barra de filtros). Interpretação adotada: a nova coluna participa da mesma ordenação por clique (`tipo: 'numero'`, mesma função `compararValores`), igual a "Alunos ativos" e "Dias em Atraso".

4. **Sem mudança de CSS**: a classe `.table-turmas th` (já existente, adicionada na change `dashboard-cabecalhos-compactos`) já aplica `white-space: normal` + `max-width` a todos os cabeçalhos do Dashboard — "Alunos Matriculados" (2 palavras) já vai quebrar em 2 linhas automaticamente com o CSS existente, sem precisar de nenhuma regra nova.

## Risks / Trade-offs

- [Turma sem nenhum aluno matriculado] → `totalAlunosMatriculados = 0` (não `null`/ausente), mesmo comportamento já validado para `totalAlunosAtivos` — `0` é um valor real, participa normalmente da ordenação (não vai para o final como "sem dado").

## Migration Plan

Mudança aditiva em backend (campo novo na resposta já existente) e frontend (coluna nova). Sem migração de dados, sem dependências novas. Deploy conjunto de backend e frontend. Rollback: reverter os dois arquivos alterados.

## Open Questions

Nenhuma.
