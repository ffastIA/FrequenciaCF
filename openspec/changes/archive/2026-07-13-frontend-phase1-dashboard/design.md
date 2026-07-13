## Context

O backend (Fases 1 e 2) já expõe filtros em cascata (`/api/filtros/*`) e métricas de faltas/atraso (`/api/metricas/*`), todos somente leitura sobre o banco `CentroFormacao` de produção. Não existe frontend algum hoje. As decisões de escopo, stack e fluxo desta fase foram fechadas diretamente com o responsável do projeto e estão documentadas em `IMPLEMENTATION_GUIDE.md` (seção "Frontend Phase 1: Dashboard de Turmas").

## Goals / Non-Goals

**Goals:**
- Entregar um fluxo completo e usável: filtros em cascata → tabela de turmas com atraso → drill-down com faltas por aluno.
- Reaproveitar ao máximo os endpoints já existentes, com a menor extensão possível no backend.
- Manter o backend somente leitura, sem exceção.

**Non-Goals:**
- Autenticação/login (fora de escopo — uso interno).
- Exportação de dados (Phase 3 do backend, deixada para depois do frontend por decisão do responsável).
- Endpoint em lote para atraso por turma (N chamadas em paralelo é aceitável nesta fase; otimizar só se a performance real exigir).
- Gráficos, dashboards visuais avançados, paginação server-side — apenas uma tabela funcional.
- Design system elaborado — HTML/CSS simples é suficiente nesta fase.

## Decisions

1. **Vite + React sem framework full-stack (Next.js)**: dashboard interno sem SEO/SSR, com backend Express já separado. Next.js adicionaria um servidor Node extra e duas formas de renderizar (server/client components) sem nenhum ganho real aqui. Decisão confirmada explicitamente com o responsável do projeto.

2. **`react-router-dom` para 2 rotas apenas (`/` e `/turmas/:idTurma`)**: simples o bastante para não justificar roteamento por arquivo (que só o Next.js ofereceria de graça); adicionar a lib é mais leve que migrar de stack.

3. **Enriquecer `GET /api/filtros/turmas` com JOIN em vez de o frontend resolver nomes**: evita N chamadas extras no frontend para resolver `cursoDescricao`/`instrutorNome`, e não exigiria criar um endpoint de listagem de cursos que não existe hoje. Alternativa (frontend busca instrutor via `/api/filtros/instrutores` e mapeia client-side, e cria endpoint de cursos à parte) foi descartada por espalhar lógica que cabe melhor numa única query already-existing no backend.

4. **`GET /api/filtros/alunos?idTurma=X` como rota nova, reaproveitando o model existente**: `AlunoModel.getAlunosPorTurma` já existe desde a Fase 1 mas nunca foi exposto via REST — é a extensão mais direta possível, seguindo o mesmo padrão (model + rota + Joi) já usado em todas as outras rotas de `/api/filtros`.

5. **N chamadas em paralelo para `diasAtraso` (por turma na tabela, por aluno no detalhe)**: mais simples de implementar agora; não há endpoint em lote hoje e criar um adicionaria escopo de backend não pedido pelo responsável nesta fase. Risco de performance é aceito conscientemente (ver Risks abaixo) e documentado como algo a medir, não a assumir.

6. **Cliente HTTP fino (`fetch` + wrapper), sem lib de data-fetching (react-query etc.)**: volume de chamadas e complexidade de cache não justificam uma dependência nova nesta fase; podemos revisar em fases futuras se o app crescer.

7. **`percentualFaltas: null` tratado explicitamente na UI** (ex.: exibir "—" em vez de "NaN%" ou string vazia): já é um valor esperado e documentado pela API (turma sem aulas no período), então a UI precisa de um caso explícito, não um efeito colateral de formatação.

## Risks / Trade-offs

- [N chamadas em paralelo para `diasAtraso` pode ficar lento se uma turma/projeto tiver muitas turmas (ex.: os 204 casos vistos em testes da Fase 1)] → Mitigação: medir tempo real na Fase F1.6 (testes manuais); se necessário, uma fase futura pode adicionar `GET /api/metricas/atraso-lancamento/turmas?idTurmas=1,2,3` em lote, sem quebrar a API atual (endpoint aditivo).
- [Mesma preocupação para faltas por aluno na tela de detalhe, se a turma tiver muitos alunos matriculados] → Mesma mitigação: medir antes de otimizar; endpoint em lote de faltas pode ser adicionado depois sem breaking change.
- [Enriquecer `/api/filtros/turmas` com JOIN pode alterar o formato da resposta consumida por integrações futuras] → Mitigação: são campos **adicionados** (`cursoDescricao`, `instrutorNome`), nenhum campo existente é removido ou renomeado — mudança aditiva, não é `BREAKING`.
- [Sem autenticação, qualquer pessoa com acesso à rede pode ver dados de alunos/instrutores] → Aceito conscientemente pelo responsável do projeto para esta fase (uso interno); não é uma omissão acidental.

## Migration Plan

Não há migração de dados. Deploy: subir `frontend/` como novo app estático (build via `vite build`), apontando `VITE_API_URL` para o backend já em produção/homologação. A extensão do backend (F1.0) é aditiva — não quebra os endpoints já usados pela Fase 1/2. Rollback: remover o app frontend; a extensão de backend pode ficar (é aditiva e inofensiva) ou ser revertida isoladamente se necessário.

## Open Questions

Nenhuma — decisões de escopo, stack e fluxo já fechadas com o responsável do projeto (ver `IMPLEMENTATION_GUIDE.md`).
