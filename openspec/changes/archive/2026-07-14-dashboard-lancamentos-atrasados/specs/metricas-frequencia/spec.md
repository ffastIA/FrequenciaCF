## ADDED Requirements

### Requirement: Definição de turma em atraso
O sistema SHALL considerar uma turma "em atraso" quando seu `diasAtraso` (calculado conforme a Requirement "Dias de atraso no lançamento por turma") for maior que `7`. Turmas com `diasAtraso: null` (sem nenhuma aula com `data <= hoje`) SHALL NOT ser consideradas em atraso.

#### Scenario: Turma acima do limiar é considerada em atraso
- **WHEN** uma turma tem `diasAtraso = 8`
- **THEN** ela é considerada "em atraso"

#### Scenario: Turma no limiar não é considerada em atraso
- **WHEN** uma turma tem `diasAtraso = 7`
- **THEN** ela NÃO é considerada "em atraso" (o limiar é exclusivo: `> 7`, não `>= 7`)

#### Scenario: Turma sem aulas passadas não é considerada em atraso
- **WHEN** uma turma tem `diasAtraso: null`
- **THEN** ela NÃO é considerada "em atraso", independentemente de nunca ter lançado frequência

### Requirement: Endpoint agregado de turmas atrasadas
O sistema SHALL expor `GET /api/metricas/atraso-lancamento/turmas-atrasadas`, aceitando os mesmos parâmetros de escopo de `GET /api/filtros/turmas` (`idProjeto` e `idProjetoAditivo` obrigatórios; `idMeta`, `idInstrutor`, `status` opcionais). O sistema SHALL calcular `diasAtraso` para cada turma do escopo (reutilizando a mesma lógica de "Dias de atraso no lançamento por turma"), filtrar as turmas em atraso conforme a Requirement "Definição de turma em atraso", e retornar `total` (contagem de turmas em atraso), `mediaDiasAtraso` (média de `diasAtraso` entre as turmas em atraso, arredondada para inteiro, ou `null` quando `total = 0`), e `turmas` (lista com `idTurma`, código, nome, `cursoDescricao`, `instrutorNome`, `diasAtraso` e `dataUltimoLancamento` de cada turma em atraso).

#### Scenario: Requisição válida retorna agregados e lista
- **WHEN** um cliente faz `GET /api/metricas/atraso-lancamento/turmas-atrasadas?idProjeto=16&idProjetoAditivo=8`
- **THEN** a resposta tem status 200 com `total`, `mediaDiasAtraso` e `turmas` (array), contendo somente turmas do escopo com `diasAtraso > 7`

#### Scenario: Parâmetro obrigatório ausente
- **WHEN** um cliente faz `GET /api/metricas/atraso-lancamento/turmas-atrasadas` sem `idProjeto` ou sem `idProjetoAditivo`
- **THEN** a resposta tem status 400, sem executar consultas de turma no banco

#### Scenario: Escopo sem nenhuma turma em atraso
- **WHEN** todas as turmas do escopo consultado têm `diasAtraso <= 7` ou `null`
- **THEN** a resposta tem `total: 0`, `mediaDiasAtraso: null` e `turmas: []`

#### Scenario: Filtros adicionais aplicados ao escopo
- **WHEN** um cliente faz a requisição informando também `idInstrutor` e/ou `status`
- **THEN** o cálculo considera somente as turmas que atendem a todos os filtros informados, igual ao comportamento de `GET /api/filtros/turmas`
