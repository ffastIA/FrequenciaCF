## Context

O Dashboard (`frontend/src/pages/Dashboard.jsx`) exibe a tabela de Turmas com colunas definidas em duas listas paralelas: o array `colunas` (cabeçalho + extrator de valor para ordenação) e um `<tbody>` que renderiza cada `<td>` manualmente na mesma ordem (não faz `.map` sobre `colunas`). Há ainda um terceiro array, `colunasExportacao`, usado pela exportação Excel. As três precisam ser mantidas em sincronia ao adicionar uma coluna.

O backend segue um padrão simples de 3 camadas: `routes/api/*.js` (Express Router + validação Joi) → `services/*.js` (regra de negócio) → `models/*.js` (consultas ao MySQL via `pool`). O guard `assertReadOnly` em `backend/config/database.js` intercepta qualquer `execute`/`query` no pool MySQL cujo texto não comece por `SELECT`/`SHOW`/`EXPLAIN`/`DESCRIBE`. Esse guard não tem nenhuma relação com I/O de arquivo — só existe para proteger o MySQL.

Não existe hoje nenhum mecanismo de persistência local (arquivo) no backend, nem nenhum padrão de campo editável no frontend (só existem `<select>`s reativos, sem botão de salvar).

## Goals / Non-Goals

**Goals:**
- Persistir o número de vagas por turma num arquivo JSON local, nunca no MySQL.
- Expor esse dado via API e permitir edição inline na tabela do Dashboard, com salvamento automático e recarregamento entre sessões.
- Manter a separação estrita: o armazenamento de vagas nunca importa ou usa o pool MySQL.

**Non-Goals:**
- Calcular percentual de ocupação (fica para uma spec futura que consumirá `GET /api/vagas`).
- Suporte a múltiplos usuários editando a mesma turma simultaneamente com resolução de conflito além de last-write-wins.
- Autenticação/autorização por usuário (fora do escopo atual do projeto).

## Decisions

**Persistência em arquivo JSON versionado, não gitignored.**
`backend/data/vagas.json`, iniciando com `{}`. Optou-se por versionar (em vez de gitignore) para que o arquivo sempre exista após um clone, sem depender de criação automática na primeira escrita. Alternativa considerada: arquivo gitignored e autocriado no primeiro `PUT` — descartada porque adicionaria um caminho de "arquivo ausente" a mais para testar, sem necessidade real neste projeto de porte pequeno.

**Formato do arquivo:** mapa por `id_turma` (chave string, já que chaves de objeto JSON são sempre string): `{ "<id_turma>": { "vagas": number, "atualizadoEm": string ISO } }`. O campo `atualizadoEm` é auxiliar (auditoria/depuração futura), não é exposto pela API — `GET /api/vagas` retorna um mapa achatado `{ "<id_turma>": number }`, que é só o que o frontend consome.

**Camada de serviço dedicada, sem model.** `backend/services/VagasService.js` faz I/O de arquivo diretamente (`fs/promises`), sem passar por nenhum `model` nem pelo `pool` MySQL — ao contrário do padrão dos outros services (que recebem models construídos sobre `pool`). Essa é uma divergência intencional do padrão existente: não existe "modelo de dados relacional" aqui, só um arquivo chave-valor, então introduzir um model MySQL-shaped seria uma abstração falsa.

**Escritas serializadas em fila de promises, dentro do processo.** `setVagas(idTurma, vagas)` lê o arquivo inteiro, atualiza uma chave, e reescreve o arquivo inteiro. Duas chamadas concorrentes para turmas diferentes poderiam, em teoria, interlacear leitura/escrita e uma sobrescrever a outra. Mitigação: uma fila simples (`let fila = Promise.resolve()`; cada escrita encadeia em `fila = fila.then(...)`) serializa todas as escritas do processo, eliminando essa janela de corrida a custo desprezível. Não é necessário lock entre processos (deploy roda uma única instância Node).

