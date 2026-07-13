## 1. Backend: Ajustes Pré-requisito (F1.0)

- [x] 1.1 Estender `Turma.getTurmasPorProjetoAditivo` em `backend/models/Turma.js` com `LEFT JOIN curso` e `LEFT JOIN instrutor`, retornando `cursoDescricao` e `instrutorNome` junto aos campos de `turma.*`
- [x] 1.2 Criar `AlunoModel` (já existe) → adicionar rota `GET /api/filtros/alunos?idTurma=X` em `backend/routes/api/filtros.js` com validação Joi (`idTurma` obrigatório)
- [x] 1.3 Validar contra o banco real que `cursoDescricao`/`instrutorNome` vêm preenchidos e que o endpoint de alunos retorna dados corretos
- [x] 1.4 Atualizar `backend/API.md` e `backend/tests.http` com os campos/rota novos
- [x] 1.5 Confirmar que nenhuma das mudanças introduz escrita no banco (guard de somente-leitura continua ativo)

## 2. Setup do Projeto Frontend

- [x] 2.1 Criar projeto Vite+React em `frontend/` (`npm create vite@latest frontend -- --template react`)
- [x] 2.2 Instalar `react-router-dom`
- [x] 2.3 Configurar `VITE_API_URL` (`.env` do Vite) apontando para o backend
- [x] 2.4 Criar estrutura de pastas `frontend/src/{pages,components,api,hooks}`

## 3. Cliente HTTP

- [x] 3.1 Criar `frontend/src/api/client.js` (wrapper sobre `fetch`, base URL, tratamento padrão de erro/JSON)
- [x] 3.2 Criar `frontend/src/api/filtros.js` (`getProjetos`, `getAditivos`, `getMetas`, `getTurmas`, `getInstrutores`, `getAlunos`)
- [x] 3.3 Criar `frontend/src/api/metricas.js` (`getFaltas`, `getAtrasoTurma`, `getAtrasoInstrutor`)

## 4. Tela Dashboard — Filtros em Cascata

- [x] 4.1 Criar `frontend/src/pages/Dashboard.jsx`
- [x] 4.2 Select Projeto, carregado ao montar a página
- [x] 4.3 Select Aditivo, habilitado só após Projeto selecionado
- [x] 4.4 Select Meta, habilitado só após Aditivo selecionado, com opção "Todas" (opcional, não bloqueia a busca)
- [x] 4.5 Disparar busca automática de turmas assim que Projeto + Aditivo estiverem definidos

## 5. Tabela de Turmas + Filtros Adicionais

- [x] 5.1 Renderizar tabela com colunas: código, curso, instrutor, situação (traduzida), dias de atraso
- [x] 5.2 Buscar `diasAtraso` por turma em paralelo (`Promise.all`) após a tabela base carregar, com estado de carregamento por linha
- [x] 5.3 Filtro de Instrutor (select via `GET /api/filtros/instrutores?idTurmas=...` com as turmas atualmente exibidas)
- [x] 5.4 Filtro de Situação (select fixo com as 5 opções de `status`)
- [x] 5.5 Reconsultar `/api/filtros/turmas` ao mudar Instrutor/Situação, mantendo Projeto/Aditivo/Meta

## 6. Roteamento e Tela de Detalhe da Turma

- [x] 6.1 Configurar `react-router-dom` com rotas `/` (Dashboard) e `/turmas/:idTurma` (Detalhe)
- [x] 6.2 Tornar cada linha da tabela clicável, navegando para `/turmas/:idTurma`
- [x] 6.3 Criar `frontend/src/pages/TurmaDetalhe.jsx`: dados básicos da turma + `diasAtraso`
- [x] 6.4 Tabela de alunos da turma (`GET /api/filtros/alunos?idTurma=X`)
- [x] 6.5 Buscar `quantidadeFaltas`/`percentualFaltas` por aluno em paralelo (`GET /api/metricas/faltas?idTurma=X&idAluno=Y`)
- [x] 6.6 Tratar `percentualFaltas: null` na UI (exibir "—", nunca "NaN%")

## 7. Testes Manuais

- [x] 7.1 Fluxo completo: Projeto → Aditivo → (Meta opcional) → tabela carrega → filtro Instrutor/Situação → clique numa turma → detalhe com alunos e faltas
- [x] 7.2 Caso de borda: projeto sem aditivos (tabela vazia, sem erro)
- [x] 7.3 Caso de borda: turma sem alunos matriculados
- [x] 7.4 Caso de borda: turma sem nenhuma aula (`aulasPrevistas: 0`, `percentualFaltas: null` exibido corretamente)
- [x] 7.5 Medir tempo de carregamento da tabela com N chamadas paralelas de atraso, num projeto/aditivo com muitas turmas (ex.: ~200, como visto nos testes do backend)
- [x] 7.6 Confirmar que nenhuma requisição de escrita (`POST`/`PUT`/`PATCH`/`DELETE`) é feita pelo frontend
