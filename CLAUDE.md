# FrequenciaCF

Sistema de acompanhamento de frequência do Centro de Formação, sobre o banco `CentroFormacao` (MySQL, produção, `prod.idear.org.br`).

## Regra crítica: banco de dados é somente leitura

**A única interação permitida com o banco de dados é leitura (`SELECT`). Nunca escrever, alterar ou apagar dados no banco — em nenhuma camada, endpoint, script ou ferramenta deste projeto.**

Proibido, sem exceção, mesmo em scripts auxiliares, migrations, seeds ou tarefas administrativas:
- `INSERT`, `UPDATE`, `DELETE`, `REPLACE`
- `CREATE`, `ALTER`, `DROP`, `TRUNCATE`
- Qualquer outro comando que modifique schema ou dados

**Por quê:** o banco `CentroFormacao` é de produção e compartilhado com outros sistemas; não há ambiente de staging. Uma escrita acidental pode corromper dados reais usados por outras aplicações.

**Como isso é aplicado:**
- `backend/config/database.js` envolve o pool MySQL com um guard (`assertReadOnly`) que bloqueia, em tempo de execução, qualquer query cujo texto não comece com `SELECT`/`SHOW`/`EXPLAIN`/`DESCRIBE` — inclusive em conexões obtidas diretamente via `pool.getConnection()`. Isso vale mesmo que um model ou rota futura tente executar uma escrita por engano.
- Rotas que leem ou escrevem no MySQL devem ser sempre `GET`. Rotas que operam exclusivamente sobre armazenamento local em arquivo (fora do MySQL — ex.: um JSON local no backend) podem usar outros verbos HTTP (`PUT`/`POST`/`PATCH`), desde que documentadas explicitamente como não tocando o banco (ver `openspec/changes/vagas-turma-json/` para o primeiro exemplo). Nunca adicionar `POST`/`PUT`/`PATCH`/`DELETE` que gravem no MySQL.
- Ao adicionar novos models ou queries, sempre use `SELECT` parametrizado (`?`) — nunca concatenar valores diretamente na string SQL.
- Se uma funcionalidade futura genuinamente precisar escrever no banco (ex.: lançar frequência), isso exige decisão explícita do responsável pelo projeto — não implementar unilateralmente. Trate como uma mudança de escopo que precisa ser combinada antes.

## Estrutura do projeto

- `metadata.json`, `schema_summary.md` — dump do schema do banco (75 tabelas), fonte de verdade para nomes de colunas/PKs/FKs.
- `IMPLEMENTATION_GUIDE.md` — guia de implementação do backend (Phase 1: Setup + Models).
- `openspec/` — planejamento das changes (proposal/design/specs/tasks) via OpenSpec. Ver `openspec/changes/backend-phase1-setup/` para a Phase 1.
- `backend/` — API Node.js/Express somente leitura (ver `backend/README.md` e `backend/API.md`).

## Fluxo de trabalho

Mudanças de escopo (novas fases, novos endpoints, mudanças de comportamento) devem passar pelo fluxo OpenSpec (`/opsx:propose` → revisão do usuário → `/opsx:apply`) antes de gerar código. Não implementar automaticamente sem revisão explícita do usuário.
