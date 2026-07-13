## Why

O sistema vai ser entregue para outra pessoa operar e manter permanentemente, o que exige instalar o `backend/.env` (com a senha do MySQL de produção) na máquina dela. Duas restrições tornam isso sensível:

- O responsável pelo projeto **não tem acesso de administrador ao MySQL** (`prod.idear.org.br`) e não pode criar um usuário dedicado, só-leitura, para essa pessoa — está preso à única credencial já usada no projeto.
- Essa credencial é **compartilhada com outros sistemas** (ver `CLAUDE.md`), então não pode ser trocada unilateralmente sem coordenar com quem mais depende dela.

Hoje, entregar o `.env` significa entregar a senha do banco de produção em texto puro dentro de um arquivo. Não há como evitar que a outra pessoa tenha, em algum momento, acesso à credencial — mas é possível evitar que ela precise transitar em **texto puro** por e-mail, chat ou qualquer meio de transporte do arquivo.

## What Changes

- **Adoção de `@dotenvx/dotenvx`** no backend, substituindo o carregamento atual via `dotenv` puro (`backend/server.js`). `dotenvx` é compatível com a mesma API (`.config()`), então não muda nenhum outro comportamento do servidor.
- **`backend/.env` passa a ser criptografado**: os valores (incluindo `DB_PASSWORD`) são cifrados com um par de chaves pública/privada gerado pelo `dotenvx`. O arquivo `.env` cifrado pode transitar por qualquer canal sem expor a senha.
- **Nova chave privada em `backend/.env.keys`**, gerada localmente pelo `dotenvx encrypt`, nunca commitada — é o único artefato que ainda precisa de um canal seguro para ser entregue (bem menor e mais fácil de proteger/rotacionar que a senha do banco inteira).
- **`backend/config/env.js` continua validando as mesmas 5 variáveis obrigatórias**, sem mudança de lógica — no momento em que a validação roda, os valores já foram decifrados para `process.env` pelo `dotenvx`.
- **Documentação de deploy atualizada** (`backend/README.md`), descrevendo o novo fluxo de configuração (receber `.env` cifrado + `.env.keys` por canais separados, em vez de preencher senha em texto puro).

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `backend-setup`: o carregamento/validação de variáveis de ambiente passa a suportar `.env` criptografado via `dotenvx`.

## Impact

- **Backend alterado**: `backend/package.json` (nova dependência `@dotenvx/dotenvx`), `backend/server.js` (troca do loader), `backend/.env` (recriptografado localmente, não commitado), `backend/.env.keys` (novo, nunca commitado), `backend/README.md`.
- **`.gitignore`** (raiz e `backend/`): confirmar/adicionar `.env.keys`.
- **Sem mudança de comportamento da API** nem do guard de somente-leitura (`backend/config/database.js` não é tocado).
- **Não substitui** a necessidade de, quando possível, pedir a quem administra o MySQL um usuário dedicado e só-leitura para a outra pessoa — essa change resolve o transporte seguro da credencial atual, não o controle de acesso granular (fora do escopo técnico deste projeto, depende de terceiros).
