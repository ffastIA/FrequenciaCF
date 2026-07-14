## Decision: Remover Filtro Padrão Implícito e Adicionar Filtro Explícito

Atualmente, `TurmaDetalhe.jsx` passa `SITUACAO_ATIVO` (valor 7) como segundo parâmetro a `getAlunos()`. Isso filtra os resultados apenas para alunos com `matricula.situacao = 7`, mas o usuário não tem controle sobre isso.

**Nova abordagem:** remover o filtro implícito e adicionar um **dropdown explícito** (visível na tela) que permite ao usuário escolher qual situação filtrar. O dropdown terá 10 opções:
- "Todos" (remove o filtro, retorna todos os alunos)
- "Não especificado" (situacao=0)
- "Matriculado" (situacao=1)
- "Concluiu" (situacao=2)
- "Desistiu" (situacao=3)
- "Evadido" (situacao=4)
- "Não aprovado" (situacao=5)
- "Não iniciou" (situacao=6)
- "Ativo" (situacao=7) — **DEFAULT**
- "Transferido" (situacao=8)

**Default = "Ativo":** para manter compatibilidade com a visão anterior e assumir que "alunos ativos" é o caso mais comum.

## Decision: Sem Alteração no Backend

O endpoint `/api/filtros/alunos` já aceita `situacao` como parâmetro **opcional** (Joi: `min(0).max(8).optional()`). Quando não passado, retorna todos os alunos. Nenhuma mudança no backend é necessária.

## Decision: Coluna "Situação" como Diferenciador Primário

A coluna "Situação" (implementada em `turma-detalhe-situacao-aluno`) agora serve como o mecanismo primário para o usuário entender o estado de cada aluno. Não há necessidade de um filtro separado ou de ocultação de certos alunos.

## Decision: Sem Impacto no Export

A exportação para Excel (`frontend-exportacao-excel`) já inclui a coluna "Situação" e respeita a filtragem/ordenação atual. Quando todos os alunos forem exibidos, o export incluirá todos eles (com a coluna "Situação" indicando o estado de cada um).
