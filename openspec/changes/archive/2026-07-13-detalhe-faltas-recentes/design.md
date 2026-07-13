## Context

A tela de detalhe da turma (`TurmaDetalhe.jsx`) já busca faltas por aluno via `useFaltasPorAlunos` (N chamadas paralelas a `GET /api/metricas/faltas`, uma por aluno), com escopo acumulado desde `turma.data_inicio`. A change `fix-ultimo-lancamento-real` estabeleceu que "aula lançada"/"realizada" exige `aula.status = 1`, porque aulas com `status = 0` podem ter `frequencia` pré-copiada de uma aula anterior (inclusive em aulas com data futura) — confirmado em produção. Essa mesma armadilha se aplica aqui: se "últimas 4 aulas" incluísse aulas `status = 0`, uma turma poderia aparentar faltas em aulas que nunca aconteceram.

Confirmado no banco: `aula` pode ter múltiplas linhas na mesma data (turnos/módulos diferentes no mesmo dia) — a turma 5986, por exemplo, tem 3 aulas em `2026-07-08`. "Últimas 4 aulas" é tratado como as últimas 4 **linhas** de `aula` (não 4 datas distintas), ordenadas por `data DESC, id_aula DESC`.

## Goals / Non-Goals

**Goals:**
- Nova coluna mostra, por aluno, quantas faltas ocorreram nas últimas 4 aulas realizadas da turma.
- Reutilizar a definição de "aula realizada" (`status = 1`) já estabelecida, evitando o mesmo bug de copy-forward.
- Turmas com menos de 4 aulas realizadas mostram a contagem sobre as aulas disponíveis, com o denominador visível.
- Uma única chamada de API por turma (não por aluno), já que o conjunto de aulas é o mesmo para todos.

**Non-Goals:**
- Tornar "4" configurável via parâmetro de URL/UI nesta change (fixo no backend; pode virar parâmetro depois, se necessário).
- Alterar a métrica existente de faltas acumuladas (`quantidadeFaltas`/`percentualFaltas`) — a nova coluna é aditiva, lado a lado.
- Considerar `presenca = 3` (falta justificada) como falta — mantém a definição já estabelecida (`presenca = 2` apenas).

## Decisions

1. **Endpoint turma-cêntrico, não aluno-cêntrico**: `GET /api/metricas/faltas-recentes?idTurma=X` retorna, numa única resposta, a contagem de todos os alunos matriculados na turma. Alternativa descartada: replicar o padrão de `GET /api/metricas/faltas` (uma chamada por aluno) — desnecessário aqui porque as "últimas 4 aulas" são fixas para a turma inteira; uma chamada por turma é mais simples e mais barata que N chamadas paralelas.

2. **"Últimas 4 aulas" = últimas 4 linhas de `aula` com `status = 1` e `data <= hoje`**, ordenadas por `data DESC, id_aula DESC` (desempate estável quando há mais de uma aula na mesma data). Não são "últimas 4 datas com aula" — turmas com múltiplas aulas por dia (turnos/módulos) teriam mais de 4 "sessões" contando como poucas datas; a unidade natural de frequência neste sistema é a linha de `aula`, consistente com o resto da capability (`aulasPrevistas`, `aulasSemFrequenciaLancada` também contam linhas de `aula`, não datas).

3. **Denominador visível e variável (`aulasConsideradas`)**: quando a turma tem menos de 4 aulas realizadas, o denominador reflete o que existe (1, 2 ou 3), em vez de fixar "4" ou esconder a coluna. Alternativa descartada (não exibir até completar 4): esconderia informação relevante logo no início da turma, quando o acompanhamento de frequência é mais importante.

4. **Falta = `frequencia.presenca = 2`, aluno sem registro não conta como falta**: mesma semântica já usada em `getFaltasEPrevistasPorAluno` — um `LEFT JOIN` entre a lista de alunos e a `frequencia` das últimas N aulas; ausência de registro é tratada como "sem falta" (não incrementa o numerador), consistente com o resto do sistema.

5. **Alunos considerados = todos os alunos com matrícula na turma** (não restrito a `situacao = 7`): o endpoint em si é agnóstico à situação da matrícula, deixando o filtro por "ativo" a cargo do consumidor — o frontend já busca só os alunos ativos via `GET /api/filtros/alunos?situacao=7` e casa o resultado por `id_aluno`, igual ao padrão já usado para `useFaltasPorAlunos`.

## Risks / Trade-offs

- [Turma sem nenhuma aula realizada ainda] → `aulasConsideradas: 0`; a UI mostra "—" em vez de "0/0", que seria ambíguo (parece "nenhuma falta" quando na verdade é "sem dado").
- ["4" fixo no backend, sem parâmetro] → Aceitável para o pedido atual; se precisar variar por caso de uso, adicionar um parâmetro opcional depois é uma mudança aditiva simples.

## Migration Plan

Endpoint novo, aditivo; sem migração de dados. Deploy conjunto de backend e frontend (o frontend novo depende do endpoint novo). Rollback: reverter os dois; nada quebra no que já existe.

## Open Questions

Nenhuma — escopo das aulas (`status = 1`), tratamento de turma nova (contar sobre o disponível) e formato de exibição (`faltas/aulasConsideradas`) confirmados com o responsável.
