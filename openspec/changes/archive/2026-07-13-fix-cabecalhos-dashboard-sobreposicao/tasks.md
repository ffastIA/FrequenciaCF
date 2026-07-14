## 1. Correção de CSS

- [x] 1.1 `index.css`: `.table-turmas th` — aumentar `max-width` de `100px` para `150px`
- [x] 1.2 `index.css`: `.table-turmas th` — adicionar `overflow-wrap: break-word` (sem `word-break`, que quebra palavras curtas desnecessariamente)

## 2. Validação visual no navegador

- [x] 2.1 Confirmar que "Alunos Matriculados" e "Alunos ativos" não se sobrepõem mais (zoom na região dos cabeçalhos)
- [x] 2.2 Confirmar que "Alunos Matriculados" quebra como "Alunos" / "Matriculados" (palavra completa, sem cortar letras)
- [x] 2.3 Confirmar que as demais colunas (Código, Curso, Instrutor, Situação, Início, Término, Último Lançamento, Dias em Atraso) continuam com boa aparência, sem ficarem desnecessariamente largas
- [x] 2.4 Confirmar que a tabela de alunos do drill-down (`TurmaDetalhe.jsx`) continua intocada (escopo `.table-turmas` não afeta essa tela)
- [x] 2.5 Sem erros no console
