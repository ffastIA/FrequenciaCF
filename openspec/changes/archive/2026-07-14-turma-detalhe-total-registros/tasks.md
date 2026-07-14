## Implementation

### Task 1: Adicionar CSS para o Card de Totalizador

Em `frontend/src/index.css`, adicionar estilos para o card de totalizador:

```css
.total-alunos-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 18px;
  background: var(--cor-superficie);
  border: 1px solid var(--cor-borda);
  border-radius: 6px;
  min-width: 140px;
}

.total-alunos-card span:first-child {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cor-texto-suave);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.total-alunos-card span:last-child {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--cor-primaria);
}
```

**Verification**: card renderiza com estilo limpo e consistente com o design system.

### Task 2: Modificar .filter-bar em TurmaDetalhe.jsx

Alterar o `.filter-bar` que contém o dropdown de situação para um **flex container que agrupa filtro + totalizador**:

```jsx
<div className="filter-bar" style={{ gap: '16px', alignItems: 'flex-end' }}>
  <div className="filter-field">
    <span>Situação</span>
    <select value={situacaoSelecionada} onChange={(e) => handleMudarSituacao(e.target.value)}>
      {/* opções */}
    </select>
  </div>
  
  <div className="total-alunos-card">
    <span>Alunos exibidos</span>
    <span>{alunos.length}</span>
  </div>
</div>
```

Usar `alignItems: 'flex-end'` para alinhar o card com a base do input (altura consistente).

**Verification**: card aparece ao lado do dropdown; ambos alinhados visualmente.

### Task 3: Garantir Atualização em Tempo Real

A renderização do card já está ligada ao estado `alunos`, que é atualizado quando `situacaoSelecionada` muda (via `useEffect`). Não é necessário lógica adicional:

```javascript
// Já existe:
// useEffect(..., [idTurma, situacaoSelecionada])  ← recarrega alunos ao mudar filtro
// setAlunos(alunosResultado)  ← atualiza estado

// O card renderiza:
<span>{alunos.length}</span>  ← reflete a lista atualizada automaticamente
```

**Verification**: ao mudar o dropdown, o número no card atualiza imediatamente.

### Task 4: Testar Responsividade

- Desktop: card e dropdown lado a lado
- Mobile (viewport <768px): `.filter-bar` pode quebrar em múltiplas linhas; card fica legível
- Verificar em múltiplos tamanhos de tela

**Verification**: layout é limpo e agradável em todos os tamanhos.

### Task 5: Testar Casos Extremos

- Filtro "Ativo" com 6 alunos → card mostra "6"
- Filtro "Evadido" com 0 alunos → card mostra "0"
- Filtro "Todos" com 12 alunos → card mostra "12"
- Mudar filtro rapidamente → card acompanha todas as mudanças

**Verification**: card sempre exibe o valor correto sem atrasos.
