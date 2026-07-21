## 1. Frontend: coluna % Ocupação no Dashboard

- [x] 1.1 Adicionar item `percentualOcupacao` ao array `colunas` de `Dashboard.jsx`, entre `alunosAtivos` e `inicio`, calculando `vagas[t.id_turma] > 0 ? Number(((t.totalAlunosAtivos / vagas[t.id_turma]) * 100).toFixed(2)) : null`
- [x] 1.2 Adicionar `<td>` correspondente no `<tbody>`, entre a célula de Alunos ativos e a de Início, exibindo `${valor}%` ou "—" quando `null`
- [x] 1.3 Adicionar item "% Ocupação" em `colunasExportacao`, na mesma posição, com o mesmo valor formatado da célula
- [x] 1.4 Confirmar que a coluna participa da ordenação existente (`compararValores`), com `null` sempre por último em ambas as direções, sem lógica adicional

## 2. Validação manual

- [x] 2.1 Turma com vagas definidas e alunos ativos exibe o percentual correto (ex.: 18/20 → 90%)
- [x] 2.2 Turma com `vagas = 0` (default) exibe "—", não `0%`/`NaN%`/`Infinity%`
- [x] 2.3 Turma com mais alunos ativos do que vagas exibe percentual acima de 100%, sem limite artificial
- [x] 2.4 Ordenar pela coluna "% Ocupação": turmas com "—" ficam sempre por último, em ambas as direções
- [x] 2.5 Exportação Excel inclui a coluna "% Ocupação" com o mesmo valor exibido na tela
- [x] 2.6 Confirmar, lendo o código, que nenhuma chamada de API nova foi introduzida (cálculo puramente client-side)
