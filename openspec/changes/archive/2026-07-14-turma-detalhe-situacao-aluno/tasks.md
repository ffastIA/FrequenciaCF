## Implementation

### Task 1: Criar utility de mapeamento de situação

Criar arquivo `frontend/src/utils/formatSituacaoAluno.js` com função:

```javascript
const SITUACAO_MAP = {
  0: 'Não especificado',
  1: 'Matriculado',
  2: 'Concluiu',
  3: 'Desistiu',
  4: 'Evadido',
  5: 'Não aprovado',
  6: 'Não iniciou',
  7: 'Ativo',
  8: 'Transferido',
};

export function formatSituacaoAluno(situacao) {
  return SITUACAO_MAP[situacao] || 'Desconhecido';
}
```

**Verification**: função retorna string correta para cada valor 0-8.

### Task 2: Adicionar coluna "Situação" em TurmaDetalhe.jsx

Em `frontend/src/pages/TurmaDetalhe.jsx`:

1. Importar `formatSituacaoAluno` do utility.
2. No array `colunas`, adicionar coluna "Situação" como segunda entrada (após "Aluno"):
   ```javascript
   {
     rotulo: 'Situação',
     valor: (aluno) => formatSituacaoAluno(aluno.matricula.situacao),
     chave: 'situacao',
   }
   ```
3. Atualizar `colunasExportacao` para incluir "Situação" (mesmo padrão, mesmo valor formatado).

**Verification**: nova coluna renderiza entre "Aluno" e "Quantidade de faltas"; todos os valores exibem corretamente.

### Task 3: Validar ordenação

Garantir que a coluna é ordenável via clique no cabeçalho (comportamento padrão, sem código extra necessário — se o array `colunas` tem `chave: 'situacao'`, a ordenação já funciona).

**Verification**: clicar em "Situação" ordena a tabela por `matricula.situacao` e atualiza a URL com `?ordenacao=situacao` ou `?ordenacao=-situacao`.

### Task 4: Validar Excel export

Ao exportar, incluir a coluna "Situação" com valor formatado.

**Verification**: arquivo `.xlsx` inclui "Situação" com valores como "Ativo", "Evadido", etc. (não numéricos).

### Task 5: Testar em browser

- Carregar uma turma com múltiplos alunos em situações diferentes (Ativo, Evadido, Concluiu, etc.).
- Verificar coluna renderiza corretamente.
- Clicar em "Situação" para ordenar.
- Exportar para Excel e validar coluna.
- Recarregar e confirmar ordenação é preservada na URL.

**Verification**: tudo funciona sem erros no browser; nenhuma regressão em outras funcionalidades.
