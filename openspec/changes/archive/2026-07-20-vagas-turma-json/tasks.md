## 1. Regras do projeto (CLAUDE.md)

- [x] 1.1 Reescrever a linha "Todas as rotas em `backend/routes/api/` devem ser `GET`" para escopar a restrição ao MySQL, deixando explícito que rotas de armazenamento local em arquivo (fora do MySQL) podem usar outros verbos HTTP

## 2. Backend: persistência local de vagas

- [x] 2.1 Criar `backend/data/vagas.json` versionado no git, com conteúdo inicial `{}`
- [x] 2.2 Criar `backend/services/VagasService.js` com `getAll()` (retorna `{}` se arquivo ausente/corrompido, loga warning) e `setVagas(idTurma, vagas)` (reescreve o arquivo, serializando escritas concorrentes numa fila de promises)
- [x] 2.3 Criar `backend/routes/api/vagas.js`: `GET /` (mapa achatado `{id_turma: vagas}`) e `PUT /:idTurma` (valida `idTurma` inteiro e `vagas` inteiro entre 0 e 25 via Joi, responde `{ id_turma, vagas }`, rejeita inválidos com 400)
- [x] 2.4 Montar a rota em `backend/server.js`: `app.use('/api/vagas', require('./routes/api/vagas'))`
- [x] 2.5 Confirmar que `VagasService`/`routes/api/vagas.js` não importam `config/database.js` nem o pool MySQL em nenhum ponto
- [x] 2.6 Atualizar `backend/API.md` e `backend/tests.http` com os novos endpoints

## 3. Frontend: API e hook de vagas

- [x] 3.1 Adicionar helper `put(path, body)` em `frontend/src/api/client.js` (mesmo padrão do `get`, método PUT, JSON body, erro via `body.erro`)
- [x] 3.2 Criar `frontend/src/api/vagas.js` com `getVagas()` e `setVagas(idTurma, vagas)`
- [x] 3.3 Criar `frontend/src/hooks/useVagas.js`: busca o mapa completo ao montar, mantém estado `vagas`/`vagasEmEdicao`, expõe `handleVagasChange` e `handleVagasSalvar` com atualização otimista e rollback em caso de erro

## 4. Frontend: coluna Vagas no Dashboard

- [x] 4.1 Adicionar item `vagas` ao array `colunas` de `Dashboard.jsx`, entre `situacao` e `alunosMatriculados`
- [x] 4.2 Adicionar `<td>` correspondente no `<tbody>` com `<input type="number" min="0" max="25">`, `onBlur`/`onKeyDown(Enter)` disparando `handleVagasSalvar`, e `onClick={(e) => e.stopPropagation()}` no `<td>` para não disparar a navegação da linha
- [x] 4.3 Adicionar item "Vagas" em `colunasExportacao`, na mesma posição
- [x] 4.4 Confirmar que a coluna participa da ordenação existente (`compararValores`) sem lógica adicional

## 5. Validação manual

- [x] 5.1 Turma nunca editada exibe "Vagas" = `0`
- [x] 5.2 Editar o valor, sair do campo, dar refresh e confirmar que o valor persiste
- [x] 5.3 Tentar valores inválidos (negativo, texto, > 25) e confirmar rejeição sem quebrar a tela, e sem persistir o valor inválido
- [x] 5.4 Confirmar que clicar/editar o campo de Vagas não navega para `/turmas/:idTurma`
- [x] 5.5 Confirmar que a coluna Vagas ordena corretamente (incluindo turmas com `0`) e aparece na exportação Excel
- [x] 5.6 Confirmar, lendo o código, que nenhuma chamada ao MySQL foi introduzida para vagas — apenas `fs`/JSON local
