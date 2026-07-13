## 1. Backend: Extensões Aditivas

- [x] 1.1 Adicionar parâmetro opcional `situacao` (Joi: number 0–8) em `GET /api/filtros/alunos`, filtrando `matricula.situacao` na query SQL de `AlunoModel.getAlunosPorTurma`
- [x] 1.2 Expor `dataUltimoLancamento` nos retornos de `getAtrasoLancamentoPorTurma` e `getAtrasoLancamentoPorInstrutor` em `MetricasFrequenciaService` (data da última aula lançada; `null` quando nunca houve lançamento — sem usar o fallback)
- [x] 1.3 Validar contra o banco real: alunos com `situacao=7` filtrados corretamente; turma que nunca lançou retorna `dataUltimoLancamento: null` mantendo `diasAtraso` pelo fallback
- [x] 1.4 Atualizar `backend/API.md` e `backend/tests.http` (param `situacao`, campo `dataUltimoLancamento`)
- [x] 1.5 Confirmar que nenhuma mudança introduz escrita no banco (guard de somente-leitura ativo)

## 2. Frontend: Dados Novos nas Telas

- [x] 2.1 Criar helper único de formatação de datas pt-BR (`dd/mm/aaaa`, `null` → "—") e usá-lo em ambas as telas
- [x] 2.2 Dashboard: adicionar colunas Início (`data_inicio`), Término (`data_fim`) e Último lançamento (`dataUltimoLancamento` da chamada de atraso já existente por linha)
- [x] 2.3 Detalhe: exibir início/término da turma (via estado de navegação) e a data do último lançamento junto ao `diasAtraso`
- [x] 2.4 Detalhe: buscar alunos com `situacao=7` (`api/filtros.js` ganha o parâmetro) e exibir mensagem específica "nenhum aluno ativo" quando a lista vier vazia (distinta de "sem alunos matriculados")

## 3. Frontend: Visual

- [x] 3.1 Layout base: container central, cabeçalho da aplicação, tipografia e espaçamentos consistentes (CSS próprio, sem biblioteca)
- [x] 3.2 Barra de filtros alinhada com rótulos visíveis em ambos os grupos (cascata e adicionais)
- [x] 3.3 Tabelas: cabeçalho destacado, zebra, hover nas linhas clicáveis, alinhamento adequado de colunas de data/número
- [x] 3.4 Estados estilizados: carregando, lista vazia (turmas e alunos ativos) e mensagens de erro
- [x] 3.5 Tela de detalhe: bloco de informações da turma organizado (não lista solta), com destaque visual para dias de atraso e último lançamento

## 4. Testes Manuais no Navegador

- [x] 4.1 Dashboard: colunas novas com datas formatadas `dd/mm/aaaa`; `dataUltimoLancamento` nulo exibido como "—"
- [x] 4.2 Detalhe de turma em andamento com alunos ativos: lista filtrada, faltas por aluno corretas
- [x] 4.3 Detalhe de turma concluída (sem `situacao=7`): mensagem "nenhum aluno ativo", sem erro
- [x] 4.4 Turma que nunca lançou frequência: último lançamento "—" nas duas telas, `diasAtraso` presente
- [x] 4.5 Revisão visual das duas telas (hover, zebra, filtros alinhados, estados estilizados), sem erros no console
- [x] 4.6 Confirmar que nenhuma requisição de escrita é feita e que os endpoints antigos seguem retrocompatíveis (chamada sem `situacao` retorna todos)
