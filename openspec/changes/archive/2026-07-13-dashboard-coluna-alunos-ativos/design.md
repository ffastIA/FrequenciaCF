## Context

`TurmaModel.getTurmasPorProjetoAditivo` (`backend/models/Turma.js`) já traz `cursoDescricao` e `instrutorNome` via `LEFT JOIN` simples (relação 1:1 com `turma`). "Alunos ativos" é uma contagem (`matricula.situacao = 7`), relação 1:N — um `JOIN` direto duplicaria linhas de `turma` (uma por matrícula) e exigiria `GROUP BY` em todas as colunas de `t.*`, o que é frágil quando `SELECT t.*` já lista dezenas de colunas. Testado em produção: um subquery correlacionado no `SELECT` (`(SELECT COUNT(*) FROM matricula m WHERE m.id_turma = t.id_turma AND m.situacao = 7)`) resolve isso sem `GROUP BY`, em ~90ms para todas as ~4.400 turmas do banco — desempenho equivalente ao das demais queries já existentes.

O Dashboard já busca `atrasos` (dias de atraso, último lançamento) de forma assíncrona, uma chamada por turma, **depois** que a tabela base carrega — por isso essas duas colunas mostram "..." brevemente. `totalAlunosAtivos`, ao vir na mesma resposta de `GET /api/filtros/turmas` que já popula código/curso/instrutor/situação/datas, aparece junto com o resto da linha, sem esse atraso.

## Goals / Non-Goals

**Goals:**
- Contagem de alunos ativos (`situacao = 7`) visível por turma, sem chamada de rede adicional no frontend.
- Coluna nova participa da ordenação por clique já existente na tabela.
- Sem impacto de performance perceptível.

**Non-Goals:**
- Tornar a situação usada no filtro (`7`) configurável — mantém a mesma decisão já tomada para o drill-down (fixo, não parametrizável pela UI).
- Mudar a tabela de alunos da tela de detalhe — ela já mostra os alunos ativos individualmente; esta change só resume o total na visão geral.

## Decisions

1. **Subquery correlacionado, não `JOIN` + `GROUP BY`**: evita duplicar linhas de turma e evita ter que listar/agrupar por todas as colunas de `t.*`. É a abordagem padrão para agregações 1:N quando a tabela principal já usa `SELECT t.*`.

2. **Campo aditivo em `GET /api/filtros/turmas`, sem endpoint novo**: mesma decisão já tomada para `cursoDescricao`/`instrutorNome` na Phase 1 — o dado é por turma e a tabela já busca todas as turmas de uma vez; não há motivo para uma chamada separada (diferente do padrão usado para `dataUltimoLancamento`/`diasAtraso`, que dependem de cálculo mais pesado por turma via `aula`/`frequencia` e por isso são buscados à parte).

3. **Posição da coluna: logo após "Situação", antes de "Início"**: agrupa as colunas "sobre a turma em si" (código, curso, instrutor, situação, alunos ativos) antes das colunas de datas/atraso. Escolha de baixo risco — fácil de reposicionar depois se preferir outra ordem.

4. **Coluna participa da ordenação (numérica) do mesmo mecanismo já existente** (`colunas` + `compararValores` de `utils/ordenacao.js`): consistente com o comportamento já estabelecido para as demais colunas da tabela; não faria sentido a coluna mais nova ser a única não-ordenável.

## Risks / Trade-offs

- [Subquery correlacionado por linha] → Medido em produção (~90ms para 4.400 turmas); mesmo em cenários maiores, o índice em `matricula.id_turma` (já usado pelas queries de aluno) mantém o custo baixo.

## Migration Plan

Mudança aditiva, sem migração de dados. Deploy conjunto de backend e frontend (frontend novo depende do campo novo). Rollback: reverter os dois.

## Open Questions

Nenhuma.
