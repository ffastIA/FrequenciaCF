## frontend-dashboard

### MODIFIED: Detalhe de turma — filtro e totalizador de alunos

#### Description
Tela TurmaDetalhe exibe filtro de situação e tabela de alunos.

#### Changed Requirement
Adicionar um card/quadro mostrando o total de alunos que correspondem ao filtro de situação selecionado. O card deve estar posicionado ao lado do dropdown de filtro, formando uma barra de controle clara e harmoniosa.

#### Scenarios
- **Card renderiza com total de alunos:**
  - Dado filtro "Ativo" selecionado, card mostra "6" (número de alunos ativos)
  - Dado filtro "Evadido" selecionado, card mostra "2" (número de alunos evadidos)
  - Dado filtro "Todos" selecionado, card mostra "12" (total de alunos na turma)
  - Dado nenhum aluno corresponde ao filtro, card mostra "0"

- **Card atualiza em tempo real:**
  - Ao mudar o dropdown de "Ativo" para "Evadido", o número no card atualiza imediatamente
  - Não requer recarregar a página

- **Posicionamento e layout:**
  - Card está ao lado do dropdown no mesmo `.filter-bar`
  - Em desktop: lado a lado horizontalmente
  - Em mobile: pode quebrar em múltiplas linhas mantendo legibilidade
  - Layout é simples, sem cores variáveis ou estados

- **Label e formatação:**
  - Label: "Alunos exibidos" ou "Total de alunos"
  - Número em fonte grande e destacada
  - Estilo: similar ao `.metric-highlight` existente, mas menor e integrado

#### Acceptance Criteria
- ✅ Card renderiza ao lado do dropdown de situação
- ✅ Card mostra o número total de alunos do filtro selecionado
- ✅ Número atualiza em tempo real ao mudar filtro
- ✅ Layout é harmoniônico e aproveita bem o espaço disponível
- ✅ Responsivo em desktop e mobile
- ✅ Sem mudanças no backend
