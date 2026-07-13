## ADDED Requirements

### Requirement: FiltroService com cascata de filtros
O sistema SHALL prover `backend/services/FiltroService.js`, orquestrando os models de `Projeto`, `ProjetoAditivo`, `MetaTurma`, `Turma` e `Instrutor` para implementar a cascata: Projeto → Aditivo → Meta → Turmas (com filtro de situação) → Instrutores.

#### Scenario: Cascata completa
- **WHEN** `getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, idMeta, idInstrutor)` é chamado com um `idProjeto` e `idProjetoAditivo` válidos
- **THEN** retorna somente as turmas pertencentes àquele projeto/aditivo, aplicando `idMeta` e `idInstrutor` como filtros adicionais quando informados

### Requirement: Endpoint de listagem de projetos
O sistema SHALL expor `GET /api/filtros/projetos`, retornando a lista de projetos sem parâmetros obrigatórios.

#### Scenario: Listar projetos
- **WHEN** um cliente faz `GET /api/filtros/projetos`
- **THEN** a resposta tem status 200 e um array JSON de projetos

### Requirement: Endpoint de aditivos por projeto
O sistema SHALL expor `GET /api/filtros/aditivos?idProjeto=X`, exigindo `idProjeto` (number) via validação Joi.

#### Scenario: Aditivos de um projeto válido
- **WHEN** um cliente faz `GET /api/filtros/aditivos?idProjeto=1`
- **THEN** a resposta tem status 200 com os aditivos do projeto 1

#### Scenario: Parâmetro obrigatório ausente
- **WHEN** um cliente faz `GET /api/filtros/aditivos` sem `idProjeto`
- **THEN** a resposta tem status 400 com mensagem de validação, sem executar a query no banco

### Requirement: Endpoint de metas por aditivo
O sistema SHALL expor `GET /api/filtros/metas?idProjetoAditivo=X`, exigindo `idProjetoAditivo` (number) via validação Joi.

#### Scenario: Metas de um aditivo válido
- **WHEN** um cliente faz `GET /api/filtros/metas?idProjetoAditivo=1`
- **THEN** a resposta tem status 200 com as metas daquele aditivo

### Requirement: Endpoint de turmas com filtro de situação
O sistema SHALL expor `GET /api/filtros/turmas?idProjeto=X&idProjetoAditivo=Y&idMeta=Z&idInstrutor=W&status=S`, exigindo `idProjeto` e `idProjetoAditivo` (number, obrigatórios), com `idMeta`, `idInstrutor` e `status` (number, 0 a 4) opcionais via validação Joi.

#### Scenario: Turmas sem filtro de status
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1`
- **THEN** a resposta tem status 200 com todas as turmas do projeto/aditivo, independente da situação

#### Scenario: Turmas filtradas por situação "iniciada"
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1&status=2`
- **THEN** a resposta tem status 200 contendo somente turmas com situação "iniciada" (status = 2)

#### Scenario: Status inválido
- **WHEN** um cliente faz `GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1&status=9`
- **THEN** a resposta tem status 400, pois `status` deve estar entre 0 e 4

### Requirement: Endpoint de instrutores por turmas
O sistema SHALL expor `GET /api/filtros/instrutores?idTurmas=1,2,3`, aceitando uma lista de IDs de turma separados por vírgula.

#### Scenario: Instrutores de múltiplas turmas
- **WHEN** um cliente faz `GET /api/filtros/instrutores?idTurmas=1,2,3`
- **THEN** a resposta tem status 200 com os instrutores vinculados a qualquer uma das turmas 1, 2 ou 3, sem duplicatas
