## frontend-dashboard

### MODIFIED: Detalhe de turma — tabela de alunos

#### Description
Tabela de alunos na tela TurmaDetalhe exibe informações de frequência.

#### Changed Requirement
Adicionar coluna "Situação" como segunda coluna (após "Aluno"), exibindo a situação textual do aluno na turma.

#### Scenarios
- **Coluna "Situação" renderiza valor textual**:
  - Dado um aluno com `matricula.situacao = 7` (Ativo), renderiza "Ativo"
  - Dado um aluno com `matricula.situacao = 4` (Evadido), renderiza "Evadido"
  - Dado um aluno com `matricula.situacao = 2` (Concluiu), renderiza "Concluiu"
  - Dados com `matricula.situacao = 0-8` mapeiam corretamente para: "Não especificado", "Matriculado", "Concluiu", "Desistiu", "Evadido", "Não aprovado", "Não iniciou", "Ativo", "Transferido"

- **Coluna é ordenável**:
  - Clicar no cabeçalho "Situação" ordena a tabela por `matricula.situacao` (ascendente/descendente) e atualiza a URL com o parâmetro `ordenacao` (ex.: `?ordenacao=situacao` ou `?ordenacao=-situacao`)
  - Estado ordenado é preservado ao recarregar a página e ao exportar para Excel

- **Coluna é incluída no export para Excel**:
  - Export respeta a coluna "Situação" e inclui o valor textual formatado (ex.: "Ativo", não "7")
  - Arquivo continua sendo nomeado `alunos-<codigo>-AAAA-MM-DD.xlsx`

#### Acceptance Criteria
- Nova coluna "Situação" é renderizada entre "Aluno" e "Quantidade de faltas"
- Todos os 9 valores de `matricula.situacao` (0-8) são mapeados e exibidos corretamente
- Coluna responde a cliques no cabeçalho para ordenação
- URL é atualizada ao ordenar por "Situação"
- Export para Excel inclui a coluna com valor textual
