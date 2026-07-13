## 1. Filtros na URL (Dashboard)

- [x] 1.1 Migrar o estado dos filtros do Dashboard de `useState` para a URL via `useSearchParams` (Projeto, Aditivo, Meta, Instrutor, Situação como fonte de verdade)
- [x] 1.2 Garantir escrita atômica dos filtros dependentes (Projeto/Aditivo/Meta juntos numa única atualização da URL), preservando a proteção contra busca "no meio do caminho"
- [x] 1.3 Disparar a busca de turmas reagindo à URL (refresh/link direto já carregam a tabela correta)

## 2. Situação padrão "Iniciada"

- [x] 2.1 Definir "Iniciada" (`status = 2`) como valor padrão da Situação quando a URL não especifica Situação (primeiro carregamento e reset por troca de Projeto/Aditivo)
- [x] 2.2 Representar "Todas" de forma explícita/preservável na URL (sentinela), distinta do padrão, para não reintroduzir "Iniciada" ao voltar/refresh quando o usuário escolheu "Todas"
- [x] 2.3 Incluir `status=2` na busca inicial de turmas assim que Projeto+Aditivo estão selecionados

## 3. Retorno do drill-down preservando filtros

- [x] 3.1 No clique da linha, levar a URL de origem do Dashboard (`pathname + search`) no `state` de navegação, junto com `turma`
- [x] 3.2 Link "Voltar ao dashboard" (`TurmaDetalhe.jsx`) usar essa origem; fallback para `/` no acesso direto
- [x] 3.3 Confirmar que o botão nativo de voltar do navegador também restaura os filtros (consequência da URL como fonte de verdade)

## 4. Testes manuais no navegador

- [x] 4.1 Selecionar Projeto+Aditivo: Situação já vem "Iniciada" e a tabela mostra só turmas iniciadas
- [x] 4.2 Entrar num drill-down e usar "Voltar": filtros (incluindo Situação) restaurados, mesma tabela
- [x] 4.3 Repetir usando o botão nativo de voltar do navegador
- [x] 4.4 Refresh (F5) numa URL com filtros: filtros e tabela reaparecem
- [x] 4.5 Escolher "Todas", entrar/voltar do drill-down e dar refresh: continua "Todas" (não volta para "Iniciada")
- [x] 4.6 Trocar de Projeto: Situação volta ao padrão "Iniciada"
- [x] 4.7 Acesso direto a `/turmas/:id` e "Voltar": vai para `/` sem erro; sem erros no console
