# IMPLEMENTATION_GUIDE.md - Backend Phase 1: Setup + Models

## 📋 VISÃO GERAL DA IMPLEMENTAÇÃO

**Change:** `backend-phase1-setup`  
**Duração Estimada:** 3 dias (24 horas)  
**Responsável:** Backend Engineer  
**Objetivo:** Configurar Node.js + Express + MySQL + 9 Models de dados

---

## ✅ PRÉ-REQUISITOS

- [ ] Node.js 18+ instalado (`node --version`)
- [ ] npm 9+ instalado (`npm --version`)
- [ ] Acesso ao MySQL: `prod.idear.org.br:41231`
- [ ] Credenciais: DB_USER=fernandofasti, DB_PASSWORD=centroFernandoBi@
- [ ] Git configurado no projeto
- [ ] Editor de código (VS Code)

---

## 🎯 FASES DE IMPLEMENTAÇÃO

### FASE 1: SETUP INICIAL (2 horas)

**Tarefas:**
1. Criar pasta `backend/` na raiz do projeto
2. Inicializar `npm init` e gerar `package.json`
3. Instalar dependências base:
   ```bash
   npm install express mysql2 dotenv joi cors
   npm install --save-dev nodemon
   ```
4. Utilizar `.env` com credenciais (não commitar)
5. Criar `.env.example` (template sem senha)
6. Configurar scripts no `package.json`:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```
7. Atualizar `.gitignore` para excluir `.env` e `node_modules/`

**Validação:**
```bash
npm install
npm run dev
# Esperado: "Servidor rodando em http://localhost:3000"
```

---

### FASE 2: CONFIGURAÇÃO DO BANCO (1 hora)

**Tarefas:**
1. Criar pasta `backend/config/`
2. Criar `backend/config/database.js`:
   ```javascript
   const mysql = require('mysql2/promise');

   const pool = mysql.createPool({
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0,
     enableKeepAlive: true,
     keepAliveInitialDelayMs: 0,
   });

   module.exports = pool;
   ```

3. Criar `backend/config/env.js`:
   - Validar que todas as env vars necessárias estão definidas
   - Executar ao iniciar `server.js`

4. Testar conexão com banco:
   ```bash
   node -e "require('./config/database').getConnection().then(c => {console.log('OK'); c.release();})"
   ```

**Validação:**
- Console exibe "OK" sem erros
- Pool de 10 conexões ativo

---

### FASE 3: ESTRUTURA DO SERVIDOR (1 hora)

**Tarefas:**
1. Criar pastas:
   ```
   backend/
   ├── config/
   ├── models/
   ├── services/
   ├── routes/
   ├── middleware/
   └── utils/
   ```

2. Criar `backend/server.js`:
   ```javascript
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();
   require('./config/env');

   const app = express();

   // Middleware
   app.use(cors());
   app.use(express.json());

   // Erro handler
   app.use(require('./middleware/errorHandler'));

   // Iniciar
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => {
     console.log(`Servidor rodando em http://localhost:${PORT}`);
   });

   module.exports = app;
   ```

3. Criar `backend/middleware/errorHandler.js`:
   ```javascript
   module.exports = (err, req, res, next) => {
     console.error('[ERROR]', new Date().toISOString(), err.message);
     res.status(500).json({
       erro: 'Erro interno do servidor',
       message: process.env.NODE_ENV === 'development' ? err.message : undefined
     });
   };
   ```

**Validação:**
```bash
npm run dev
# Esperado: "Servidor rodando em http://localhost:3000"
```

---

### FASE 4: IMPLEMENTAR 9 MODELS (6 horas)

Cada model segue este padrão:

```javascript
class NomeModel {
  constructor(pool) {
    this.pool = pool;
  }

  async query(sql, params = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }

  // Métodos específicos da entidade
}

module.exports = NomeModel;
```

**Models a implementar:**

#### 4.1 - `backend/models/Projeto.js`
- `getProjetos()` → SELECT * FROM projeto
- `getProjetoById(id)` → SELECT * FROM projeto WHERE id = ?

#### 4.2 - `backend/models/ProjetoAditivo.js`
- `getAditivosPorProjeto(idProjeto)` → SELECT * FROM projeto_aditivo WHERE id_projeto = ?

#### 4.3 - `backend/models/MetaTurma.js`
- `getMetasPorAditivo(idProjetoAditivo)` → SELECT * FROM meta_turma WHERE id_projeto_aditivo = ?

#### 4.4 - `backend/models/Turma.js`
- `getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, filtros)` → JOIN complexo retornando turmas
  - Filtro adicional: `status` (situação da turma) → coluna `turma.status` smallint(6) NOT NULL DEFAULT '0'
    - 0: não especificado / 1: não iniciada / 2: iniciada / 3: concluída / 4: cancelada
- `getTurmaById(id)` → SELECT * FROM turma WHERE id = ?

#### 4.5 - `backend/models/Instrutor.js`
- `getInstrutoresPorTurmas(idTurmas[])` → SELECT * FROM instrutor WHERE id IN (...)
- `getInstrutorById(id)` → SELECT * FROM instrutor WHERE id = ?

#### 4.6 - `backend/models/Aula.js`
- `getAulasPorTurma(idTurma, dataInicio, dataFim)` → SELECT * FROM aula WHERE id_turma = ? AND data BETWEEN ? AND ?
- `getAulasRealizadas(idTurmas[], dataInicio, dataFim)` → com filtro de status

#### 4.7 - `backend/models/Aluno.js`
- `getAlunosPorTurma(idTurma)` → SELECT * FROM aluno WHERE id_turma = ?
- `getAlunoById(id)` → SELECT * FROM aluno WHERE id = ?

#### 4.8 - `backend/models/Frequencia.js`
- `getFrequenciasPorTurma(idTurma, dataInicio, dataFim)` → SELECT * FROM frequencia com JOINs
- `getFrequenciasNaoLancadas(idTurmas[], dataInicio, dataFim)` → Identificar frequências não lançadas

#### 4.9 - `backend/models/Curso.js`
- `getCursoPorTurma(idTurma)` → SELECT * FROM curso WHERE id = (SELECT id_curso FROM turma WHERE id = ?)

**Validação:**
- Cada model importa sem erros em `server.js`
- Query de teste retorna dados válidos
- Performance < 1s por query

---

### FASE 5: IMPLEMENTAR FILTER SERVICE (3 horas)

**Arquivo:** `backend/services/FiltroService.js`

```javascript
class FiltroService {
  constructor(projetoModel, aditivoModel, metaModel, turmaModel, instrutorModel) {
    this.projeto = projetoModel;
    this.aditivo = aditivoModel;
    this.meta = metaModel;
    this.turma = turmaModel;
    this.instrutor = instrutorModel;
  }

