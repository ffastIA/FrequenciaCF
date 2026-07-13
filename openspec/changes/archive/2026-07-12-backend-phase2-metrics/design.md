## Context

A Fase 1 já expõe `Aula` (`status`: 0 prevista / 1 realizada), `Frequencia` (`presenca`: 0 não especificado / 1 presente / 2 faltou / 3 falta justificada / 4 reposição) e `Turma` (`id_instrutor`, `data_inicio`). A tabela `frequencia` **não tem coluna de timestamp de lançamento** — só liga a `aula` via `id_aula`. As regras de negócio desta fase (o que conta como falta, o que conta como "aula prevista", como aproximar a data de lançamento) foram fechadas diretamente com o responsável do projeto e estão documentadas em `IMPLEMENTATION_GUIDE.md` (seção "Backend Phase 2").

## Goals / Non-Goals

**Goals:**
- Calcular quantidade e percentual de faltas por (aluno, turma), com filtro de datas.
- Calcular dias de atraso no lançamento de frequência, por turma e agregado por instrutor.
- Expor indicador de "aulas sem frequência lançada" como dado de primeira classe (não só um efeito colateral do cálculo de faltas).
- Manter todas as queries somente leitura, sem exceção.

**Non-Goals:**
- Lançar ou corrigir frequência (isso seria escrita — fora de escopo e proibido por `CLAUDE.md`).
- Métricas agregadas por projeto/curso (esta fase é por aluno/turma/instrutor apenas).
- Cache/agendamento de recálculo — cada chamada calcula on-demand.
- Exportação (Phase 3).

## Decisions

1. **`aula.data` como proxy de "data de lançamento"**: como `frequencia` não guarda timestamp próprio, a data da aula associada é usada como referência de quando a frequência deveria ter sido lançada. Alternativa considerada: adicionar coluna `dh_lancamento` em `frequencia` — descartada porque é uma alteração de schema em banco de produção compartilhado, fora do escopo (e da permissão) deste projeto somente-leitura.

2. **"Aula prevista" ignora `aula.status`**: o filtro usado é só `aula.data <= dataFimEfetivo`, decisão confirmada explicitamente pelo responsável do projeto. Isso significa que uma aula marcada como `status=0` (prevista/não realizada) mas com data no passado ainda entra no denominador — reflete a realidade de que o instrutor pode não ter atualizado o status.

3. **`dataFim` sempre capado em `hoje`**: mesmo que o filtro receba uma data futura, o cálculo usa `min(dataFim, hoje)`. Alternativa (deixar o usuário estourar o filtro e retornar zero aulas no trecho futuro) foi descartada por poder mascarar erro de uso da API.

4. **Métrica de atraso usa `turma.id_instrutor`, não `aula.id_instrutor`**: `turma.id_instrutor` é `NOT NULL` e representa o responsável oficial pela turma; `aula.id_instrutor` é opcional e pode registrar um substituto pontual. Para "atraso do instrutor" faz mais sentido agregar pela responsabilidade formal (turma), não pela aula específica.

5. **Fallback quando a turma nunca lançou nenhuma frequência**: usar a aula mais antiga da turma com `data <= hoje` como referência, contando o atraso desde o início. Alternativa (retornar `null` sempre que não houver lançamento) foi descartada por esconder o caso mais crítico (instrutor que nunca lançou nada).

6. **Resposta de faltas retorna quantidade + percentual + pendência juntos**: uma única chamada de API (`GET /api/metricas/faltas`) devolve `quantidadeFaltas`, `percentualFaltas` e `aulasSemFrequenciaLancada` na mesma resposta, evitando duas queries redundantes sobre a mesma janela de dados e mantendo o indicador de pendência visível sempre que se consulta faltas.

7. **Sem model/service novo dedicado a `AtrasoLancamento`**: a lógica entra em `MetricasFrequenciaService`, reaproveitando `Frequencia` e `Turma` models já existentes, em vez de criar uma camada extra — volume de código não justifica um service adicional nesta fase.

## Risks / Trade-offs

- [`aula.data` como proxy de lançamento pode não refletir a hora real em que o instrutor preencheu a frequência] → Aceito como aproximação deliberada, documentado tanto no guia quanto na spec; não há dado melhor disponível sem alterar o schema (fora de escopo).
- [Queries de atraso por instrutor fazem JOIN `turma` → `aula` → `frequencia` sobre todas as turmas do instrutor, podendo ficar mais lentas que as demais] → Mitigado filtrando sempre por `turma.id_instrutor` com índice existente (`id_instrutor` já indexado em `turma`); validar em Fase 2.4 que fica < 1s mesmo assim.
- [Definição de "falta" pode mudar no futuro (ex.: incluir falta justificada em algum relatório)] → Centralizado em um único ponto (`MetricasFrequenciaService`), fácil de ajustar sem tocar nas rotas.

## Migration Plan

Não há migração de dados nem de schema. Deploy: adicionar os arquivos novos e o `app.use` da nova rota em `server.js`; sem impacto nos endpoints da Fase 1. Rollback: remover a rota/arquivos novos, sem efeito no restante do backend.

## Open Questions

Nenhuma — definições de negócio já fechadas com o responsável do projeto (ver `IMPLEMENTATION_GUIDE.md`).
