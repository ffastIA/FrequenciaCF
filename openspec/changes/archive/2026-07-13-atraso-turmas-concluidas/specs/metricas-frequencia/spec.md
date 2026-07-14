## MODIFIED Requirements

### Requirement: Dias de atraso no lançamento por turma
O sistema SHALL calcular, para uma turma, os dias de atraso no lançamento de frequência como `hoje - data da aula mais recente da turma (com data <= hoje) que já teve frequência efetivamente lançada`, onde "aula lançada" segue a definição desta capability (`aula.status = 1` e ao menos um registro em `frequencia` com `presenca <> 0`; placeholders e aulas não realizadas com dado pré-copiado não contam). Quando a turma nunca teve nenhuma frequência efetivamente lançada, o sistema SHALL usar a aula mais antiga da turma com `data <= hoje` como referência (`dataReferencia`). Quando a turma não possui nenhuma aula com `data <= hoje`, o sistema SHALL retornar `diasAtraso: null`. A "data atual" SHALL ser calculada no fuso `America/Sao_Paulo`, não pelo `CURDATE()` do MySQL.

**Exceção para turmas concluídas**: quando `turma.status = 3` ("Concluída") e `turma.data_fim` estiver preenchida, o sistema SHALL calcular `diasAtraso` como a diferença entre `data_fim` e `dataReferencia` (em vez de `hoje - dataReferencia`), com piso em `0` quando `dataReferencia` for posterior a `data_fim` (lançamento ocorrido depois do término oficial da turma — não representa atraso pendente). A busca de `dataReferencia`/`dataUltimoLancamento` em si (qual aula é a referência) SHALL NOT mudar — continua restrita a `data <= hoje`, preservando seu significado de "data real do último lançamento" independentemente da situação da turma. Para turmas concluídas sem `data_fim` preenchida, e para qualquer outra situação de turma, o cálculo SHALL permanecer `hoje - dataReferencia`, sem alteração.

#### Scenario: Turma com lançamentos recentes
- **WHEN** a aula mais recente com lançamento real (`status = 1`, `presenca <> 0`) de uma turma **não concluída** foi há 4 dias
- **THEN** `diasAtraso = 4`

#### Scenario: Aula recente só com placeholders é ignorada
- **WHEN** a aula mais recente da turma (`data <= hoje`) só tem registros `presenca = 0`, mas há uma aula anterior com lançamento real
- **THEN** o cálculo de atraso usa a aula anterior com lançamento real, não a aula só com placeholders

#### Scenario: Aula agendada com dado pré-copiado é ignorada, mesmo com data <= hoje
- **WHEN** a aula mais recente da turma com `data <= hoje` está com `aula.status = 0` e frequência pré-copiada de uma aula anterior (`presenca <> 0`, mas não realizada de fato), e há uma aula anterior com `status = 1` genuinamente lançada
- **THEN** o cálculo de atraso usa a aula anterior `status = 1`, não a aula agendada com dado copiado

#### Scenario: Turma que nunca lançou nenhuma frequência real
- **WHEN** uma turma **não concluída** tem aulas com `data <= hoje` mas nenhuma satisfaz `status = 1` com `presenca <> 0`
- **THEN** `diasAtraso` é calculado a partir da aula mais antiga da turma com `data <= hoje` (`hoje - dataReferencia`)

#### Scenario: Turma ainda sem aulas passadas
- **WHEN** uma turma não tem nenhuma aula com `data <= hoje`
- **THEN** `diasAtraso: null`

#### Scenario: Turma concluída com lançamento antes do término
- **WHEN** uma turma tem `status = 3` e o último lançamento real (`dataReferencia`) ocorreu antes de `data_fim`
- **THEN** `diasAtraso` é a diferença em dias entre `data_fim` e `dataReferencia` (não `hoje - dataReferencia`)

#### Scenario: Turma concluída com lançamento depois do término
- **WHEN** uma turma tem `status = 3` e o último lançamento real (`dataReferencia`) ocorreu depois de `data_fim`
- **THEN** `diasAtraso = 0` (não um valor negativo)

#### Scenario: Turma concluída sem nenhum lançamento real
- **WHEN** uma turma tem `status = 3` e nunca teve frequência efetivamente lançada (cai no fallback da aula mais antiga)
- **THEN** `diasAtraso` é a diferença entre `data_fim` e a data da aula mais antiga (com piso em `0`, mesma regra dos demais casos concluídos)

#### Scenario: Turma concluída sem data_fim preenchida
- **WHEN** uma turma tem `status = 3` mas `data_fim` é `null`/ausente
- **THEN** o cálculo usa o comportamento padrão (`hoje - dataReferencia`), igual às demais situações

#### Scenario: Turma não concluída não é afetada
- **WHEN** uma turma tem `status` diferente de `3` (não especificado, não iniciada, iniciada ou cancelada)
- **THEN** `diasAtraso` continua calculado como `hoje - dataReferencia`, sem nenhuma mudança de comportamento