  // Cascata 1
  async getProjetos() { }

  // Cascata 2
  async getAditivosPorProjeto(idProjeto) { }

  // Cascata 3
  async getMetasPorAditivo(idProjetoAditivo) { }

  // Cascata 4 - Núcleo da lógica
  async getTurmasPorProjetoAditivo(idProjeto, idProjetoAditivo, idMeta, idInstrutor) { }

  // Cascata 5
  async getInstrutoresPorTurmas(idTurmas) { }
}
```

**Validação:**
- Cada método retorna dados estruturados
- Cascata: Projeto → Aditivo → Meta → Turmas → Instrutores

---

### FASE 6: IMPLEMENTAR ROUTES DE FILTROS (2 horas)

**Arquivo:** `backend/routes/api/filtros.js`

Endpoints obrigatórios:
```
GET /api/filtros/projetos
GET /api/filtros/aditivios?idProjeto=X
GET /api/filtros/metas?idProjetoAditivo=X
GET /api/filtros/turmas?idProjeto=X&idProjetoAditivo=Y&idMeta=Z&idInstrutor=W
GET /api/filtros/instrutores?idTurmas=1,2,3
```

Validação com Joi:
- `idProjeto`: number, obrigatório
- `idProjetoAditivo`: number, obrigatório
- `idMeta`: number, opcional
- `idInstrutor`: number, opcional

**Validação:**
```bash
# Testar cada endpoint com Postman/curl
curl http://localhost:3000/api/filtros/projetos
curl "http://localhost:3000/api/filtros/aditivios?idProjeto=1"
```

---

### FASE 7: TESTES INTEGRADOS (2 horas)

**Arquivo de teste:** `backend/tests.http` (Rest Client) ou Postman collection

Testes essenciais:
1. GET /api/filtros/projetos → lista de projetos
2. GET /api/filtros/aditivios?idProjeto=1 → aditivios do projeto 1
3. GET /api/filtros/metas?idProjetoAditivo=1 → metas do aditivo 1
4. GET /api/filtros/turmas?idProjeto=1&idProjetoAditivo=1 → turmas
5. Performance check: cada query < 1s

**Validação:**
- Todos os testes retornam status 200
- Respostas contêm estrutura JSON esperada
- Nenhum erro de SQL

---

### FASE 8: DOCUMENTAÇÃO (1 hora)

**Arquivos a criar:**

1. `backend/README.md` - Como usar o backend
2. `backend/API.md` - Documentação de endpoints
3. Atualizar root `README.md` com instruções

**Conteúdo esperado:**
- Como instalar dependências
- Como configurar .env
- Como rodar localmente
- Exemplos de cada endpoint
- Estrutura de pastas

---

## 🔍 CRITÉRIOS DE ACEITAÇÃO

- ✅ Servidor Express inicia sem erros (`npm run dev`)
- ✅ Conexão MySQL funciona (pool de 10 conexões)
- ✅ Todos os 9 models implementados
- ✅ FiltroService retorna dados corretos
- ✅ 5 endpoints de filtros funcionam (cascata OK)
- ✅ Validação com Joi ativa em todas as rotas
- ✅ Tratamento de erro global ativo
- ✅ Performance: cada query < 1s
- ✅ Documentação completa

---

## 📊 ESTRUTURA FINAL

Ao final desta fase, o projeto deve ter:

```
backend/
├── config/
│   ├── database.js
│   └── env.js
├── models/
│   ├── Projeto.js
│   ├── ProjetoAditivo.js
│   ├── MetaTurma.js
│   ├── Turma.js
│   ├── Instrutor.js
│   ├── Aula.js
│   ├── Aluno.js
│   ├── Frequencia.js
│   └── Curso.js
├── services/
│   └── FiltroService.js
├── routes/
│   └── api/
│       └── filtros.js
├── middleware/
│   └── errorHandler.js
├── server.js
├── package.json
├── .env (não commitar)
├── .env.example
├── README.md
├── API.md
└── tests.http (ou Postman collection)
```

---

## 🚀 PRÓXIMAS FASES

Após completar Phase 1:

**Phase 2: API de Métricas**
- Implementar services de métricas de faltas e de atraso de lançamento
- Implementar endpoints de cálculo
- Testes de performance com dataset real
- Detalhamento completo: ver seção "IMPLEMENTATION_GUIDE.md - Backend Phase 2: API de Métricas" ao final deste documento

**Frontend Phase 1-3**
- Consumir endpoints do backend
- Implementar dashboard interativo
- Detalhamento completo da Phase 1: ver seção "IMPLEMENTATION_GUIDE.md - Frontend Phase 1: Dashboard de Turmas" ao final deste documento

**Phase 3: Exportação de Dados** (deixada por último, depois do frontend)
- Endpoints de export Excel (SheetJS)
- Endpoints de export PDF (jsPDF + html2pdf)

---

## 📝 NOTAS IMPORTANTES

1. **Segurança:** Nunca commitar `.env` com senhas
2. **Performance:** MySQL deve filtrar dados (WHERE/JOIN), não Node.js
3. **Dataset:** 562k frequências requerem índices no banco
4. **Conexões:** Pool de 10 é limite recomendado para este tamanho
5. **Testes:** Validar cada query com IDs reais do banco

---

## 🎓 REFERÊNCIAS

- Metadata: `metadata.json` (75 tabelas)
- Schema resumido: `schema_summary.md`
- Credenciais: `.env` (produção)
- Database: CentroFormacao (prod.idear.org.br:41231)

---

**Status:** Pronto para implementação  
**Última atualização:** 2026-07-12

---
---

# IMPLEMENTATION_GUIDE.md - Backend Phase 2: API de Métricas

## 📋 VISÃO GERAL DA IMPLEMENTAÇÃO

**Change:** `backend-phase2-metrics`
**Pré-requisito:** Phase 1 completa (`backend-phase1-setup`) — reutiliza `config/database.js` (guard somente-leitura), `models/Aula.js`, `models/Frequencia.js`, `models/Turma.js`, `middleware/errorHandler.js`.
**Objetivo:** Expor 3 indicadores de frequência sobre dados já existentes no banco — **somente leitura**, sem nenhuma escrita (ver regra em `CLAUDE.md`).

**Métricas:**
1. Quantidade de faltas por aluno por turma
2. Percentual de faltas por aluno por turma
3. Dias de atraso no lançamento de frequências pelo instrutor (por turma e agregado por instrutor)

---

## 🎯 DEFINIÇÕES E FÓRMULAS

Estas definições foram fechadas com o responsável do projeto e são vinculantes para a implementação — não inferir nem alterar sem confirmar antes.

### Conceitos comuns

- **Falta** = registro em `frequencia` com `presenca = 2` ("Faltou"). `presenca = 3` ("Falta justificada") **não** conta como falta.
- **Aula considerada** ("prevista") = qualquer linha de `aula` cuja `aula.data` esteja no intervalo de filtro, **independente do campo `aula.status`** (0 prevista / 1 realizada). O que importa é a data já ter passado, não se o instrutor marcou como realizada.
- **Data de referência do lançamento** = como `frequencia` não tem coluna de timestamp de quando foi lançada, usa-se `aula.data` como proxy: é a data em que a frequência daquela aula deveria ter sido registrada.
- **Aula sem frequência lançada** = aula dentro do período sem nenhuma linha correspondente em `frequencia` (nem para o aluno, nem para nenhum aluno da turma, dependendo da métrica — ver detalhe abaixo). Ela **entra no denominador** (é uma aula prevista) mas **não gera falta** no numerador. Este indicador é importante por si só (mostra atraso de lançamento) e deve aparecer explicitamente na resposta das métricas 1/2, alimentando também a métrica 3.

### Métrica 1 — Quantidade de faltas por aluno por turma

- Escopo: por par `(idAluno, idTurma)`.
- Filtro de datas: `dataInicio` (default: `turma.data_inicio`), `dataFim` (default: hoje). **`dataFim` efetivo é sempre `min(dataFim informado, hoje)`** — nunca considerar aulas futuras, mesmo que o usuário informe uma data futura no filtro.
- Base: todas as `aula` da turma com `aula.data BETWEEN dataInicio AND dataFimEfetivo`.
- Fórmula:
  ```sql
  SELECT COUNT(*) AS quantidade_faltas
  FROM frequencia f
  INNER JOIN aula au ON au.id_aula = f.id_aula
  WHERE au.id_turma = :idTurma
    AND f.id_aluno = :idAluno
    AND au.data BETWEEN :dataInicio AND :dataFimEfetivo
    AND f.presenca = 2
  ```

### Métrica 2 — Percentual de faltas por aluno por turma

- Mesmo escopo, filtro e base da Métrica 1.
- Denominador (`aulasPrevistas`):
  ```sql
  SELECT COUNT(*) AS aulas_previstas
  FROM aula au
  WHERE au.id_turma = :idTurma
    AND au.data BETWEEN :dataInicio AND :dataFimEfetivo
  ```
- `percentualFaltas = quantidadeFaltas / aulasPrevistas * 100`. Se `aulasPrevistas = 0` (turma sem nenhuma aula no período), retornar `percentualFaltas: null` (nunca dividir por zero).
- A resposta da API para as métricas 1 e 2 deve trazer os dois números juntos numa única chamada (evita duas queries redundantes), mais o indicador de pendência de lançamento:

  ```json
  {
    "idAluno": 123,
    "idTurma": 1597,
    "dataInicio": "2026-01-10",
    "dataFim": "2026-07-12",
    "aulasPrevistas": 42,
    "quantidadeFaltas": 5,
    "percentualFaltas": 11.9,
    "aulasSemFrequenciaLancada": 3
  }
  ```
  - `aulasSemFrequenciaLancada` = aulas da turma no período (não do aluno especificamente, já que a aula é da turma inteira) que ainda não têm **nenhuma** linha em `frequencia` para nenhum aluno — ou seja, o instrutor nem começou a lançar aquela aula:
    ```sql
    SELECT COUNT(*) FROM aula au
    WHERE au.id_turma = :idTurma
      AND au.data BETWEEN :dataInicio AND :dataFimEfetivo
      AND NOT EXISTS (SELECT 1 FROM frequencia f WHERE f.id_aula = au.id_aula)
    ```

### Métrica 3 — Dias de atraso no lançamento de frequências

Duas visões, ambas necessárias:

**(a) Por turma**
- Buscar a aula mais recente da turma (`MAX(aula.data)` com `aula.data <= hoje`) que já possui **pelo menos um** registro em `frequencia`.
- `diasAtraso = hoje - dataDaUltimaAulaLancada`.
- **Caso a turma nunca tenha tido nenhuma frequência lançada**: usar a aula mais antiga da turma com `aula.data <= hoje` como referência (ou seja, o atraso é contado desde a primeira aula que já deveria ter sido lançada e nunca foi).
- **Caso a turma não tenha nenhuma aula com `data <= hoje`**: retornar `diasAtraso: null` (turma ainda não começou).

**(b) Agregado por instrutor**
- Mesmo cálculo do item (a), mas agregando **todas as turmas cujo `turma.id_instrutor` seja o instrutor consultado** (usar `turma.id_instrutor`, o responsável oficial pela turma — não `aula.id_instrutor`, que é opcional/nullable e pode ser um substituto).
- `diasAtraso = hoje - MAX(data da última aula lançada entre todas as turmas do instrutor)`, com o mesmo fallback do item (a) quando não houver nenhum lançamento.

```json
// GET /api/metricas/atraso-lancamento/turma?idTurma=1597
{ "idTurma": 1597, "diasAtraso": 4, "dataReferencia": "2026-07-08" }

// GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=224
{ "idInstrutor": 224, "diasAtraso": 4, "dataReferencia": "2026-07-08" }
```

---

## 🎯 FASES DE IMPLEMENTAÇÃO

### FASE 2.1: EXTENSÃO DO MODEL FREQUENCIA (2 horas)

**Arquivo:** `backend/models/Frequencia.js` (estender o existente da Phase 1)

Novos métodos:
- `getFaltasEPrevistasPorAluno(idTurma, idAluno, dataInicio, dataFim)` → `{ quantidadeFaltas, aulasPrevistas }` (uma única query com `SUM(CASE WHEN presenca = 2 ...)`, evitando duas idas ao banco quando possível)
- `getAulasSemFrequenciaLancada(idTurma, dataInicio, dataFim)` → count (reaproveita a lógica de `getFrequenciasNaoLancadas` já existente da Phase 1, adaptando para contagem no período)
- `getUltimaAulaLancadaPorTurma(idTurma)` → `{ data } | null`
- `getPrimeiraAulaPorTurma(idTurma, dataLimite)` → `{ data } | null` (fallback quando nunca houve lançamento)
- `getUltimaAulaLancadaPorInstrutor(idInstrutor)` → `{ data } | null` (via JOIN `aula` → `turma` filtrando `turma.id_instrutor`)

**Validação:** cada método testado com IDs reais do banco, resultado consistente com os números vistos em `tests.http` da Phase 1.

### FASE 2.2: SERVICE DE MÉTRICAS (2 horas)

**Arquivo:** `backend/services/MetricasFrequenciaService.js`

```javascript
class MetricasFrequenciaService {
  constructor(frequenciaModel, turmaModel) {
    this.frequencia = frequenciaModel;
    this.turma = turmaModel;
  }

