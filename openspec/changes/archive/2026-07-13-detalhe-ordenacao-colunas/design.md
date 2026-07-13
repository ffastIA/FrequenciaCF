## Context

A tabela de alunos em `TurmaDetalhe.jsx` (`frontend/src/pages/TurmaDetalhe.jsx:104-149`) tem 4 colunas:
- **Aluno** (`aluno.nome`, texto, sempre presente)
- **Quantidade de faltas** (`falta.quantidadeFaltas`, número; célula mostra `...` enquanto carrega, `—` em erro)
- **Percentual de faltas** (`falta.percentualFaltas`, número ou `null` quando a turma não tem aulas previstas no período; célula mostra `X%`, `—` quando `null`, `...` enquanto carrega)
- **Faltas (últimas 4 aulas)** (`faltasRecentesPorAluno[id]`/`aulasConsideradas`, dois números exibidos como `X/N`; célula mostra `—` quando `aulasConsideradas = 0`, `...` enquanto carrega)

Os dados de faltas chegam de forma assíncrona e por aluno (`useFaltasPorAlunos`, N chamadas paralelas), então a tabela pode estar parcialmente carregada quando o usuário clica para ordenar — a ordenação precisa lidar com valores ainda ausentes sem quebrar ou gerar comportamento confuso.

## Goals / Non-Goals

**Goals:**
- Clicar em qualquer cabeçalho ordena a tabela por aquela coluna, alternando crescente/decrescente a cada clique.
- Funciona corretamente tanto para a coluna de texto (Aluno) quanto para as três colunas numéricas.
- Célula ainda carregando ou sem valor (`—`, `...`) não quebra a ordenação nem some da tabela — vai para o final, mantendo a lista estável enquanto os dados chegam.
- Mudança só no frontend, sem tocar em backend ou em outras telas.

**Non-Goals:**
- Ordenação multi-coluna (por duas colunas ao mesmo tempo) — fora de escopo, um clique sempre define a única coluna ativa.
- Persistir a ordenação escolhida entre navegações (ex.: na URL, como fizemos com os filtros do Dashboard) — reinicia ao entrar na tela, já que é um recurso de leitura pontual da tabela, não um filtro de busca.
- Aplicar ordenação na tabela de turmas do Dashboard — o pedido é especificamente sobre a tela de detalhe (drill-down); pode ser proposto como change separada depois, se desejado.

## Decisions

1. **Estado local simples: `{ coluna, direcao }`**, com `coluna` podendo ser `null` (ordem original da API) inicialmente. Clicar num cabeçalho: se for a mesma coluna já ativa, inverte `direcao`; se for outra coluna, define a nova coluna com `direcao = 'asc'`. Sem terceiro estado "sem ordenação" após o primeiro clique — alternância contínua entre crescente e decrescente, como pedido.

2. **Ordenar pelo valor bruto, não pelo texto renderizado na célula**: cada coluna tem uma função "extratora" que devolve o valor comparável (`aluno.nome` para texto; `falta.quantidadeFaltas`, `falta.percentualFaltas`, `faltasRecentesPorAluno[id]` para número), independente de como a célula formata `—`/`X%`/`X/N` para exibição. Extrai `null`/`undefined` quando o dado ainda não chegou ou é inexistente (percentual nulo, carregando).

3. **Valores nulos/ausentes sempre no final, nas duas direções**: um comparador que trata `null`/`undefined` como "maior que qualquer valor" garante que, tanto em ordem crescente quanto decrescente, essas linhas fiquem por último — evita que, ao inverter a direção, linhas "sem dado" saltem para o topo (comportamento confuso, já que "sem dado" não é nem o maior nem o menor valor real).

4. **Comparação de texto com `localeCompare('pt-BR', { sensitivity: 'base' })`**: ordena nomes com acentuação corretamente (ex.: "Álvaro" entre "Aluno" e "Ana", não jogado para o fim por causa do código Unicode do "Á"), e ignora maiúsculas/minúsculas.

5. **Ordenação recalculada a cada render a partir dos dados atuais**: como a tabela já guarda `alunos`/`faltas`/`faltasRecentes` em estado, a lista ordenada é derivada (não duplicada em outro estado), então a ordenação se ajusta automaticamente conforme os dados assíncronos vão chegando — sem precisar re-clicar para "atualizar" a ordenação.

## Risks / Trade-offs

- [Ordenação muda de posição conforme os dados chegam (loading→carregado)] → Aceito: é o comportamento correto (a ordenação reflete o dado real assim que ele chega); alternativa de "congelar" a ordem até tudo carregar atrasaria a interação sem necessidade.
- [Um clique a mais que o esperado se o usuário confundir com um terceiro estado "resetar"] → Mitigado com o indicador visual claro de coluna/direção ativa.

## Migration Plan

Mudança só de frontend, sem estado persistido, sem migração. Deploy do frontend novo é suficiente. Rollback: reverter o componente.

## Open Questions

Nenhuma.
