# API — Filtros e Métricas

Base URL: `http://localhost:3000`

Todas as rotas são `GET`, somente leitura, e retornam JSON.

## Filtros

Base: `/api/filtros`

---

## `GET /projetos`

Lista todos os projetos.

**Exemplo:**
```bash
curl http://localhost:3000/api/filtros/projetos
```

**Resposta 200:**
```json
[{ "id_projeto": 1, "nome": "Centro de Treinamento em Confecção e Moda", "controle_modulos": 0, "cha_tecnologico": 0 }]
```

---

## `GET /aditivos`

Aditivos de um projeto.

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| `idProjeto` | number | sim |

**Exemplo:**
```bash
curl "http://localhost:3000/api/filtros/aditivos?idProjeto=16"
```

**Erros:** `400` se `idProjeto` estiver ausente ou não for número.

---

## `GET /metas`

Metas de um aditivo de projeto.

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| `idProjetoAditivo` | number | sim |

**Exemplo:**
```bash
curl "http://localhost:3000/api/filtros/metas?idProjetoAditivo=2"
```

---

## `GET /turmas`

Turmas de um projeto/aditivo, com filtros opcionais de meta, instrutor e **situação (status) da turma**. Cada turma inclui `cursoDescricao` e `instrutorNome` (via JOIN), além dos campos de `turma.*`.

| Parâmetro | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `idProjeto` | number | sim | |
| `idProjetoAditivo` | number | sim | |
| `idMeta` | number | não | filtra por `id_meta_turma` |
| `idInstrutor` | number | não | filtra por `id_instrutor` |
| `status` | number (0–4) | não | situação da turma: `0` não especificado / `1` não iniciada / `2` iniciada / `3` concluída / `4` cancelada |

**Exemplos:**
```bash
# todas as turmas do projeto/aditivo
curl "http://localhost:3000/api/filtros/turmas?idProjeto=16&idProjetoAditivo=2"

# somente turmas concluídas
curl "http://localhost:3000/api/filtros/turmas?idProjeto=16&idProjetoAditivo=2&status=3"
```

**Erros:** `400` se `idProjeto`/`idProjetoAditivo` estiverem ausentes, ou se `status` estiver fora do intervalo 0–4.

---

## `GET /instrutores`

Instrutores vinculados a uma ou mais turmas.

| Parâmetro | Tipo | Obrigatório | Formato |
|---|---|---|---|
| `idTurmas` | string | sim | IDs separados por vírgula, ex.: `1,2,3` |

**Exemplo:**
```bash
curl "http://localhost:3000/api/filtros/instrutores?idTurmas=1597"
```

---

## `GET /alunos`

Alunos matriculados numa turma, com filtro opcional pela situação da matrícula.

| Parâmetro | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `idTurma` | number | sim | |
| `situacao` | number (0–8) | não | situação da matrícula: `0` não especificado / `1` matriculado / `2` concluiu / `3` desistiu / `4` evadido / `5` não aprovado / `6` não iniciou / `7` ativo / `8` transferido |

**Exemplos:**
```bash
# todos os alunos matriculados
curl "http://localhost:3000/api/filtros/alunos?idTurma=1597"

# somente alunos ativos
curl "http://localhost:3000/api/filtros/alunos?idTurma=4509&situacao=7"
```

**Erros:** `400` se `idTurma` estiver ausente/não numérico, ou se `situacao` estiver fora do intervalo 0–8.

---

## Métricas

Base: `/api/metricas`

Regras gerais de negócio (ver detalhamento e fórmulas completas em `IMPLEMENTATION_GUIDE.md`, seção "Backend Phase 2"):
- **Falta** = somente `presenca = 2` na tabela `frequencia`. `presenca = 3` (falta justificada) nunca conta como falta.
- **Aula prevista** = qualquer `aula` com `data <= hoje/filtro`, independente do campo `status` da aula.
- `dataFim` de qualquer filtro é sempre limitado a `min(dataFim informado, hoje)` — nunca considera aulas futuras.
- "Hoje" é sempre calculado no fuso `America/Sao_Paulo`.
- Aulas sem nenhuma frequência lançada contam no denominador (`aulasPrevistas`), nunca geram falta, e aparecem explicitamente em `aulasSemFrequenciaLancada`.

### `GET /faltas`

Quantidade e percentual de faltas de um aluno numa turma, num período.

| Parâmetro | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `idTurma` | number | sim | |
| `idAluno` | number | sim | |
| `dataInicio` | string (ISO `YYYY-MM-DD`) | não | default: `turma.data_inicio` |
| `dataFim` | string (ISO `YYYY-MM-DD`) | não | default: hoje; sempre limitado a hoje mesmo se informado no futuro |

**Exemplo:**
```bash
curl "http://localhost:3000/api/metricas/faltas?idTurma=1597&idAluno=10147"
```