  async getFaltasPorAluno(idTurma, idAluno, dataInicio, dataFim) { }
  async getAtrasoLancamentoPorTurma(idTurma) { }
  async getAtrasoLancamentoPorInstrutor(idInstrutor) { }
}
```

Regras de negócio a aplicar no service (não deixar para a rota):
- Resolver `dataInicio` default = `turma.data_inicio` (buscar via `turmaModel.getTurmaById`).
- Capar `dataFim` em `min(dataFim, hoje)`.
- Tratar divisão por zero em `percentualFaltas`.
- Aplicar os fallbacks da Métrica 3 (turma sem lançamento nenhum / sem aula ainda).

### FASE 2.3: ROTAS DE MÉTRICAS (2 horas)

**Arquivo:** `backend/routes/api/metricas.js`, registrado em `server.js` como `app.use('/api/metricas', ...)`.

```
GET /api/metricas/faltas?idTurma=X&idAluno=Y&dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
GET /api/metricas/atraso-lancamento/turma?idTurma=X
GET /api/metricas/atraso-lancamento/instrutor?idInstrutor=X
```

Validação Joi:
- `idTurma`, `idAluno`, `idInstrutor`: number, obrigatórios conforme a rota.
- `dataInicio`, `dataFim`: `Joi.date().iso()`, opcionais (aplicar defaults no service, não na rota).

Todas as rotas são `GET` — nenhuma escrita, consistente com o guard de `config/database.js`.

### FASE 2.4: TESTES INTEGRADOS (2 horas)

- Adicionar casos em `backend/tests.http` para as 3 rotas novas.
- Casos obrigatórios:
  - Aluno com faltas e sem faltas no período.
  - Turma com `dataFim` futura informada no filtro → confirmar que não conta aulas além de hoje.
  - Turma com aulas sem nenhuma frequência lançada → `aulasSemFrequenciaLancada > 0` e falta = 0 para essas aulas.
  - Turma sem nenhum lançamento histórico → fallback da Métrica 3 (primeira aula como referência).
  - Instrutor com múltiplas turmas → atraso agregado bate com a turma mais atrasada dele.
  - Performance: cada query < 1s (dataset de 562k frequências).

### FASE 2.5: DOCUMENTAÇÃO (1 hora)

- Atualizar `backend/API.md` com os 3 novos endpoints, exemplos de request/response e as fórmulas acima.
- Atualizar `backend/README.md` se a estrutura de pastas mudar (novo `services/MetricasFrequenciaService.js`, nova rota).

---

## 🔍 CRITÉRIOS DE ACEITAÇÃO

- ✅ Todas as queries são `SELECT` (nenhuma escrita — guard de `config/database.js` continua ativo e cobre os models novos)
- ✅ Falta = somente `presenca = 2`; `presenca = 3` (justificada) nunca conta como falta
- ✅ `dataFim` nunca ultrapassa a data atual, mesmo se informado no filtro
- ✅ `percentualFaltas` nunca causa divisão por zero (retorna `null` quando `aulasPrevistas = 0`)
- ✅ Aulas sem frequência lançada contam no denominador, não geram falta, e aparecem explicitamente como `aulasSemFrequenciaLancada`
- ✅ Métrica de atraso disponível por turma **e** agregada por instrutor (via `turma.id_instrutor`)
- ✅ Fallbacks da Métrica 3 cobertos (turma nunca lançou nada / turma ainda sem aulas passadas)
- ✅ Performance < 1s por query
- ✅ Documentação atualizada (`API.md`, `README.md`)

---

**Status:** Implementado e arquivado (`openspec/changes/archive/2026-07-12-backend-phase2-metrics/`)
**Última atualização:** 2026-07-12

---
---

# IMPLEMENTATION_GUIDE.md - Frontend Phase 1: Dashboard de Turmas

## 📋 VISÃO GERAL DA IMPLEMENTAÇÃO

**Change:** `frontend-phase1-dashboard`
**Pré-requisito:** Backend Phase 1 (`backend-phase1-setup`) e Phase 2 (`backend-phase2-metrics`) completas — mais uma pequena extensão de backend descrita abaixo (Fase F1.0).
**Stack:** Vite + React (SPA client-side), `react-router-dom` para navegação. **Sem autenticação** (uso interno).
**Objetivo:** tela única de filtros em cascata (Projeto → Aditivo → Meta opcional) com tabela de turmas mostrando dias de atraso no lançamento, filtros adicionais de Instrutor/Situação, e drill-down para uma tela de detalhe da turma com faltas por aluno.

**Ordem de prioridade combinada com o responsável do projeto:** Frontend antes da Phase 3 (Exportação) — exportação fica para o final.

---

## 🎯 DECISÕES FECHADAS COM O RESPONSÁVEL DO PROJETO

Vinculantes para a implementação:

1. **Stack:** Vite + React, sem SSR/Next.js (dashboard interno, sem SEO), sem login.
2. **Fluxo de filtros:** Projeto (obrigatório) → Aditivo (obrigatório, habilitado após Projeto) → Meta (**opcional**, habilitado após Aditivo, não bloqueia o próximo passo).
3. Assim que Projeto + Aditivo estão definidos (Meta é opcional), o sistema busca e exibe a tabela de turmas automaticamente.
4. **Na mesma tela** onde a tabela aparece, os filtros de **Instrutor** e **Situação (status)** ficam disponíveis para o usuário refinar a consulta — reconsultando `/api/filtros/turmas` com os parâmetros adicionais, mantendo `idProjeto`/`idProjetoAditivo`/`idMeta`.
5. **Colunas da tabela:** identificação da turma (código, curso, instrutor, situação) **+** dias de atraso no lançamento — as duas coisas juntas, não uma ou outra.
6. **Clique numa linha da tabela = drill-down** (navega para a tela de detalhe daquela turma; não é um filtro que estreita a mesma tabela).
7. **Tela de detalhe da turma:** mostra os dias de atraso da turma (métrica principal do sistema) **e** a tabela de alunos daquela turma com `quantidadeFaltas`/`percentualFaltas` de cada um.
8. **Atraso por turma:** por ora, N chamadas em paralelo a `/api/metricas/atraso-lancamento/turma` (uma por turma exibida) — sem endpoint em lote. Medir performance real antes de otimizar; não é bloqueante para esta fase.

---

## ⚠️ MUDANÇAS NECESSÁRIAS NO BACKEND (pré-requisito desta fase)

Duas lacunas foram identificadas ao desenhar esta fase — ambas são extensões pequenas, seguindo o padrão já estabelecido (model + rota + Joi, somente leitura):

1. **Enriquecer `GET /api/filtros/turmas`** — hoje retorna `turma.*`, ou seja, `id_curso`/`id_instrutor` como chaves, não como texto. Estender `Turma.getTurmasPorProjetoAditivo` (em `backend/models/Turma.js`) com `LEFT JOIN curso` e `LEFT JOIN instrutor`, incluindo `cursoDescricao` (`curso.descricao`) e `instrutorNome` (`instrutor.nome`) na resposta, para a tabela do frontend não precisar resolver nomes por conta própria.
2. **Novo endpoint `GET /api/filtros/alunos?idTurma=X`** — expõe `AlunoModel.getAlunosPorTurma(idTurma)`, que já existe desde a Phase 1 mas nunca teve rota própria. Necessário para a tela de detalhe listar os alunos da turma. Validação Joi: `idTurma` number obrigatório.

Essas duas mudanças devem ser feitas **no backend** (nova mini-change ou como parte desta), antes/durante a Fase F1.0 abaixo. Continuam sujeitas à mesma regra de somente leitura (`SELECT` apenas).

---

## 🎯 FASES DE IMPLEMENTAÇÃO

### FASE F1.0: Ajustes no Backend (pré-requisito)

- Estender `Turma.getTurmasPorProjetoAditivo` com `LEFT JOIN curso`/`LEFT JOIN instrutor` (`cursoDescricao`, `instrutorNome`)
- Criar `AlunoModel` já existe — só falta a rota `GET /api/filtros/alunos?idTurma=X` em `backend/routes/api/filtros.js`
- Atualizar `backend/API.md` e `backend/tests.http` com os campos/rota novos
- Validar contra o banco real que `cursoDescricao`/`instrutorNome` vêm preenchidos (turmas têm `id_curso`/`id_instrutor` `NOT NULL`, então não deve haver `null` inesperado)

### FASE F1.1: Setup do Projeto Frontend

- `npm create vite@latest frontend -- --template react` (na raiz do projeto, ao lado de `backend/`)
- Instalar `react-router-dom`
- Configurar `VITE_API_URL` (ex.: `.env` do Vite) apontando para o backend (`http://localhost:3000`)
- Estrutura de pastas: `frontend/src/{pages,components,api,hooks}`

