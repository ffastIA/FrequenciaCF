## Why

Para calcular o percentual de ocupação de uma turma numa spec futura, é preciso saber quantas vagas ela tem disponíveis — um dado que não existe no banco `CentroFormacao` e que o projeto não pode gravar lá (o banco é somente leitura). É preciso um lugar para o usuário registrar e reaproveitar esse número por turma, fora do MySQL.

## What Changes

- Nova coluna **"Vagas"** editável na tabela de Turmas do Dashboard principal, posicionada entre a coluna "Situação" e a coluna "Alunos Matriculados".
- Enquanto o usuário não definir um valor para uma turma, a coluna exibe `0`.
- Toda edição é salva automaticamente (ao perder foco do campo ou pressionar Enter) e recuperada na próxima vez que a tela for carregada.
- O valor é validado como inteiro entre `0` e `25`; valores fora dessa faixa são rejeitados.
- Novo mecanismo de persistência local no backend: arquivo `backend/data/vagas.json` (versionado no git, iniciando vazio `{}`), mantido inteiramente fora do MySQL.
- Dois novos endpoints: `GET /api/vagas` (lê o mapa completo de vagas por turma) e `PUT /api/vagas/:idTurma` (grava o valor de uma turma).
- **Amend documentado** em duas regras existentes do projeto para abrir uma exceção pontual e explícita, restrita a este armazenamento local (nunca ao MySQL):
  - CLAUDE.md: a regra "todas as rotas em `backend/routes/api/` devem ser GET" passa a ser explicitamente escopada à proteção do MySQL; rotas que operam apenas sobre arquivo local podem usar outros verbos.
  - Spec `frontend-dashboard`: o requirement "Frontend consome somente endpoints de leitura" passa a permitir, como única exceção, a chamada `PUT /api/vagas/:idTurma`.
- Coluna "Vagas" também passa a integrar a ordenação da tabela e a exportação para Excel, como as demais colunas visíveis.
- Fora de escopo: o cálculo do percentual de ocupação em si (fica para uma spec futura, que consumirá este dado).

## Capabilities

### New Capabilities
- `vagas-turma`: armazenamento local (arquivo JSON) do número de vagas por turma, com os endpoints de leitura e escrita e as regras de validação (inteiro 0–25, default 0).

### Modified Capabilities
- `frontend-dashboard`: a tabela de Turmas ganha a coluna "Vagas" (posição, edição, default, participação na ordenação e na exportação Excel); o requirement "Frontend consome somente endpoints de leitura" ganha uma exceção explícita e restrita para `PUT /api/vagas/:idTurma`.

## Impact

- **Backend**: novo arquivo de dados `backend/data/vagas.json`; novo `backend/services/VagasService.js`; nova rota `backend/routes/api/vagas.js` montada em `backend/server.js`; atualização de `backend/API.md` e `backend/tests.http`.
- **Frontend**: novo helper `put` em `frontend/src/api/client.js`; novo `frontend/src/api/vagas.js`; novo hook `frontend/src/hooks/useVagas.js`; alterações em `frontend/src/pages/Dashboard.jsx` (array `colunas`, `<tbody>`, `colunasExportacao`).
- **Documentação de regras do projeto**: `CLAUDE.md` (texto da regra de rotas GET-only) e a spec `frontend-dashboard` (requirement de somente-leitura do frontend).
- **Banco de dados**: nenhum impacto — nenhuma escrita é adicionada ao MySQL em nenhuma camada.
