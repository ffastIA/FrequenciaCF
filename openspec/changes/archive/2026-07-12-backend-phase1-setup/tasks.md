## 1. Setup Inicial

- [x] 1.1 Criar pasta `backend/` na raiz do projeto e rodar `npm init`
- [x] 1.2 Instalar dependências: `express mysql2 dotenv joi cors` e dev-dependency `nodemon`
- [x] 1.3 Criar `.env.example` (template sem senha) e confirmar que `.env` está no `.gitignore`
- [x] 1.4 Configurar scripts `start` e `dev` no `package.json`
- [x] 1.5 Atualizar `.gitignore` para excluir `.env` e `node_modules/`

## 2. Configuração do Banco

- [x] 2.1 Criar `backend/config/database.js` com pool `mysql2/promise` (`connectionLimit: 10`)
- [x] 2.2 Criar `backend/config/env.js` validando as variáveis obrigatórias (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`)
- [x] 2.3 Testar conexão com o banco de produção (`getConnection()` / `release()`)

## 3. Estrutura do Servidor

- [x] 3.1 Criar estrutura de pastas `backend/{config,models,services,routes,middleware,utils}`
- [x] 3.2 Criar `backend/server.js` (Express, CORS, JSON, carregamento de `.env`)
- [x] 3.3 Criar `backend/middleware/errorHandler.js` (status 500, mensagem detalhada só em `NODE_ENV=development`)
- [x] 3.4 Validar que `npm run dev` inicia o servidor na porta configurada sem erros

## 4. Models de Dados

- [x] 4.1 Implementar `backend/models/Projeto.js` (`getProjetos`, `getProjetoById`)
- [x] 4.2 Implementar `backend/models/ProjetoAditivo.js` (`getAditivosPorProjeto`)
- [x] 4.3 Implementar `backend/models/MetaTurma.js` (`getMetasPorAditivo`)
- [x] 4.4 Implementar `backend/models/Turma.js` (`getTurmasPorProjetoAditivo` com filtro opcional de `status`/situação da turma, `getTurmaById`)
- [x] 4.5 Implementar `backend/models/Instrutor.js` (`getInstrutoresPorTurmas`, `getInstrutorById`)
- [x] 4.6 Implementar `backend/models/Aula.js` (`getAulasPorTurma`, `getAulasRealizadas`)
- [x] 4.7 Implementar `backend/models/Aluno.js` (`getAlunosPorTurma`, `getAlunoById`)
- [x] 4.8 Implementar `backend/models/Frequencia.js` (`getFrequenciasPorTurma`, `getFrequenciasNaoLancadas`)
- [x] 4.9 Implementar `backend/models/Curso.js` (`getCursoPorTurma`)
- [x] 4.10 Validar que todos os 9 models importam sem erro em `server.js` e retornam dados reais em < 1s por query

## 5. FiltroService

- [x] 5.1 Criar `backend/services/FiltroService.js` recebendo os models de Projeto, Aditivo, Meta, Turma e Instrutor no construtor
- [x] 5.2 Implementar `getProjetos()`
- [x] 5.3 Implementar `getAditivosPorProjeto(idProjeto)`
- [x] 5.4 Implementar `getMetasPorAditivo(idProjetoAditivo)`
- [x] 5.5 Implementar `getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, idMeta, idInstrutor, status)` incluindo o filtro de situação da turma
- [x] 5.6 Implementar `getInstrutoresPorTurmas(idTurmas)`

## 6. Rotas de Filtros

- [x] 6.1 Criar `backend/routes/api/filtros.js` e registrar em `server.js`
- [x] 6.2 Implementar `GET /api/filtros/projetos`
- [x] 6.3 Implementar `GET /api/filtros/aditivos?idProjeto=X` com validação Joi (`idProjeto` obrigatório)
- [x] 6.4 Implementar `GET /api/filtros/metas?idProjetoAditivo=X` com validação Joi (`idProjetoAditivo` obrigatório)
- [x] 6.5 Implementar `GET /api/filtros/turmas?idProjeto=X&idProjetoAditivo=Y&idMeta=Z&idInstrutor=W&status=S` com validação Joi (`idProjeto`/`idProjetoAditivo` obrigatórios; `idMeta`/`idInstrutor`/`status` opcionais, `status` entre 0 e 4)
- [x] 6.6 Implementar `GET /api/filtros/instrutores?idTurmas=1,2,3`

## 7. Testes Integrados

- [x] 7.1 Criar `backend/tests.http` (ou coleção Postman) cobrindo os 5 endpoints de filtros
- [x] 7.2 Testar cascata completa Projeto → Aditivo → Meta → Turmas (com e sem filtro de status) → Instrutores
- [x] 7.3 Validar que todas as respostas retornam status 200 com JSON esperado e nenhum erro de SQL
- [x] 7.4 Validar performance (< 1s por query) com IDs reais do banco

## 8. Documentação

- [x] 8.1 Criar `backend/README.md` (instalação, configuração de `.env`, como rodar localmente)
- [x] 8.2 Criar `backend/API.md` (documentação dos 5 endpoints, incluindo o parâmetro `status` de turma)
- [x] 8.3 Atualizar `README.md` da raiz do projeto com instruções do backend
