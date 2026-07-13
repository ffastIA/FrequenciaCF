## Why

Dois atritos de uso relatados após a phase2:

1. Ao entrar no drill-down de uma turma e voltar ao dashboard, todos os filtros selecionados (Projeto, Aditivo, Meta, Instrutor, Situação) são perdidos — o usuário precisa refazer a seleção inteira só para inspecionar outra turma da mesma lista.
2. Como o foco do sistema é acompanhar turmas **em andamento**, o filtro de Situação deveria já vir em "Iniciada" por padrão, em vez de "Todas" — hoje o usuário precisa filtrar manualmente toda vez.

## What Changes

- **Filtros na URL**: o estado dos filtros do Dashboard (Projeto, Aditivo, Meta, Instrutor, Situação) passa a ser refletido nos query params da URL (ex.: `/?idProjeto=16&idProjetoAditivo=8&status=2`). Consequência: voltar do drill-down (pelo link "Voltar", pelo botão nativo de voltar do navegador, por refresh/F5 ou por link compartilhado) restaura exatamente os filtros anteriores. Decisão do responsável: preservar via URL (compartilhável e resistente a refresh), aceitando o recálculo dos atrasos (~1s) ao voltar.
- **Voltar preserva contexto**: o link "Voltar ao dashboard" na tela de detalhe retorna à URL do dashboard com os filtros já aplicados (não para `/` "limpo").
- **Situação padrão "Iniciada"**: o filtro de Situação passa a ter "Iniciada" (`status = 2`) como valor padrão, aplicado no primeiro carregamento e ao resetar (troca de Projeto/Aditivo). A tabela inicial já vem filtrada por turmas iniciadas. "Todas" e as demais situações continuam disponíveis e, quando escolhidas, são preservadas na URL como qualquer outro filtro.
- **Sem mudança de backend**: os endpoints já aceitam todos esses parâmetros; a mudança é inteiramente no frontend.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: estado dos filtros na URL; retorno do drill-down preservando filtros; Situação padrão "Iniciada".

## Impact

- **Frontend alterado**: `Dashboard.jsx` (ler/escrever filtros na URL via `useSearchParams`, aplicar padrão "Iniciada"), `TurmaDetalhe.jsx` (link "Voltar" para a URL de origem do dashboard), e a navegação do clique na linha (levar a URL de origem no estado de navegação).
- **Sem mudança de backend**, sem mudança de dependências, banco continua somente leitura.
- **Compatibilidade**: URLs antigas sem query params continuam funcionando (caem no padrão: sem projeto selecionado, Situação "Iniciada" pronta para quando o projeto for escolhido).