**Endpoints: `GET /api/vagas` (mapa completo) + `PUT /api/vagas/:idTurma` (upsert de uma turma).**
`GET` retorna o mapa inteiro, não paginado por turma, porque o Dashboard já carrega todas as turmas do escopo de uma vez (mesmo padrão de `totalAlunosMatriculados`, que vem embutido na resposta de `/api/filtros/turmas`) — uma chamada por turma seria custo desnecessário para um arquivo local pequeno. `PUT` (não `POST`/`PATCH`) porque a operação é "defina o valor de vagas desta turma para X" — substituição idempotente por chave, não criação numa coleção nem patch parcial de um recurso maior.

**Validação: inteiro entre 0 e 25.** Valor definido pelo usuário do projeto como teto plausível de tamanho de turma. Fora da faixa (negativo, não-inteiro, ausente, ou > 25) retorna 400 e não altera o arquivo.

**Amend explícito de duas regras existentes, em vez de violação silenciosa:**
1. CLAUDE.md ("todas as rotas em `backend/routes/api/` devem ser GET") — reescrita para deixar claro que a regra protege o MySQL; armazenamento local em arquivo pode usar outros verbos.
2. Spec `frontend-dashboard`, requirement "Frontend consome somente endpoints de leitura" — ganha uma exceção nomeada e restrita: `PUT /api/vagas/:idTurma`, e só ela.
Ambas as mudanças são documentadas nesta change (não implementadas por conta própria em outro momento), conforme a própria regra do projeto de que mudanças de escopo precisam de decisão explícita — já validada com o responsável do projeto durante o planejamento desta change.

**Frontend: hook dedicado `useVagas.js`, não lógica solta em `Dashboard.jsx`.**
Segue a convenção já existente de hooks como `useAtrasoPorTurmas.js`: busca o mapa completo uma vez ao montar, mantém o estado `vagas` (valores confirmados) e `vagasEmEdicao` (rascunho local durante digitação), expõe `handleVagasChange` (atualiza rascunho) e `handleVagasSalvar` (dispara `PUT`, atualização otimista do estado `vagas`, rollback para o valor anterior em caso de erro).

**Salvamento automático (blur/Enter), sem botão.** Consistente com o restante do Dashboard, que já reage a mudanças de filtro sem exigir um clique de "buscar".

**Célula de edição precisa impedir a navegação da linha.** O `<tr>` da tabela tem `onClick` que navega para `/turmas/:id_turma`; o novo `<td>` da coluna Vagas usa `onClick={(e) => e.stopPropagation()}` para que clicar no campo (inclusive nas setas do `<input type="number">`) nunca dispare a navegação.

**Coluna participa de ordenação e exportação Excel.** Mesmo tratamento das demais colunas visíveis: entrada em `colunas` (extrator fecha sobre o estado `vagas`, mesmo padrão já usado por `diasAtraso`/`ultimoLancamento` que fecham sobre `atrasos`) e em `colunasExportacao`.

## Risks / Trade-offs

- **[Risco] Arquivo `vagas.json` versionado no git pode gerar conflitos de merge se duas pessoas editarem vagas de turmas diferentes em branches diferentes.** → Mitigação: aceitável para o porte atual do projeto (poucos usuários, uso interno); se isso se tornar um problema real, revisitar a decisão de versionamento numa change futura.
- **[Risco] Arquivo local não é backupado como o banco de dados.** → Mitigação: por estar versionado no git, o histórico de commits já funciona como backup/auditoria básica.
- **[Trade-off] Teto de 25 vagas pode não servir turmas maiores no futuro.** → Ajuste é uma mudança de validação pontual (um número no Joi schema), não uma mudança estrutural.

## Migration Plan

- Não há dado existente a migrar: o arquivo começa vazio (`{}`) e cada turma assume default `0` até ser editada.
- Deploy: subir o novo arquivo `backend/data/vagas.json` junto com o código; nenhum passo manual de banco de dados é necessário (nenhuma alteração de schema MySQL).
- Rollback: reverter o deploy do backend/frontend; o arquivo `vagas.json` pode permanecer no repositório sem efeito colateral caso a feature seja desfeita depois.

## Open Questions

Nenhuma pendente — as decisões de arquivo versionado, teto de 25, salvamento automático e escopo da regra GET-only já foram validadas com o responsável do projeto durante o planejamento desta change.
