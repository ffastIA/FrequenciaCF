## 1. Implementação

- [x] 1.1 `Dashboard.jsx`: ler o parâmetro de URL `codigo` (singular) em vez de `codigos`
- [x] 1.2 Calcular `codigosDisponiveis = [...new Set(turmas.map(t => t.codigo))].filter(Boolean).sort((a, b) => a.localeCompare(b, 'pt-BR'))`
- [x] 1.3 Substituir a lógica de filtro client-side (`codigosFiltro`/`split(';')`) por comparação direta: `turmasFiltradas = codigo ? turmas.filter(t => t.codigo === codigo) : turmas`
- [x] 1.4 Trocar o `<input type="text">` do filtro de código por `<select>`, com `<option value="">Todos</option>` seguido das opções de `codigosDisponiveis`
- [x] 1.5 `handleCodigoChange`: escreve o parâmetro `codigo` na URL (substituindo `handleCodigosChange`)
- [x] 1.6 Atualizar `handleProjetoChange`/`handleAditivoChange`/`handleMetaChange` para deletar `codigo` (em vez de `codigos`)
- [x] 1.7 ~~Novo `useEffect` que observa `turmas` e `codigo`~~ — corrigido durante a validação: um efeito separado observando `turmas` tem uma corrida real (no acesso direto/refresh com `codigo` já na URL, `turmas` começa vazio no primeiro render, antes do fetch completar, e `carregandoTurmas` também só reflete `true` no próximo commit — a checagem via efeito separado removia a seleção prematuramente). A limpeza de seleção órfã foi movida para dentro do próprio `.then()` do efeito que busca `turmas` (usando o `resultado` que de fato chegou, não o estado desatualizado), eliminando a corrida

## 2. Testes manuais no navegador

- [x] 2.1 Selecionar Projeto+Aditivo: dropdown de código aparece populado, em ordem alfabética, só com os códigos daquele escopo
- [x] 2.2 Selecionar um código: tabela filtra para aquela turma
- [x] 2.3 Voltar para "Todos": tabela volta a mostrar todas as turmas do escopo
- [x] 2.4 Selecionar um código, depois mudar o filtro de Instrutor ou Situação de forma que aquele código saia do novo escopo: seleção volta para "Todos" automaticamente, sem erro
- [x] 2.5 Selecionar um código, depois trocar Projeto ou Aditivo: seleção de código é limpa (mesmo comportamento de Instrutor/Situação)
- [x] 2.6 Refresh numa URL com `?codigo=X`: seleção é restaurada corretamente
- [x] 2.7 Ordenação por clique na coluna "Código" da tabela continua funcionando normalmente (regressão, não deve ter sido afetada)
- [x] 2.8 Sem erros no console; nenhuma requisição de rede nova disparada pela seleção de código
