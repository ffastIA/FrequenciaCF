## Implementation

### Task 1: Criar Mapa de Situações

Em `frontend/src/utils/` (ou aproveitar `formatSituacaoAluno.js`):

Adicionar um mapa de situações com as 9 valores (0-8) mapeados para rótulos. Este mapa será usado tanto para renderizar a coluna quanto para o dropdown.

```javascript
export const SITUACOES_ALUNO = {
  0: { label: 'Não especificado', value: 0 },
  1: { label: 'Matriculado', value: 1 },
  2: { label: 'Concluiu', value: 2 },
  3: { label: 'Desistiu', value: 3 },
  4: { label: 'Evadido', value: 4 },
  5: { label: 'Não aprovado', value: 5 },
  6: { label: 'Não iniciou', value: 6 },
  7: { label: 'Ativo', value: 7 },
  8: { label: 'Transferido', value: 8 },
};
```

**Verification**: mapa cobre todas as 9 situações (0-8).

### Task 2: Adicionar Estado do Filtro em TurmaDetalhe.jsx

Em `frontend/src/pages/TurmaDetalhe.jsx`:

1. Importar `SITUACOES_ALUNO` e mapa de situações
2. Adicionar estado para situação selecionada:
   ```javascript
   const [situacaoSelecionada, setSituacaoSelecionada] = useState(null);
   ```
3. Ler o parâmetro de URL `situacao` no mount:
   ```javascript
   const queryParams = new URLSearchParams(location.search);
   const situacaoUrl = queryParams.get('situacao');
   ```
4. Inicializar com "Ativo" (7) por default, ou com o valor da URL se presente

**Verification**: estado gerencia a situação selecionada; URL é lida corretamente.

### Task 3: Renderizar Dropdown de Filtro

Antes do `<h2 className="section-title">Alunos ativos</h2>`, adicionar:

```jsx
<div className="filter-bar">
  <div className="filter-field">
    <span>Situação</span>
    <select 
      value={situacaoSelecionada || ''}
      onChange={(e) => handleMudarSituacao(e.target.value)}
    >
      <option value="">Todos</option>
      {Object.entries(SITUACOES_ALUNO).map(([key, obj]) => (
        <option key={key} value={key}>
          {obj.label}
        </option>
      ))}
    </select>
  </div>
</div>
```

**Verification**: dropdown renderiza com todas as 10 opções; estilo é consistente com Projeto/Aditivo.

### Task 4: Implementar Lógica de Filtro

Adicionar função `handleMudarSituacao`:

```javascript
const handleMudarSituacao = (valor) => {
  const situacao = valor === '' ? null : parseInt(valor, 10);
  setSituacaoSelecionada(situacao);
  
  // Atualizar URL
  const params = new URLSearchParams(location.search);
  if (situacao === null) {
    params.delete('situacao');
  } else {
    params.set('situacao', situacao);
  }
  window.history.replaceState(null, '', `?${params.toString()}`);
};
```

Atualizar o `useEffect` que carrega alunos para passar `situacaoSelecionada`:

```javascript
Promise.all([getAlunos(idTurma, situacaoSelecionada), ...])
```

**Verification**: mudar o dropdown atualiza a URL e recarrega a tabela; valores filtram corretamente.

### Task 5: Inicializar com Default "Ativo"

No `useEffect` de inicialização, garantir que `situacaoSelecionada` começa com `7` ("Ativo"):

```javascript
useEffect(() => {
  const queryParams = new URLSearchParams(location.search);
  const situacaoUrl = queryParams.get('situacao');
  
  if (situacaoUrl !== null) {
    setSituacaoSelecionada(parseInt(situacaoUrl, 10));
  } else {
    setSituacaoSelecionada(7); // Default = Ativo
  }
}, [location.search]);
```

**Verification**: página inicia com "Ativo" selecionado; URL com `?situacao=4` inicia com "Evadido".

### Task 6: Testar em Browser

- Carregar turma → dropdown deve estar em "Ativo", tabela mostra apenas alunos ativos
- Mudar para "Evadido" → tabela atualiza em tempo real
- Mudar para "Todos" → tabela mostra todos os alunos
- Recarregar a página com URL contendo `?situacao=4` → dropdown fica em "Evadido"
- Ordenar e exportar respeitam o filtro selecionado
- Voltar ao Dashboard e retornar à turma → filtro é mantido (via URL)

**Verification**: tudo funciona; nenhuma regressão em ordenação, export ou navegação.

### Task 2: Validar Ordenação e Export

1. Clicar em cabeçalho "Situação" para ordenar — confirma que a tabela ordena todos os alunos (não apenas ativos)
2. Clicar "Exportar para Excel" — confirma que o arquivo inclui todos os alunos com a coluna "Situação"
3. Verificar no browser que não há erros de console

**Verification**: ordenação e export funcionam com a lista completa.

### Task 3: Testar em Browser

- Navegar para uma turma com alunos em múltiplas situações (ativo, evadido, matriculado, etc.)
- Verificar que todos os alunos aparecem na tabela
- Conferir que a coluna "Situação" mostra valores variados (não todos "Ativo")
- Ordenar por "Situação" e confirmar que alunos com diferentes situações aparecem
- Exportar e abrir o arquivo Excel — confirma que todos os alunos estão presentes

**Verification**: tudo funciona sem erros; nenhuma regressão em outras funcionalidades.
