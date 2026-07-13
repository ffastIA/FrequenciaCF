## Context

`backend/server.js:3` carrega o `.env` via `require('dotenv').config()`. `backend/config/env.js` valida, logo em seguida, que `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD` estão presentes em `process.env`, falhando a inicialização com mensagem clara se alguma estiver ausente (`openspec/specs/backend-setup/spec.md`, requisito "Configuração de ambiente validada"). O projeto já depende de `dotenv@17` (`backend/package.json`), que nas versões recentes já anuncia o ecossistema `dotenvx` como evolução natural.

Motivador direto: entrega definitiva do sistema para outra pessoa operar, sem que o responsável atual tenha como criar uma credencial MySQL dedicada para ela (sem acesso de admin ao `prod.idear.org.br`) nem trocar a senha compartilhada unilateralmente.

## Goals / Non-Goals

**Goals:**
- `.env` deixa de conter a senha do MySQL em texto puro; pode ser compartilhado/transportado sem expor a credencial diretamente.
- Nenhuma mudança de comportamento do servidor, das rotas ou do guard de somente-leitura — só a forma como o `.env` é carregado.
- Documentação clara de como configurar o backend a partir de um `.env` cifrado + `.env.keys`.

**Non-Goals:**
- Criar um usuário MySQL dedicado/só-leitura para a outra pessoa — fora do controle técnico deste projeto (depende de acesso de administrador que o responsável não tem hoje).
- Adotar um gerenciador de segredos externo (1Password, Doppler, Infisical) — solução mais robusta para o futuro, mas exige conta/setup de equipe; fora de escopo desta entrega pontual.
- Rotacionar a senha do MySQL em si — a senha continua a mesma; esta change protege como ela é **transportada**, não a credencial em si.

## Decisions

1. **`@dotenvx/dotenvx` em vez de gerenciador de segredos externo**: resolve diretamente o problema (não expor a senha em texto puro ao entregar o arquivo) sem exigir conta paga, setup de equipe ou dependência de serviço externo em runtime — o backend continua rodando 100% offline/local, como hoje. `dotenvx` é um superset compatível de `dotenv` (mesma chamada `.config()`), então a troca é uma linha em `server.js` mais a criptografia do arquivo, sem tocar em `config/env.js` nem em nenhum model/rota.

2. **Chave privada em arquivo separado (`.env.keys`), nunca commitado**: é o padrão do próprio `dotenvx encrypt`. Mantém o segredo sensível pequeno e isolado do `.env` (que pode, se quiser, ser versionado ou compartilhado livremente já cifrado) — reduz a superfície do que precisa de canal seguro, de "arquivo inteiro com senha de produção" para "uma chave privada de algumas linhas".

3. **`config/env.js` ganha uma checagem adicional (descoberta durante a validação end-to-end)**: inicialmente a expectativa era que `config/env.js` não precisasse mudar, já que a validação opera sobre `process.env`. Na prática, `@dotenvx/dotenvx` **não lança erro** quando falta a chave privada — ele registra um warning `DECRYPTION_FAILED` no console mas deixa o valor cifrado (`encrypted:...`) vazar como string literal em `process.env`, e a checagem original (`!process.env[name]`) não pega isso, porque a string cifrada é "verdadeira"/não-vazia. Sem correção, o servidor subia normalmente com credenciais inutilizáveis (ex.: tentando escutar em `http://localhost:encrypted:BB3E...`). `validateEnv()` agora também rejeita qualquer variável obrigatória cujo valor comece com `encrypted:`, com mensagem apontando para `backend/.env.keys`.

4. **Entrega da chave privada é processo, não código**: `.env` cifrado pode ir por qualquer canal; `.env.keys` precisa de canal separado e seguro (cofre de senhas compartilhado, link de segredo único, ou verbalmente) — documentado no `README.md`, não automatizado (não há como este projeto garantir automaticamente um canal seguro de entrega humana).

## Risks / Trade-offs

- [Ainda existe um segredo para proteger (`DOTENV_PRIVATE_KEY`)] → Menor e mais fácil de proteger/rotacionar que a senha inteira do banco de produção; não é "zero segredo", é redução de superfície.
- [Não resolve controle de acesso granular] → Documentado explicitamente como fora de escopo; recomendação registrada no `proposal.md` de buscar um usuário MySQL dedicado quando possível.
- [Dependência nova (`@dotenvx/dotenvx`)] → Pacote leve, mantém compatibilidade total com a API de `dotenv` já usada; sem mudança de comportamento para quem já roda o projeto com `.env` em texto puro (o `dotenvx` também sabe ler `.env` não criptografado, então não há regressão se alguém ainda tiver um `.env` antigo).

## Migration Plan

Mudança local ao backend, sem afetar frontend nem banco de dados. Após a mudança: gerar novo `.env` cifrado + `.env.keys` localmente, testar a decifragem, e só então entregar os dois arquivos (por canais separados) para a outra pessoa. Rollback: reverter `server.js` e voltar a usar um `.env` em texto puro (o `dotenv` original continua instalado como dependência transitiva, mas o ideal é manter `dotenvx` já que é compatível).

## Open Questions

Nenhuma.
