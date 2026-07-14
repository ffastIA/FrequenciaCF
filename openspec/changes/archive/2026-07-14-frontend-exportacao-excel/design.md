## Context

Duas telas têm tabela hoje: `Dashboard.jsx` (turmas, com filtros de Projeto/Aditivo/Meta/Instrutor/Situação/Código e ordenação por coluna) e `TurmaDetalhe.jsx` (alunos ativos de uma turma, com ordenação por coluna). Ambas já mantêm, em estado local, exatamente o array final já filtrado e ordenado que é renderizado (`turmasOrdenadas` e `alunosOrdenados`, respectivamente) — o mesmo dado que a exportação precisa usar.

`IMPLEMENTATION_GUIDE.md` (escrito antes da arquitetura atual do frontend existir) previa "Endpoints de export Excel (SheetJS)" no backend. Hoje, boa parte do que aparece na tabela (tradução de situação, formatação de data, filtro de código, ordenação por coluna) é puramente client-side — replicar tudo isso no backend para gerar um Excel equivalente seria duplicar lógica e criar uma segunda fonte de verdade para formatação. Gerar o arquivo no cliente evita essa duplicação.

## Goals / Non-Goals

**Goals:**
- Botão "Exportar para Excel" nas duas telas com tabela.
- Arquivo `.xlsx` real (não CSV), com cabeçalhos e valores formatados iguais aos da tela.
- Reflete exatamente o filtro/ordenação aplicados no momento do clique.
- Sem chamada de rede nova, sem endpoint de backend novo.

**Non-Goals (por ora, avaliar depois se necessário):**
- Múltiplas planilhas, formatação visual avançada (cores, largura de coluna customizada por conteúdo, congelar cabeçalho).
- Seleção de colunas a exportar, ou exportação de dados além do que já está na tela (ex.: todos os alunos de todas as turmas de uma vez).
- Exportar para outros formatos (PDF, CSV) — fora do pedido atual.
- Aguardar dados assíncronos ainda em carregamento (ver Decision 4) — mantém o escopo simples pedido agora.

## Decisions

1. **Biblioteca `xlsx` (SheetJS), não `exceljs`**: `xlsx` gera um `.xlsx` válido com poucas linhas de código (`XLSX.utils.json_to_sheet` + `XLSX.writeFile`), suficiente para uma tabela simples sem estilização — e já era a biblioteca prevista no plano original. `exceljs` seria mais indicado se/quando "algo mais completo" (estilização, múltiplas abas) for pedido depois; adiado para essa avaliação futura, evitando dependência maior que o necessário agora.

2. **Geração 100% client-side, sem endpoint novo**: os dados já estão carregados e formatados no navegador no momento do clique — gerar o arquivo ali é mais direto, não exige round-trip de rede, e garante que o arquivo reflita exatamente o que está na tela (incluindo filtros e ordenação que só existem no frontend). Alternativa descartada (backend gera o Excel): exigiria reimplementar a tradução de situação, formatação de data e a lógica de filtro/ordenação no backend, duplicando regras já existentes no frontend — maior risco de divergência entre tela e arquivo exportado.

3. **Valores exportados = valores formatados exibidos na tela, não os valores brutos da API**: datas em `dd/mm/aaaa` (reaproveitando `formatDateBR`), situação traduzida (reaproveitando `STATUS_TURMA`), percentual com `%`, "—" para nulo/ausente — mesmo texto que aparece na célula da tabela, para que o arquivo seja literalmente "a tabela como está".

4. **Célula ainda carregando no momento do clique exporta como "—", não "..."**: "..." é um indicador visual de carregamento em tela, sem sentido num arquivo baixado (o usuário não vai ver a tela re-renderizar depois). Se `diasAtraso`/`dataUltimoLancamento` (Dashboard) ou faltas de um aluno (detalhe) ainda não tiverem chegado no instante do clique, a célula exporta como "—", igual ao tratamento já usado para valores nulos.

5. **Utilitário compartilhado entre as duas telas**: uma função genérica (`exportarParaExcel(nomeArquivo, colunas, linhas)`) recebe uma lista de `{ rotulo, valor: (linha) => string }` (mesmo formato já usado pelo array `colunas` de cada tela para a tabela) e a lista de linhas já filtrada/ordenada — evita duplicar a lógica de montagem da planilha entre `Dashboard.jsx` e `TurmaDetalhe.jsx`.

6. **Nome do arquivo com data**: `turmas-AAAA-MM-DD.xlsx` (Dashboard) e `alunos-<codigo-da-turma>-AAAA-MM-DD.xlsx` (detalhe), evitando confusão entre exportações feitas em momentos diferentes.

7. **Botão visível só quando há tabela para exportar**: mesma condição que já controla a exibição da tabela (`turmasOrdenadas.length > 0` / `alunosOrdenados.length > 0`) — evita gerar um arquivo vazio ou um botão "morto" quando não há nada a exportar.

## Risks / Trade-offs

- [Exportar enquanto dados assíncronos ainda carregam pode gerar "—" onde o usuário esperava um valor] → Aceito para este escopo simples; o usuário pode aguardar o carregamento completo (rápido, medido em ~1s para ~200 turmas) e exportar de novo.
- [Divergência do plano original (`IMPLEMENTATION_GUIDE.md` previa backend)] → Justificado pela evolução real da arquitetura; registrado explicitamente aqui para não parecer uma inconsistência não intencional.
- [Biblioteca `xlsx` adiciona peso ao bundle do frontend] → Aceitável para uma ferramenta interna; sem otimização de bundle-splitting neste momento (fora de escopo).

## Migration Plan

Mudança só de frontend, aditiva, sem dependências de backend/dados. Deploy do frontend novo é suficiente. Rollback: remover o botão e a dependência.

## Open Questions

Nenhuma.
