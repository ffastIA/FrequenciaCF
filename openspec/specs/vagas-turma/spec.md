# Capability: vagas-turma

## Purpose

Persistência e API de leitura/escrita do número de vagas disponíveis por turma, mantida inteiramente fora do banco `CentroFormacao` (MySQL) num arquivo JSON local do backend.

## Requirements

### Requirement: Persistência de vagas em arquivo local, nunca no MySQL
O número de vagas disponíveis de cada turma SHALL ser armazenado exclusivamente num arquivo JSON local do backend (`backend/data/vagas.json`), indexado por `id_turma`. Este armazenamento SHALL NOT em nenhuma hipótese gravar no banco `CentroFormacao` (MySQL) — a camada responsável por vagas SHALL NOT importar ou utilizar o pool de conexão MySQL. Enquanto uma turma não tiver um valor definido no arquivo, seu número de vagas SHALL ser considerado `0`.

#### Scenario: Turma sem valor definido assume 0
- **WHEN** uma turma não possui nenhuma entrada no arquivo `vagas.json`
- **THEN** o número de vagas dessa turma é considerado `0`

#### Scenario: Persistência não usa o MySQL
- **WHEN** o valor de vagas de uma turma é lido ou gravado
- **THEN** nenhuma consulta ou comando é executado contra o banco `CentroFormacao`; a operação é inteiramente um acesso a arquivo local

### Requirement: Endpoint de leitura de vagas
O backend SHALL expor `GET /api/vagas`, retornando um mapa de todas as turmas com vagas definidas (`{ "<id_turma>": <vagas> }`). Turmas sem entrada no arquivo SHALL NOT aparecer no mapa retornado — a ausência é o sinal de que o valor é o default `0`. Se o arquivo `vagas.json` estiver ausente, vazio ou corrompido, o endpoint SHALL responder com um mapa vazio (`{}`) em vez de erro.

#### Scenario: Mapa completo retornado
- **WHEN** o arquivo `vagas.json` contém valores para uma ou mais turmas
- **THEN** `GET /api/vagas` retorna um objeto JSON com uma chave por `id_turma` armazenado e o respectivo número de vagas

#### Scenario: Arquivo vazio ou ausente não gera erro
- **WHEN** o arquivo `vagas.json` está vazio (`{}`), ausente ou não pôde ser interpretado como JSON válido
- **THEN** `GET /api/vagas` responde com status de sucesso e corpo `{}`, sem erro 500

### Requirement: Endpoint de escrita de vagas
O backend SHALL expor `PUT /api/vagas/:idTurma`, recebendo no corpo da requisição `{ "vagas": <number> }`. O valor de `vagas` SHALL ser validado como número inteiro entre `0` e `25` (inclusive); requisições com valor ausente, não-inteiro, negativo ou maior que `25` SHALL ser rejeitadas com status `400`, sem alterar o arquivo. Uma requisição válida SHALL persistir o novo valor no arquivo `vagas.json` e responder com o valor persistido.

#### Scenario: Atualização válida é persistida
- **WHEN** o cliente envia `PUT /api/vagas/123` com `{ "vagas": 20 }`
- **THEN** o backend responde com sucesso confirmando o valor `20`, e uma chamada subsequente a `GET /api/vagas` inclui `"123": 20`

#### Scenario: Valor negativo é rejeitado
- **WHEN** o cliente envia `PUT /api/vagas/:idTurma` com `{ "vagas": -1 }`
- **THEN** o backend responde `400` e o arquivo `vagas.json` permanece inalterado

#### Scenario: Valor acima do limite é rejeitado
- **WHEN** o cliente envia `PUT /api/vagas/:idTurma` com `{ "vagas": 26 }`
- **THEN** o backend responde `400` e o arquivo `vagas.json` permanece inalterado

#### Scenario: Valor não-inteiro é rejeitado
- **WHEN** o cliente envia `PUT /api/vagas/:idTurma` com `{ "vagas": "abc" }` ou um número fracionário
- **THEN** o backend responde `400` e o arquivo `vagas.json` permanece inalterado

### Requirement: Escritas concorrentes não perdem atualizações
Ao gravar o valor de vagas de uma turma, o backend SHALL serializar as escritas no arquivo `vagas.json` dentro do processo, de forma que duas requisições de escrita para turmas diferentes, mesmo que concorrentes, SHALL NOT resultar em uma sobrescrevendo o efeito da outra.

#### Scenario: Duas escritas concorrentes para turmas diferentes preservam ambas
- **WHEN** duas requisições `PUT` para `id_turma` diferentes chegam em rápida sucessão, antes que a primeira termine de escrever o arquivo
- **THEN** ao final, o arquivo `vagas.json` reflete os dois valores gravados, sem que um tenha sido perdido
