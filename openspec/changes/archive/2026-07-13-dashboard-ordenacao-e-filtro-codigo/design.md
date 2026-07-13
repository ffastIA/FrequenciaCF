## Context

A change `detalhe-ordenacao-colunas` já implementou ordenação por coluna na tabela de alunos de `TurmaDetalhe.jsx`, com a lógica de comparação (`compararValores`) definida localmente naquele arquivo. O Dashboard (`Dashboard.jsx`) tem sua própria tabela de turmas (8 colunas: Código, Curso, Instrutor, Situação, Início, Término, Último lançamento, Dias de atraso) e já usa a URL (`useSearchParams`) como fonte de verdade para todos os filtros (Projeto, Aditivo, Meta, Instrutor, Situação), estabelecida na change `frontend-filtros-url-situacao-padrao`.

Os dados da tabela vêm de duas fontes assíncronas: `turmas` (uma chamada) e `atrasos` (um mapa por `id_turma`, populado em paralelo por `useAtrasoPorTurmas`) — as colunas "Último lançamento" e "Dias de atraso" dependem da segunda fonte e podem estar carregando enquanto o restante da tabela já apareceu.

## Goals / Non-Goals

**Goals:**
- Ordenação por coluna na tabela do Dashboard, com o mesmo comportamento e critérios já validados na tela de detalhe (crescente/decrescente alternado, `null`/carregando sempre por último, texto com `localeCompare` pt-BR).
- Extrair a lógica de comparação para um utilitário compartilhado, evitando duplicar a mesma função em dois arquivos.
- Filtro opcional por código de turma(s), separado por `;`, na mesma barra dos filtros adicionais, aplicado sobre os dados já carregados (sem nova chamada à API).
- Filtro de código preservado na URL, seguindo o mesmo padrão dos demais filtros do Dashboard.

**Non-Goals:**
- Mudar o backend para aceitar filtro por código — desnecessário, pois a tabela já tem os dados completos do escopo em memória.
- Busca por trecho/substring do código — o pedido é "código de uma turma ou mais turmas", interpretado como código completo (comparação exata, case-insensitive, com espaços ao redor de cada item ignorados).
- Alterar a ordenação já validada de `TurmaDetalhe.jsx` além de apontar para o utilitário compartilhado (mesmo comportamento, só sem duplicação de código).

## Decisions

1. **Extrair `compararValores` para `frontend/src/utils/ordenacao.js`**: a função já existe, idêntica em requisito, para a nova tabela. Move a implementação para um módulo compartilhado e `TurmaDetalhe.jsx` passa a importar dali, em vez de manter a cópia local. Comportamento não muda — é reaproveitamento, não redesenho.

2. **Coluna "Situação" ordena pelo código numérico (`turma.status`), não pelo texto traduzido**: a situação tem uma progressão natural (0 não especificado → 1 não iniciada → 2 iniciada → 3 concluída → 4 cancelada) definida em `STATUS_TURMA_OPTIONS`. Ordenar pelo texto traduzido ("Cancelada", "Concluída", "Iniciada"...) embaralharia essa progressão em ordem alfabética, sem sentido para o usuário. Ordenar pelo código numérico preserva a progressão esperada.

3. **Colunas de data ("Início", "Término", "Último lançamento") ordenam pelo timestamp (`new Date(valor).getTime()`)**: as datas chegam da API como string ISO (`"2022-08-08T03:00:00.000Z"`); convertidas para timestamp antes de comparar, tratando como `null` quando ausente ou a conversão falhar (aula/atraso ainda não carregado).

4. **Filtro de código aplicado como filtro client-side sobre `turmas`, não como parâmetro de `GET /api/filtros/turmas`**: os dados já estão carregados no cliente para a tabela existir; adicionar um filtro em memória é imediato (sem round-trip) e não exige mudança de backend. Alternativa descartada: enviar o filtro ao backend como mais um parâmetro de query — desnecessário, já que o filtro por código não reduz a carga da API (a tabela já busca o escopo inteiro de Projeto/Aditivo/Meta/Instrutor/Situação de qualquer forma).

5. **Comparação de código exata, case-insensitive, com trim por item**: cada trecho entre `;` é comparado (`toUpperCase().trim()`) contra `turma.codigo.toUpperCase()`. Evita que um espaço acidental depois do `;` (`"IR2-2602; OBR2-2602"`) quebre o filtro, e não exige que o usuário acerte a caixa exata do código.

6. **Filtro de código não participa da consulta de Instrutores disponíveis**: assim como Instrutor e Situação já ficam de fora do escopo usado para popular o select de Instrutor (comentário existente: "escopo Projeto/Aditivo/Meta, SEM os filtros adicionais"), o filtro de código segue a mesma regra — é um refinamento visual da tabela, não do escopo de busca.

7. **Filtro de código resetado junto com Instrutor/Situação ao trocar Projeto/Aditivo/Meta**: mesma lógica de "seleções dependentes resetadas de forma síncrona" já aplicada aos demais filtros adicionais, evitando que um filtro de código antigo esconda silenciosamente os resultados de um novo escopo.

8. **Posição do campo**: adicionado à `filter-bar-secondary` existente (a mesma linha de Instrutor e Situação, abaixo da linha de Meta), como um terceiro campo, na mesma classe `filter-field` — reaproveita o CSS já existente, sem estilo novo.

## Risks / Trade-offs

- [Ordenação e filtro de código coexistindo] → Sem conflito: o filtro por código reduz o conjunto de linhas antes da ordenação ser aplicada; a coluna ativa continua ordenando o subconjunto filtrado.
- ["Situação" ordena por código numérico, não pelo texto exibido"] → Documentado como decisão; se o usuário esperar ordem alfabética do texto, pode ser ajustado depois — mas a progressão lógica é mais útil para acompanhamento de turmas do que a ordem alfabética das traduções.

## Migration Plan

Mudança só de frontend, aditiva, sem migração. Deploy do frontend novo é suficiente. Rollback: reverter os arquivos alterados.

## Open Questions

Nenhuma.
