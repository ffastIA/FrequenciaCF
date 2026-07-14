## Decision: Mapeamento de situação

O valor de `matricula.situacao` é numérico (0-8), conforme `backend/schema_summary.md`:

- 0 = Não especificado
- 1 = Matriculado
- 2 = Concluiu
- 3 = Desistiu
- 4 = Evadido
- 5 = Não aprovado
- 6 = Não iniciou
- 7 = Ativo
- 8 = Transferido

Na coluna "Situação", exibir a forma textual capitalizada (ex.: "Ativo", "Matriculado", "Evadido", etc.), traduzida em tempo de renderização no frontend via um mapa de valores ou utility.

## Decision: Posicionamento

A nova coluna "Situação" será a segunda coluna da tabela, imediatamente após "Aluno". Ordem final: Aluno → **Situação** → Quantidade de faltas → Percentual de faltas → Faltas recentes.

## Decision: Ordenação

A coluna é ordenável como as demais. Ao clicar no cabeçalho "Situação", ordena por `matricula.situacao` (ordem numérica: 0-8) ou vice-versa, e atualiza a URL com o parâmetro `ordenacao`.

## Decision: Sem alteração no backend

O endpoint `/api/filtros/alunos` já retorna `matricula.situacao`. Nenhuma nova query, campo ou modelo é necessário — apenas consumir o valor já retornado e mapeá-lo no frontend.

## Decision: Sem mudança no schema do banco

A tabela `matricula` já possui a coluna `situacao`; nenhuma migração ou alter table.