### FASE F1.2: Cliente HTTP

- `frontend/src/api/client.js`: wrapper fino sobre `fetch` (base URL de `VITE_API_URL`, tratamento padrão de erro/JSON)
- `frontend/src/api/filtros.js`: `getProjetos()`, `getAditivos(idProjeto)`, `getMetas(idProjetoAditivo)`, `getTurmas(params)`, `getInstrutores(idTurmas)`, `getAlunos(idTurma)`
- `frontend/src/api/metricas.js`: `getFaltas(idTurma, idAluno, dataInicio?, dataFim?)`, `getAtrasoTurma(idTurma)`, `getAtrasoInstrutor(idInstrutor)`

### FASE F1.3: Tela Dashboard — Filtros em Cascata

- `frontend/src/pages/Dashboard.jsx`
- Select **Projeto** (carrega ao montar a página)
- Select **Aditivo** (habilitado só após Projeto escolhido; recarrega ao trocar de projeto)
- Select **Meta** (habilitado só após Aditivo escolhido; **opcional** — tem uma opção "Todas")
- Ao ter Projeto + Aditivo definidos, dispara automaticamente a busca de turmas

### FASE F1.4: Tabela de Turmas + Filtros Adicionais

- Tabela com colunas: código, curso (`cursoDescricao`), instrutor (`instrutorNome`), situação (`status` traduzido para texto), dias de atraso
- Busca de `diasAtraso` por turma: uma chamada a `/api/metricas/atraso-lancamento/turma?idTurma=X` por linha, disparadas em paralelo (`Promise.all`) após a tabela base carregar
- Filtro **Instrutor**: select populado via `GET /api/filtros/instrutores?idTurmas=<ids das turmas atualmente exibidas>`
- Filtro **Situação**: select fixo com as 5 opções (`0` não especificado … `4` cancelada)
- Ao mudar Instrutor/Situação, reconsulta `/api/filtros/turmas` com os parâmetros adicionais, mantendo Projeto/Aditivo/Meta