**Resposta 200:**
```json
{
  "idAluno": 10147,
  "idTurma": 1597,
  "dataInicio": "2022-08-08",
  "dataFim": "2026-07-12",
  "aulasPrevistas": 50,
  "quantidadeFaltas": 5,
  "percentualFaltas": 10,
  "aulasSemFrequenciaLancada": 0
}
```

`percentualFaltas` é `null` quando `aulasPrevistas` é `0` (nunca há divisão por zero).

**Erros:** `400` se `idTurma`/`idAluno` estiverem ausentes ou `dataInicio`/`dataFim` não forem datas ISO válidas.

---

### `GET /atraso-lancamento/turma`

Dias de atraso no lançamento de frequência de uma turma.

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| `idTurma` | number | sim |

**Exemplo:**
```bash
curl "http://localhost:3000/api/metricas/atraso-lancamento/turma?idTurma=1597"
```

**Resposta 200:**
```json
{ "idTurma": 1597, "diasAtraso": 4, "dataReferencia": "2026-07-08", "dataUltimoLancamento": "2026-07-08" }
```

- Uma aula só conta como **lançada** se `aula.status = 1` (realizada) **e** tiver ao menos um registro em `frequencia` com `presenca <> 0`. As duas condições são necessárias: linhas com `presenca = 0` são placeholders de "não lançado"; e aulas com `status = 0` (ainda não realizadas) podem ter `frequencia` pré-copiada de uma aula anterior — inclusive em aulas com data futura — então `presenca <> 0` sozinho não basta (senão a data pega aulas sem lançamento real, inclusive hoje).
- `dataReferencia` é a data usada no cálculo do atraso: a última aula lançada (com lançamento real) da turma, ou — se a turma nunca lançou nenhuma frequência real — a aula mais antiga (fallback).
- `dataUltimoLancamento` é o último lançamento **real**: igual a `dataReferencia` quando há lançamento real, e `null` quando a turma nunca lançou nada de verdade (o fallback não é usado aqui).
- Se a turma ainda não tem nenhuma aula com `data <= hoje`, os três campos são `null`.

---

### `GET /atraso-lancamento/instrutor`

Mesma métrica acima, agregada por instrutor (via `turma.id_instrutor`, considerando todas as turmas dele).

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| `idInstrutor` | number | sim |

**Exemplo:**
```bash
curl "http://localhost:3000/api/metricas/atraso-lancamento/instrutor?idInstrutor=224"
```

**Resposta 200:**
```json
{ "idInstrutor": 224, "diasAtraso": 4, "dataReferencia": "2026-07-08", "dataUltimoLancamento": "2026-07-08" }
```

`dataUltimoLancamento` segue a mesma semântica do endpoint por turma (`null` quando o instrutor nunca lançou nada em nenhuma de suas turmas).

---

### `GET /faltas-recentes`

Quantidade de faltas de cada aluno matriculado numa turma, nas últimas 4 aulas **realizadas** (`aula.status = 1`, `data <= hoje`) — numa única resposta para a turma inteira, sem precisar de uma chamada por aluno.

| Parâmetro | Tipo | Obrigatório |
|---|---|---|
| `idTurma` | number | sim |

**Exemplo:**
```bash
curl "http://localhost:3000/api/metricas/faltas-recentes?idTurma=1597"
```

**Resposta 200:**
```json
{
  "idTurma": 1597,
  "aulasConsideradas": 4,
  "porAluno": [
    { "idAluno": 10147, "quantidadeFaltas": 1 },
    { "idAluno": 10148, "quantidadeFaltas": 0 }
  ]
}
```

- As "últimas 4 aulas" são as 4 linhas mais recentes de `aula` com `status = 1` (realizada) e `data <= hoje`, não 4 datas distintas — turmas com múltiplas aulas no mesmo dia contam cada linha.
- Aulas com `status = 0` (agendadas/não realizadas) nunca entram no cálculo, mesmo que já tenham `frequencia` pré-copiada de uma aula anterior (mesma armadilha do `dataUltimoLancamento` — ver `atraso-lancamento`).
- `aulasConsideradas` reflete quantas aulas realmente entraram no cálculo: pode ser menor que 4 em turma recém-iniciada, e `0` quando a turma ainda não tem nenhuma aula realizada (nesse caso, `quantidadeFaltas` é `0` para todos, não indicando ausência de falta e sim ausência de dado).
- Aluno matriculado sem nenhum registro de `frequencia` numa aula considerada não conta falta para ela.

**Erros:** `400` se `idTurma` estiver ausente ou não for número.

---

## Erros

Todas as rotas retornam, em caso de falha inesperada, status `500` com:

```json
{ "erro": "Erro interno do servidor" }
```

Em `NODE_ENV=development`, o corpo inclui também `message` com detalhes do erro.
