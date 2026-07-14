## Decision: Posicionamento e Layout

O totalizador será renderizado em um **flex container horizontal** que agrupa:
- Coluna esquerda: dropdown de "Situação" (existente)
- Coluna direita: card/quadro de totalizador (novo)

Ambos no mesmo `.filter-bar`, aproveitando o grid/flex existente, para manter consistência visual e distribuição horizontal.

## Decision: Visual do Card

O totalizador será um **card simples e legível** com:
- Fundo branco/claro (mesma cor dos inputs)
- Label em cima: "Alunos exibidos" ou "Total de alunos"
- Número grande e em destaque
- Borda/sombra consistente com o design system

Padrão: similar aos `.metric-highlight` usados para métricas da turma (dias de atraso, último lançamento), mas em versão menor e integrada à barra de filtro.

## Decision: Sem Estilo Variável

O card não muda de cor ou estado; é sempre exibido. Mostra apenas o número de alunos que correspondem ao filtro selecionado. Quando nenhum aluno corresponde, exibe "0".

## Decision: Responsividade

Em telas menores, o flex container pode quebrar em múltiplas linhas (mobile), mantendo a legibilidade. Em desktop, fica lado a lado.
