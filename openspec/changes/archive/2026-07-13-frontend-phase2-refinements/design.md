## Context

Frontend Phase 1 está implementada, testada no navegador e arquivada. Estes refinamentos vêm do primeiro uso real pelo responsável do projeto. Verificação prévia no banco: `matricula.situacao = 7` ("ativo") tem apenas 324 matrículas em ~79 mil (a maioria é `2: concluiu`, com 63 mil) — a turma 1597 usada nos testes, por exemplo, não tem nenhum aluno em situação 7.

## Goals / Non-Goals

**Goals:**
- Drill-down mostra apenas alunos ativos (`situacao = 7`), com estado vazio legível.
- Período da turma (início/término) e data do último lançamento visíveis nas duas telas.
- Visual apresentável: layout, tabela e filtros estilizados de forma consistente.
- Manter todas as mudanças de API aditivas e somente leitura.

**Non-Goals:**
- Biblioteca de UI (MUI, Tailwind etc.) — CSS puro é suficiente nesta fase e evita dependência nova.
- Tornar o filtro de situação do aluno configurável na UI (o valor 7 é fixo no frontend; o backend aceita qualquer situação via param para flexibilidade futura).
- Exportação, autenticação, paginação — fora de escopo, como antes.

## Decisions

1. **Filtro de aluno ativo estritamente `situacao = 7`**: decisão explícita do responsável, tomada ciente do dado acima (turmas concluídas mostrarão lista vazia). O sistema é para acompanhar turmas em andamento; lista vazia em turma concluída é comportamento correto, e a UI exibe mensagem explicando que não há alunos **ativos** (não confundir com "sem alunos matriculados").

2. **Filtro aplicado no backend via parâmetro opcional (`GET /api/filtros/alunos?idTurma=X&situacao=7`)**, não hardcoded no endpoint nem filtrado no cliente: mantém o endpoint retrocompatível (sem `situacao`, devolve todos, como hoje), empurra o filtro para o SQL (padrão do projeto: MySQL filtra, não o JS) e deixa o valor 7 como decisão do frontend.

3. **Novo campo `dataUltimoLancamento` nos endpoints de atraso, em vez de reutilizar `dataReferencia`**: `dataReferencia` mistura dois significados (última aula lançada OU primeira aula, no fallback de turma que nunca lançou). Exibir "último lançamento" com o valor do fallback seria informação errada na tela. O campo novo é `null` quando nunca houve lançamento (UI mostra "—"), e o `dataReferencia`/`diasAtraso` continuam intactos para o cálculo de atraso. Alternativa descartada: expor um endpoint separado — desnecessário, o service já tem o dado em mãos na mesma chamada.

4. **Datas de início/término da turma vêm do que já existe**: `/api/filtros/turmas` já retorna `data_inicio`/`data_fim`; nenhuma mudança de backend. Na tela de detalhe, os dados chegam via estado de navegação (padrão da Phase 1); no acesso direto sem estado, as datas ficam indisponíveis como os demais dados básicos — degradação já especificada e aceita na Phase 1.

5. **Formatação de datas em pt-BR (`dd/mm/aaaa`) centralizada num helper do frontend**: os endpoints devolvem datas ISO; a formatação é responsabilidade de apresentação. Um único helper evita formatos inconsistentes entre telas.

6. **CSS puro, escopo pequeno**: layout com container central, cabeçalho, barra de filtros alinhada, tabela com zebra/hover/cabeçalho fixo visualmente distinto, badges de situação e mensagens de estado (carregando/vazio) estilizadas. Sem framework — o volume de UI (2 telas) não justifica a dependência, e o build continua trivial.

## Risks / Trade-offs

- [Filtro `situacao = 7` esvazia o drill-down da maioria das turmas históricas] → Aceito conscientemente pelo responsável; mitigado com mensagem clara ("nenhum aluno ativo") e distinta do caso "sem matrículas". O backend flexível (param) permite mudar o critério depois sem nova mudança de API.
- [Coluna extra de "último lançamento" no Dashboard usa a mesma chamada por turma já existente] → Sem custo adicional de rede; o campo novo vem na resposta que a tabela já busca em paralelo.
- ["Melhorar o visual" é subjetivo] → Requisitos da spec limitam-se a propriedades verificáveis (hover, zebra, estados de carregamento/vazio estilizados, filtros alinhados com rótulos); o refinamento estético fino fica a critério da implementação e da revisão visual do responsável.

## Migration Plan

Mudanças aditivas; deploy conjunto de backend e frontend (o frontend novo depende do campo `dataUltimoLancamento`). Rollback: reverter os dois; o backend antigo continua funcionando com o frontend antigo.

## Open Questions

Nenhuma — critério de "ativo" confirmado explicitamente com o responsável (somente `situacao = 7`).