### FASE F1.5: Roteamento e Tela de Detalhe da Turma

- `react-router-dom`: rota `/` (Dashboard) e `/turmas/:idTurma` (Detalhe)
- Clique numa linha da tabela navega para `/turmas/:idTurma`
- `frontend/src/pages/TurmaDetalhe.jsx`:
  - Mostra dados básicos da turma + `diasAtraso` (reaproveita `/api/metricas/atraso-lancamento/turma`)
  - Tabela de alunos da turma (`GET /api/filtros/alunos?idTurma=X`), cada linha com `quantidadeFaltas`/`percentualFaltas` (`GET /api/metricas/faltas?idTurma=X&idAluno=Y` por aluno, em paralelo)

### FASE F1.6: Testes Manuais

- Fluxo completo: Projeto → Aditivo → (Meta opcional) → tabela carrega → filtro por Instrutor/Situação → clique numa turma → detalhe mostra atraso + alunos com faltas
- Casos de borda: projeto sem aditivos (tabela vazia, sem erro), turma sem alunos matriculados, turma sem nenhuma aula (`aulasPrevistas: 0`, `percentualFaltas: null` exibido de forma legível, não como "NaN%")

---

## 🔍 CRITÉRIOS DE ACEITAÇÃO

- ✅ Fluxo de filtros funciona em cascata; Meta é realmente opcional (não bloqueia a busca de turmas)
- ✅ Tabela mostra nomes (`cursoDescricao`, `instrutorNome`), nunca IDs crus
- ✅ Filtros de Instrutor/Situação re-filtram a tabela sem recarregar a página
- ✅ Clique numa turma navega corretamente para `/turmas/:idTurma`
- ✅ Tela de detalhe mostra o atraso da turma e a lista de alunos com faltas
- ✅ `percentualFaltas: null` é tratado na UI (não mostra "NaN%" ou quebra a tela)
- ✅ Nenhuma chamada de escrita ao backend — todo o frontend consome apenas endpoints `GET`

---

## 🚀 PRÓXIMAS FASES DO FRONTEND

- **Frontend Phase 2: Exportação para Excel** — detalhamento completo ao final deste documento, seção "IMPLEMENTATION_GUIDE.md - Frontend Phase 2: Exportação para Excel".
- **Frontend Phase 3: Painel de Lançamentos Atrasados** — detalhamento completo ao final deste documento, seção "IMPLEMENTATION_GUIDE.md - Frontend Phase 3: Painel de Lançamentos Atrasados".

---

**Status:** Implementado (ver `openspec/changes/archive/2026-07-13-frontend-phase1-dashboard/` e `2026-07-13-frontend-phase2-refinements/`)
**Última atualização:** 2026-07-14

---
---

# IMPLEMENTATION_GUIDE.md - Frontend Phase 2: Exportação para Excel

## 📋 VISÃO GERAL DA IMPLEMENTAÇÃO

**Change:** `frontend-exportacao-excel`
**Pré-requisito:** Frontend Phase 1 e Phase 2 (refinamentos) completas — `Dashboard.jsx` e `TurmaDetalhe.jsx` já existem, com suas tabelas de turmas e de alunos ativos.
**Objetivo:** botão "Exportar para Excel" nas duas telas com tabela (Dashboard e detalhe da turma), gerando um arquivo `.xlsx` real que reflete exatamente a tabela como está na tela no momento do clique — filtros e ordenação já aplicados. Escopo propositalmente simples nesta fase; funcionalidades mais completas (múltiplas planilhas, seleção de colunas) ficam para avaliação futura.

