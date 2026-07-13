## 1. Adotar dotenvx

- [x] 1.1 Instalar `@dotenvx/dotenvx` como dependência em `backend/package.json`
- [x] 1.2 Trocar `require('dotenv').config()` por `require('@dotenvx/dotenvx').config()` em `backend/server.js`
- [x] 1.3 ~~Confirmar que `backend/config/env.js` não precisa de nenhuma mudança~~ — corrigido: a validação 4.3 revelou que `dotenvx` não lança erro na falta da chave privada (deixa `encrypted:...` vazar em `process.env`); `validateEnv()` ganhou checagem extra para esse caso (ver design.md)

## 2. Criptografar o .env existente

- [x] 2.1 Rodar `npx dotenvx encrypt` dentro de `backend/`, gerando `.env` cifrado e `backend/.env.keys`
- [x] 2.2 Confirmar visualmente que `DB_PASSWORD` (e as demais variáveis) aparecem como `encrypted:...` no `.env`, não mais em texto puro
- [x] 2.3 Confirmar/adicionar `backend/.env.keys` no `.gitignore` (raiz e `backend/`)

## 3. Documentação

- [x] 3.1 Atualizar `backend/README.md`, seção "Configuração": novo fluxo (receber `.env` cifrado + `.env.keys` por canais separados, em vez de preencher senha em texto puro em `cp .env.example .env`)
- [x] 3.2 Adicionar nota breve no mesmo README sobre como gerar um novo par de chaves caso a credencial precise ser rotacionada no futuro (`npx dotenvx encrypt`)

## 4. Validação end-to-end

- [x] 4.1 Subir o servidor (`npm run dev`) com o `.env` cifrado e `.env.keys` presentes; confirmar log de inicialização normal
- [x] 4.2 Fazer uma chamada real (`curl http://localhost:3000/api/filtros/projetos`) e confirmar que retorna dados do MySQL — prova que a decifragem funcionou em runtime
- [x] 4.3 Renomear/mover temporariamente `backend/.env.keys` e tentar subir o servidor de novo — deve falhar na inicialização com mensagem clara, não com erro obscuro
- [x] 4.4 Restaurar `backend/.env.keys` e confirmar que volta a funcionar
- [x] 4.5 Rodar `git status` e confirmar que `.env` e `.env.keys` não aparecem como rastreáveis para commit
