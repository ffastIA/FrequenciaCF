## MODIFIED Requirements

### Requirement: Configuração de ambiente validada
O sistema SHALL validar, ao iniciar (`backend/config/env.js`), que as variáveis obrigatórias (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) estão definidas, interrompendo a inicialização com mensagem clara caso alguma esteja ausente. O carregamento do `.env` SHALL ser feito via `@dotenvx/dotenvx`, que SHALL suportar tanto um `.env` em texto puro (compatibilidade retroativa) quanto um `.env` com valores criptografados, decifrados em tempo de execução a partir de `DOTENV_PRIVATE_KEY` (definida em `backend/.env.keys`, um arquivo separado que SHALL NOT ser commitado). Quando o `.env` estiver criptografado e a chave privada correspondente não estiver disponível, o processo SHALL falhar na inicialização com mensagem clara, da mesma forma que falha hoje quando uma variável obrigatória está ausente.

#### Scenario: Variável de ambiente ausente
- **WHEN** o servidor é iniciado sem `DB_PASSWORD` definida no `.env`
- **THEN** o processo falha na inicialização com uma mensagem de erro indicando qual variável está faltando, em vez de falhar silenciosamente numa query posterior

#### Scenario: .env criptografado com chave privada disponível
- **WHEN** o servidor é iniciado com um `.env` cujos valores estão criptografados e `backend/.env.keys` presente com a `DOTENV_PRIVATE_KEY` correspondente
- **THEN** os valores são decifrados em `process.env` antes da validação, e o servidor inicia normalmente, com o mesmo comportamento de quando o `.env` está em texto puro

#### Scenario: .env criptografado sem a chave privada
- **WHEN** o servidor é iniciado com um `.env` cujos valores estão criptografados, mas `backend/.env.keys` está ausente ou incorreto
- **THEN** o processo falha na inicialização com uma mensagem de erro indicando quais variáveis não puderam ser decifradas, sem prosseguir com valores cifrados (literalmente `encrypted:...`) tratados como se fossem credenciais válidas — o `@dotenvx/dotenvx` sozinho não lança erro nesse caso (deixa o valor cifrado vazar como string em `process.env`), então `backend/config/env.js` SHALL detectar valores com prefixo `encrypted:` nas variáveis obrigatórias e tratá-los como falha de validação, com a mesma severidade de uma variável ausente

#### Scenario: Compatibilidade com .env em texto puro
- **WHEN** o servidor é iniciado com um `.env` tradicional, não criptografado (comportamento anterior a esta change)
- **THEN** o servidor inicia normalmente, sem exigir `.env.keys` nem nenhuma mudança de configuração adicional