**Correção de rota em relação ao plano original:** a Phase 3 mencionada no plano de Backend Phase 1 ("Endpoints de export Excel (SheetJS)") previa geração no **backend**. Esta fase substitui esse plano: a geração é **100% no cliente**, porque boa parte do que aparece nas tabelas hoje (tradução de situação, formatação de data, filtro de código de turma, ordenação por coluna) só existe no frontend — replicar essa lógica no backend duplicaria regras e criaria risco de o arquivo divergir da tela.

---

## 🎯 DECISÕES FECHADAS

1. **Biblioteca `xlsx` (SheetJS, edição comunitária)** — mesma biblioteca já prevista no plano original, usada em modo client-side (gera o arquivo e aciona o download direto no navegador, sem chamada de rede).
2. **Conteúdo do arquivo = exatamente o que está na tela**: mesmas linhas (respeitando os filtros já aplicados) e mesma ordem (respeitando a ordenação por coluna ativa) do momento do clique.
3. **Valores formatados, não brutos**: datas em `dd/mm/aaaa`, situação traduzida para texto, percentual com `%` — o mesmo texto exibido na célula da tabela, não o valor cru da API.
4. **Célula ainda carregando no momento do clique exporta como "—"**, nunca o indicador visual "..." (que só faz sentido em tela, não num arquivo baixado).
5. **Botão só aparece quando há dados para exportar** — mesma condição que já controla a exibição da tabela em cada tela.
6. **Sem endpoint novo no backend, sem mudança de schema.**

---

## 🎯 FASES DE IMPLEMENTAÇÃO

### FASE E2.1: Utilitário Compartilhado

- Instalar `xlsx` como dependência do frontend
- `frontend/src/utils/exportarExcel.js`: `exportarParaExcel(nomeArquivo, colunas, linhas)`, onde `colunas` é `{ rotulo, valor: (linha) => string }[]` (mesmo formato já usado pelos arrays `colunas` de cada tela) — monta a planilha via `XLSX.utils.json_to_sheet` e aciona o download via `XLSX.writeFile`

### FASE E2.2: Dashboard

- Extratores de valor **formatado** por coluna para exportação (reaproveitando `formatDateBR`, `STATUS_TURMA` e o tratamento de "—" já usados na renderização das células — não os extratores brutos usados pela ordenação)
- Botão "Exportar para Excel" próximo à tabela, visível só quando há turmas na tabela ordenada/filtrada
- Nome do arquivo: `turmas-AAAA-MM-DD.xlsx`

### FASE E2.3: TurmaDetalhe

- Extratores de valor formatado para as 4 colunas da tabela de alunos (Aluno, Quantidade de faltas, Percentual de faltas, Faltas últimas 4 aulas), reaproveitando `formatPercentual` e o tratamento de "—"/"X/N" já usado na tela
- Botão "Exportar para Excel" próximo à tabela, visível só quando há alunos ativos
- Nome do arquivo: `alunos-<codigo-da-turma>-AAAA-MM-DD.xlsx`

### FASE E2.4: Testes Manuais

- Dashboard: exportar com filtros (Projeto/Aditivo/Meta/Instrutor/Situação/Código) e uma coluna ordenada aplicados; abrir o arquivo e conferir linhas/ordem/valores contra a tela
- Dashboard: exportar antes de "Dias em Atraso"/"Último Lançamento" terminarem de carregar → célula vem como "—", não "..."
- Dashboard: sem Projeto/Aditivo selecionados, ou filtro sem resultado → botão não aparece
- TurmaDetalhe: exportar com a tabela ordenada; turma sem alunos ativos → botão não aparece
- Conferir nome dos arquivos baixados

---

## 🔍 CRITÉRIOS DE ACEITAÇÃO

- ✅ Arquivo `.xlsx` real (abre corretamente no Excel/LibreOffice/Google Sheets), não CSV
- ✅ Linhas, ordem e valores do arquivo batem exatamente com o que está na tela no momento do clique
- ✅ Cabeçalhos do arquivo iguais aos rótulos das colunas na tela
- ✅ Nenhuma chamada de rede disparada pela exportação (geração 100% client-side)
- ✅ Botão ausente quando não há dados para exportar

---

**Status:** Implementado — botão "Exportar para Excel" no Dashboard e no TurmaDetalhe, utilitário `frontend/src/utils/exportarExcel.js` compartilhado; validado no navegador (arquivo `.xlsx` válido, nomes corretos, botão ausente sem dados, sem chamadas de rede). Change ainda não arquivada (ver `openspec/changes/frontend-exportacao-excel/`).
**Última atualização:** 2026-07-13

---
---

# IMPLEMENTATION_GUIDE.md - Frontend Phase 3: Painel de Lançamentos Atrasados

## 📋 VISÃO GERAL DA IMPLEMENTAÇÃO

**Change:** `dashboard-lancamentos-atrasados`
**Nova capability:** `painel-turmas-atrasadas`
**Pré-requisito:** Frontend Phase 1/2 completas (`Dashboard.jsx`, filtros por URL, drill-down `/turmas/:idTurma` já existentes); Backend `metricas-frequencia` ganha um endpoint agregado novo.
**Objetivo:** um **modal** (não uma nova rota) aberto a partir do Dashboard, mostrando o total de turmas em atraso e a média de dias de atraso no escopo de filtros já selecionado, com tabela buscável/paginada dessas turmas — cada linha navegando para o drill-down de turma já existente (`/turmas/:idTurma`).

**Importante — não é um novo drill-down**: o drill-down de turma (`/turmas/:idTurma`) já existe e continua sendo a única navegação de rota para o detalhe de uma turma. O painel desta fase é um **modal sobre a tela do Dashboard** (não troca de URL) que serve como uma porta de entrada alternativa para esse mesmo drill-down — uma lista pré-filtrada só com as turmas atrasadas, evitando que o usuário precise localizá-las manualmente na tabela geral.

---

## 🎯 DECISÕES FECHADAS

1. **"Turma em atraso" = `diasAtraso > 7`**, limiar **fixo (hardcoded) nesta fase**, como constante no backend (`MetricasFrequenciaService`). Turmas com `diasAtraso: null` (sem nenhuma aula passada) não contam como atrasadas.
   - **Evolução futura já decidida (fora do escopo desta fase)**: o limiar deixará de ser uma constante em código e passará a vir de um **arquivo de persistência JSON** lido pelo backend — não uma configuração via UI nem query param —, permitindo ajustar o prazo sem novo deploy. Quando essa evolução for implementada, o valor deve manter um fallback para `7` caso o arquivo esteja ausente.
2. **Novo endpoint agregado** `GET /api/metricas/atraso-lancamento/turmas-atrasadas`, aceitando os mesmos filtros de `GET /api/filtros/turmas` (`idProjeto`/`idProjetoAditivo` obrigatórios; `idMeta`/`idInstrutor`/`status` opcionais) — reaproveita `getAtrasoLancamentoPorTurma` já existente, chamado em paralelo para cada turma do escopo (mesmo padrão N-chamadas que o frontend já faz, só que dentro de um único request HTTP), filtra `diasAtraso > 7` e calcula total/média sobre o resultado.
3. **Painel reutiliza os filtros já aplicados no Dashboard** (Projeto/Aditivo/Meta/Instrutor/Situação, lidos da URL) — não tem seleção de filtro própria. Só pode ser aberto quando Projeto+Aditivo já estiverem selecionados (mesma restrição da tabela principal).
4. **Busca e paginação client-side**, sobre a lista já carregada pelo endpoint — mesmo padrão já usado no filtro de código do Dashboard.
5. **Ordenação padrão da tabela do painel: `diasAtraso` decrescente** (turma mais atrasada primeiro).
6. **Exportação em Excel**, alinhada com o restante do sistema: a lista do painel exporta para `.xlsx` reaproveitando o utilitário `exportarExcel.js` (`exportarParaExcel`) introduzido pela Phase 2 (`frontend-exportacao-excel`), sem gerar CSV nem duplicar lógica de geração de arquivo. `frontend-exportacao-excel` é pré-requisito de aplicação (deve ser aplicada antes, ou junto).

---

## 🎯 FASES DE IMPLEMENTAÇÃO

### FASE PA.1: Endpoint Agregado (Backend)

- `MetricasFrequenciaService`: novo método que recebe o escopo de filtros, resolve as turmas via `TurmaModel.getTurmasPorProjetoAditivo`, calcula `diasAtraso` de cada uma em paralelo, filtra `> 7` e retorna `{ total, mediaDiasAtraso, turmas: [...] }`
- Nova rota em `backend/routes/api/metricas.js`, validação Joi igual à de `GET /api/filtros/turmas`
- Atualizar `backend/API.md` e `backend/tests.http`
- Validar contra o banco real: total e média batem com uma conferência manual sobre um escopo conhecido

### FASE PA.2: Ponto de Entrada no Dashboard

- Indicador/botão "Lançamentos atrasados" em `Dashboard.jsx`, visível só com Projeto+Aditivo selecionados
- Ao clicar, abre o modal consultando o novo endpoint com os filtros correntes da URL

### FASE PA.3: Componente do Painel

- Novo componente de modal (`frontend/src/pages/` ou `components/`)
- Título, botão de fechar, texto explicativo do critério (prazo ideal de 7 dias)
- Dois indicadores: total de turmas em atraso e média de dias de atraso (arredondada)
- Campo de busca por código/nome da turma (client-side)
- Tabela: código/nome, projeto, instrutor, dias de atraso, último lançamento — ordenada por atraso decrescente por padrão
- Paginação client-side quando a lista (após busca) exceder o tamanho de página
- Clique numa linha navega para `/turmas/:idTurma` (drill-down já existente)
- Botão "Exportar para Excel" (ver Decisão 6), reaproveitando `exportarExcel.js` da Phase 2

### FASE PA.4: Testes Manuais

- Abrir o painel com Projeto+Aditivo (+ demais filtros) selecionados; conferir que total/média batem com os dados reais do escopo
- Buscar por código/nome dentro do painel
- Paginação com uma lista maior que uma página
- Clicar numa linha → navega para o drill-down correto
- Fechar o painel → Dashboard continua com os filtros aplicados, sem perder estado
- Escopo sem nenhuma turma atrasada → total `0`, média "—", tabela com mensagem de vazio

---

## 🔍 CRITÉRIOS DE ACEITAÇÃO

- ✅ Painel só abre com Projeto+Aditivo já selecionados no Dashboard
- ✅ Total e média refletem exatamente `diasAtraso > 7` dentro do escopo filtrado
- ✅ Fechar o painel não altera os filtros do Dashboard (nenhuma troca de rota)
- ✅ Clique numa linha do painel reutiliza o drill-down `/turmas/:idTurma` já existente, sem duplicar essa navegação
- ✅ Busca e paginação não disparam chamada de rede nova
- ✅ Exportação em Excel, consistente com o resto do sistema (ver Decisão 6)
- ✅ Nenhuma escrita no banco — endpoint novo é somente leitura (`SELECT`)

---

**Status:** Implementado — endpoint `GET /api/metricas/atraso-lancamento/turmas-atrasadas`, modal `PainelLancamentosAtrasados` com indicadores/busca/paginação/exportação, ponto de entrada no Dashboard; validado no navegador (escopo com turmas atrasadas, escopo vazio, navegação para o detalhe, exportação Excel). Change ainda não arquivada (ver `openspec/changes/dashboard-lancamentos-atrasados/`).
**Última atualização:** 2026-07-13
