# Metadata do banco `CentroFormacao`

Host de origem: `prod.idear.org.br`

Total de tabelas: **75**  
Total de relacionamentos (FK): **108**

## Índice de tabelas

- [aluno](#aluno)
- [aluno_nome](#aluno_nome)
- [art_artesao_empreendedor](#art_artesao_empreendedor)
- [art_artesao_empreendedor_feiras](#art_artesao_empreendedor_feiras)
- [art_artesao_empreendedor_produtos](#art_artesao_empreendedor_produtos)
- [art_artesao_empreendedor_tipologias](#art_artesao_empreendedor_tipologias)
- [art_produto](#art_produto)
- [art_tipologia](#art_tipologia)
- [atendimento](#atendimento)
- [atendimento_encaminhamentos](#atendimento_encaminhamentos)
- [atividade](#atividade)
- [aula](#aula)
- [aula_padrao](#aula_padrao)
- [cad_integrado](#cad_integrado)
- [cad_integrado_cursos](#cad_integrado_cursos)
- [cad_integrado_entrevista](#cad_integrado_entrevista)
- [cad_integrado_ligacoes](#cad_integrado_ligacoes)
- [cad_online_costura](#cad_online_costura)
- [cad_online_despertar](#cad_online_despertar)
- [cad_online_geral_ligacoes](#cad_online_geral_ligacoes)
- [cad_online_ideartec](#cad_online_ideartec)
- [cad_online_prog_acao](#cad_online_prog_acao)
- [cad_online_prog_itinerante](#cad_online_prog_itinerante)
- [cadastro_online](#cadastro_online)
- [cadastro_online_analise](#cadastro_online_analise)
- [cadastro_online_ligacoes](#cadastro_online_ligacoes)
- [cadastro_online_log](#cadastro_online_log)
- [convocacao_cha](#convocacao_cha)
- [convocacao_cha_ligacoes](#convocacao_cha_ligacoes)
- [criterio_cad_integrado](#criterio_cad_integrado)
- [curso](#curso)
- [curso_cad_integrado](#curso_cad_integrado)
- [curso_cad_online_costura](#curso_cad_online_costura)
- [curso_cad_online_despertar](#curso_cad_online_despertar)
- [curso_cad_online_geral](#curso_cad_online_geral)
- [curso_cad_online_prog_acao](#curso_cad_online_prog_acao)
- [curso_cad_online_prog_itinerante](#curso_cad_online_prog_itinerante)
- [curso_criterios_cad_integrado](#curso_criterios_cad_integrado)
- [curso_nome](#curso_nome)
- [escola](#escola)
- [estagiario](#estagiario)
- [evasao](#evasao)
- [feriado](#feriado)
- [frequencia](#frequencia)
- [grupo_minoritario](#grupo_minoritario)
- [instrutor](#instrutor)
- [instrutor_projetos](#instrutor_projetos)
- [local](#local)
- [matricula](#matricula)
- [matricula_modulos](#matricula_modulos)
- [meta_turma](#meta_turma)
- [modalidade](#modalidade)
- [modulo](#modulo)
- [mtv_fora_perf_cad_online](#mtv_fora_perf_cad_online)
- [municipio](#municipio)
- [nivel_escolar](#nivel_escolar)
- [pre_insc_ead](#pre_insc_ead)
- [projeto](#projeto)
- [projeto_aditivo](#projeto_aditivo)
- [psicoagenda](#psicoagenda)
- [raca](#raca)
- [seg_aplicacoes](#seg_aplicacoes)
- [seg_grupos](#seg_grupos)
- [seg_grupos_aplicacoes](#seg_grupos_aplicacoes)
- [seg_usuarios](#seg_usuarios)
- [seg_usuarios_projetos](#seg_usuarios_projetos)
- [status_cad_online](#status_cad_online)
- [status_cad_online_despertar](#status_cad_online_despertar)
- [status_cad_online_geral](#status_cad_online_geral)
- [status_cad_online_prog_acao](#status_cad_online_prog_acao)
- [status_cad_online_prog_itinerante](#status_cad_online_prog_itinerante)
- [tablets_temp](#tablets_temp)
- [tipo_atendimento](#tipo_atendimento)
- [turma](#turma)
- [turma_dias](#turma_dias)

## Tabelas

### aluno

- Engine: `InnoDB` | Linhas aprox.: 23834
- Chave primária: `id_aluno`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_aluno | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(100) | não |  | NOT NULL |  |
| data_nasc | date | não |  | NOT NULL |  |
| sexo | char(1) | não |  | NOT NULL |  |
| outro_sexo | varchar(20) | não |  | NOT NULL |  |
| rg | varchar(30) | não |  | NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| nis | varchar(11) | não |  | NOT NULL |  |
| pis | varchar(15) | não |  | NOT NULL |  |
| endereco | varchar(100) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| cep | varchar(9) | não |  | NOT NULL |  |
| telefone1 | varchar(50) | não |  | NOT NULL |  |
| telefone2 | varchar(15) | não |  | NOT NULL |  |
| whatsapp | varchar(15) | não |  | NOT NULL |  |
| filiacao | varchar(100) | não |  | NOT NULL |  |
| trabalhando | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| local_trabalho | varchar(100) | não |  | NOT NULL |  |
| email | varchar(50) | não |  | NOT NULL |  |
| facebook | varchar(50) | não |  | NOT NULL |  |
| instagram | varchar(100) | não |  | NOT NULL |  |
| ajudante | varchar(200) | não |  | NOT NULL |  |
| possui_ajudante | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| nome_ajudante | varchar(100) | não |  | NOT NULL |  |
| telefone_ajudante | varchar(20) | não |  | NOT NULL |  |
| ligacao_ajudante | smallint(6) | não | 0 | NOT NULL | 1: filho(a) / 2: neto(a) / 3: irmão(a) / 4: esposo(a) / 5: amigo(a) / 6: outra |
| outra_ligacao_ajudante | varchar(100) | não |  | NOT NULL |  |
| raca | smallint(6) | não | 0 | NOT NULL | 0: Não especificado, 1: Preto, 2: Pardo, 3: Branco, 4: Indígena, 5: Amarelo, 6: Outros |
| outra_raca | varchar(50) | não |  | NOT NULL |  |
| pulsos | varchar(50) | não |  | NOT NULL |  |
| n_serie_tablet | varchar(50) | não |  | NOT NULL |  |
| info_chip | varchar(255) | não |  | NOT NULL |  |
| operadora_tablet | varchar(50) | não |  | NOT NULL |  |
| email_tablet | varchar(255) | não |  | NOT NULL |  |
| marca_tablet | varchar(255) | não |  | NOT NULL |  |
| modelo_tablet | varchar(255) | não |  | NOT NULL |  |
| condicoes | text | não |  | NOT NULL |  |
| outra_condicao | varchar(255) | não |  | NOT NULL |  |
| laudo_condicao | varchar(255) | não |  | NOT NULL |  |
| matricula_moodle | varchar(50) | não |  | NOT NULL |  |
| id_escola | int(11) | não |  | FK, NOT NULL |  |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| turno | tinyint(1) | não |  | NOT NULL | 0 - não especificado / 1 - manhã / 2 - tarde / 3 - noite / 4: integral |
| turma | varchar(10) | não |  | NOT NULL |  |
| nome_responsavel | varchar(100) | não |  | NOT NULL |  |
| cpf_responsavel | varchar(14) | não |  | NOT NULL |  |
| parentesco_responsavel | varchar(15) | não |  | NOT NULL |  |
| responsavel_trabalhando | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| cargo_responsavel | varchar(50) | não |  | NOT NULL |  |
| pis_responsavel | varchar(30) | não |  | NOT NULL |  |
| socio_pessoas | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: sozinho / 3: 1 a 3 / 4: 4 a 7 / 5: 8 a 10 / 6: 10 ou mais |
| socio_bolsa_familia | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: sim / 3: não |
| socio_casa | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: propria / 3: alugada / 4: cedida |
| socio_mora_com | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pais / 3: mãe / 4: pai / 5: avos / 6: tios / 7: outros |
| socio_mora_outros | varchar(50) | não |  | NOT NULL |  |
| socio_escolaridade_pai | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_escolaridade_mae | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_despesas | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pai e mãe / 3: apenas mãe / 4: apenas pai / 5: avó / 6: avô / 7: irmão ou irmã / 8: tios / 9: ninguém |
| socio_renda | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: nenhuma / 3: menos de 1 SM / 4: 1 a 2 SMs / 5: 2 a 3 SMs / 6: acima de 3 SMs |
| socio_pretensao | tinyint(2) | não |  | NOT NULL | 1: não especificado / 2: não sei / 3: administração / 4: artes / 5: ciências biológicas / 6: análise e desenvolvimento / 7: ciências sociais / 8: comunicação / 9: engenharia / 10: saúde |
| data_inclusao | date | sim |  |  |  |
| moodle_id | int(11) | sim |  |  |  |
| site | tinyint(1) | não | 0 | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_escola` → `escola(id_escola)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `atendimento.id_aluno` → `aluno(id_aluno)`
- `cad_integrado.id_registro_oficial` → `aluno(id_aluno)`
- `convocacao_cha_ligacoes.id_aluno` → `aluno(id_aluno)`
- `frequencia.id_aluno` → `aluno(id_aluno)`
- `matricula.id_aluno` → `aluno(id_aluno)`
- `pre_insc_ead.id_aluno` → `aluno(id_aluno)`

**Índices:**

- `id_escola` (NON-UNIQUE, BTREE): id_escola
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `PRIMARY` (UNIQUE, BTREE): id_aluno

---

### aluno_nome

_VIEW_

- Engine: `None` | Linhas aprox.: None
- Chave primária: `-`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_aluno | int(11) | não | 0 | NOT NULL |  |
| aluno_nome | varchar(117) | não |  | NOT NULL |  |

---

### art_artesao_empreendedor

- Engine: `InnoDB` | Linhas aprox.: 189
- Chave primária: `id_artesao_empreendedor`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_artesao_empreendedor | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(200) | não |  | NOT NULL |  |
| data_cadastro | date | não |  | NOT NULL |  |
| tipo_cadastro | smallint(6) | não |  | NOT NULL | 1: artesão / 2: empreendedor |
| numero_carteira | varchar(100) | não |  | NOT NULL |  |
| sexo | char(1) | não |  | NOT NULL |  |
| endereco | varchar(255) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| telefone_1 | varchar(20) | não |  | NOT NULL |  |
| telefone_2 | varchar(20) | não |  | NOT NULL |  |
| telefone_3 | varchar(20) | não |  | NOT NULL |  |
| rg | varchar(20) | não |  | NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| email | varchar(255) | não |  | NOT NULL |  |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| id_tipologia_principal | int(11) | não |  | FK, NOT NULL |  |
| situacao_negocio | smallint(6) | não |  | NOT NULL | 1: formal / 2: informal |
| cnpj | varchar(18) | não |  | NOT NULL |  |
| quem_ensinou | varchar(255) | não |  | NOT NULL |  |
| quando_iniciou | varchar(100) | não |  | NOT NULL |  |
| faturamento | varchar(50) | não |  | NOT NULL |  |
| quantos_familiares_ajudam | int(11) | não |  | NOT NULL |  |
| fabricacao_mensal | varchar(100) | não |  | NOT NULL |  |
| outra_ocupacao | varchar(255) | não |  | NOT NULL |  |
| tem_computador | tinyint(4) | não | 1 | NOT NULL | 0: não / 1: sim |
| tem_internet | tinyint(4) | não | 1 | NOT NULL | 0: não / 1: sim |
| tem_conta_bancaria | tinyint(4) | não | 1 | NOT NULL | 0: não / 1: sim |
| qual_banco | varchar(255) | não |  | NOT NULL |  |
| onde_compra_mp | varchar(255) | não |  | NOT NULL |  |
| participa_feiras | tinyint(4) | não | 1 | NOT NULL | 0: não / 1: sim |
| outras_formas_venda | smallint(6) | não |  | NOT NULL | 1: casa / 2: porta em porta / 3: loja / 4: redes sociais / 5: outros |
| principais_clientes | smallint(6) | não |  | NOT NULL | 1: pessoas do bairro / 2: clientes de feira / 3: lojistas / 4: outros |
| origem_vendas | smallint(6) | não |  | NOT NULL | 1: varejo / 2: sob encomenda / 3: outros |
| associacao | tinyint(4) | não | 1 | NOT NULL | 0: não / 1: sim |
| qual_associacao | varchar(255) | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_tipologia_principal` → `art_tipologia(id_tipologia)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `art_artesao_empreendedor_produtos.id_artesao_empreendedor` → `art_artesao_empreendedor(id_artesao_empreendedor)`
- `art_artesao_empreendedor_tipologias.id_artesao_empreendedor` → `art_artesao_empreendedor(id_artesao_empreendedor)`

**Índices:**

- `cpf` (UNIQUE, BTREE): cpf
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `id_tipologia_principal` (NON-UNIQUE, BTREE): id_tipologia_principal
- `PRIMARY` (UNIQUE, BTREE): id_artesao_empreendedor

---

### art_artesao_empreendedor_feiras

- Engine: `InnoDB` | Linhas aprox.: 0
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| id_artesao_empreendedor | int(11) | não |  | NOT NULL |  |
| feira | varchar(200) | não |  | NOT NULL |  |
| local | varchar(255) | não |  | NOT NULL |  |
| media_vendas | varchar(100) | não |  | NOT NULL |  |
| periodicidade | smallint(6) | não |  | NOT NULL | 1: semanal / 2: mensal / 3: bimestral |

**Índices:**

- `id_artesao_empreendedor` (UNIQUE, BTREE): id_artesao_empreendedor, feira
- `PRIMARY` (UNIQUE, BTREE): id

---

### art_artesao_empreendedor_produtos

- Engine: `InnoDB` | Linhas aprox.: 316
- Chave primária: `id_artesao_empreendedor, id_produto`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_artesao_empreendedor | int(11) | não |  | PK, FK, NOT NULL |  |
| id_produto | int(11) | não |  | PK, FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_artesao_empreendedor` → `art_artesao_empreendedor(id_artesao_empreendedor)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_produto` → `art_produto(id_produto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_produto` (NON-UNIQUE, BTREE): id_produto
- `PRIMARY` (UNIQUE, BTREE): id_artesao_empreendedor, id_produto

---

### art_artesao_empreendedor_tipologias

- Engine: `InnoDB` | Linhas aprox.: 134
- Chave primária: `id_artesao_empreendedor, id_tipologia`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_artesao_empreendedor | int(11) | não |  | PK, FK, NOT NULL |  |
| id_tipologia | int(11) | não |  | PK, FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_artesao_empreendedor` → `art_artesao_empreendedor(id_artesao_empreendedor)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_tipologia` → `art_tipologia(id_tipologia)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_tipologia` (NON-UNIQUE, BTREE): id_tipologia
- `PRIMARY` (UNIQUE, BTREE): id_artesao_empreendedor, id_tipologia

---

### art_produto

- Engine: `InnoDB` | Linhas aprox.: 47
- Chave primária: `id_produto`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_produto | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(255) | não |  | NOT NULL |  |

**Referenciada por:**

- `art_artesao_empreendedor_produtos.id_produto` → `art_produto(id_produto)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `PRIMARY` (UNIQUE, BTREE): id_produto

---

### art_tipologia

- Engine: `InnoDB` | Linhas aprox.: 32
- Chave primária: `id_tipologia`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_tipologia | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(255) | não |  | NOT NULL |  |

**Referenciada por:**

- `art_artesao_empreendedor.id_tipologia_principal` → `art_tipologia(id_tipologia)`
- `art_artesao_empreendedor_tipologias.id_tipologia` → `art_tipologia(id_tipologia)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `PRIMARY` (UNIQUE, BTREE): id_tipologia

---

### atendimento

- Engine: `InnoDB` | Linhas aprox.: 23541
- Chave primária: `id_atendimento`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_atendimento | int(11) | não |  | PK, NOT NULL |  |
| id_turma | int(11) | não |  | FK, NOT NULL |  |
| id_aluno | int(11) | não |  | FK, NOT NULL |  |
| id_usuario_responsavel | int(11) | sim |  | FK |  |
| responsavel | varchar(100) | não |  | NOT NULL |  |
| data | date | não |  | NOT NULL |  |
| modalidade | tinyint(4) | sim | 0 |  | 1: presencial / 2: online / 3: telefone |
| id_tipo_atendimento | int(11) | não |  | FK, NOT NULL |  |
| realizado | tinyint(1) | sim |  |  | 0: não / 1: sim |
| situacao | tinyint(1) | não |  | NOT NULL | 0: pendente / 1: falha / 2: sucesso / 3: crítico |
| obs | text | não |  | NOT NULL |  |
| data_conclusao | date | sim |  |  |  |
| hora_conclusao | time | sim |  |  |  |

**Chaves estrangeiras (referencia):**

- `id_turma` → `turma(id_turma)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_aluno` → `aluno(id_aluno)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_usuario_responsavel` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_tipo_atendimento` → `tipo_atendimento(id_tipo_atendimento)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `atendimento_encaminhamentos.id_atendimento` → `atendimento(id_atendimento)`

**Índices:**

- `id_aluno` (NON-UNIQUE, BTREE): id_aluno
- `id_tipo_atendimento` (NON-UNIQUE, BTREE): id_tipo_atendimento
- `id_turma` (NON-UNIQUE, BTREE): id_turma
- `id_usuario_responsavel` (NON-UNIQUE, BTREE): id_usuario_responsavel
- `PRIMARY` (UNIQUE, BTREE): id_atendimento

---

### atendimento_encaminhamentos

- Engine: `InnoDB` | Linhas aprox.: 2371
- Chave primária: `id_encaminhamento`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_encaminhamento | int(11) | não |  | PK, NOT NULL |  |
| id_atendimento | int(11) | não |  | FK, NOT NULL |  |
| data | date | não |  | NOT NULL |  |
| id_usuario_origem | int(11) | não |  | FK, NOT NULL |  |
| id_usuario_destino | int(11) | não |  | FK, NOT NULL |  |
| obs | text | não |  | NOT NULL |  |
| data_limite | date | sim |  |  |  |
| acao_realizada | text | não |  | NOT NULL |  |
| inativo | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| visto | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |

**Chaves estrangeiras (referencia):**

- `id_atendimento` → `atendimento(id_atendimento)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_usuario_origem` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_usuario_destino` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_atendimento` (NON-UNIQUE, BTREE): id_atendimento
- `id_usuario_destino` (NON-UNIQUE, BTREE): id_usuario_destino
- `id_usuario_origem` (NON-UNIQUE, BTREE): id_usuario_origem
- `PRIMARY` (UNIQUE, BTREE): id_encaminhamento

---

### atividade

- Engine: `InnoDB` | Linhas aprox.: 826
- Chave primária: `id_atividade`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_atividade | int(11) | não |  | PK, NOT NULL |  |
| id_curso | int(11) | não |  | FK, NOT NULL |  |
| numero | varchar(30) | não |  | NOT NULL |  |
| descricao | text | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_curso` → `curso(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `aula.id_atividade` → `atividade(id_atividade)`

**Índices:**

- `id_curso` (UNIQUE, BTREE): id_curso, numero
- `PRIMARY` (UNIQUE, BTREE): id_atividade

---

### aula

- Engine: `InnoDB` | Linhas aprox.: 39575
- Chave primária: `id_aula`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_aula | int(11) | não |  | PK, NOT NULL |  |
| id_turma | int(11) | não |  | FK, NOT NULL |  |
| id_modulo | int(11) | sim |  | FK |  |
| id_aula_padrao | int(11) | sim |  | FK |  |
| id_instrutor | int(11) | sim |  | FK |  |
| data | date | não |  | NOT NULL |  |
| carga_horaria | int(11) | não | 0 | NOT NULL |  |
| id_modalidade | int(11) | não |  | FK, NOT NULL |  |
| descricao | text | não |  | NOT NULL |  |
| obs | text | não |  | NOT NULL |  |
| status | tinyint(4) | não |  | NOT NULL | 0: prevista / 1: realizada |
| id_atividade | int(11) | sim |  | FK |  |
| ch_atividade | int(11) | não | 0 | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_turma` → `turma(id_turma)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_modulo` → `modulo(id)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_aula_padrao` → `aula_padrao(id_aula_padrao)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_instrutor` → `instrutor(id_instrutor)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_modalidade` → `modalidade(id_modalidade)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_atividade` → `atividade(id_atividade)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `frequencia.id_aula` → `aula(id_aula)`

**Índices:**

- `id_atividade` (NON-UNIQUE, BTREE): id_atividade
- `id_aula_padrao` (NON-UNIQUE, BTREE): id_aula_padrao
- `id_instrutor` (NON-UNIQUE, BTREE): id_instrutor
- `id_modalidade` (NON-UNIQUE, BTREE): id_modalidade
- `id_modulo` (NON-UNIQUE, BTREE): id_modulo
- `id_turma` (NON-UNIQUE, BTREE): id_turma
- `PRIMARY` (UNIQUE, BTREE): id_aula

---

### aula_padrao

- Engine: `InnoDB` | Linhas aprox.: 3047
- Chave primária: `id_aula_padrao`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_aula_padrao | int(11) | não |  | PK, NOT NULL |  |
| id_modulo | int(11) | não |  | FK, NOT NULL |  |
| numero | varchar(20) | não |  | NOT NULL |  |
| titulo | text | não |  | NOT NULL |  |
| descricao | text | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_modulo` → `modulo(id)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `aula.id_aula_padrao` → `aula_padrao(id_aula_padrao)`

**Índices:**

- `id_modulo` (UNIQUE, BTREE): id_modulo, numero
- `PRIMARY` (UNIQUE, BTREE): id_aula_padrao

---

### cad_integrado

- Engine: `InnoDB` | Linhas aprox.: 281
- Chave primária: `id_cad_integrado`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_cad_integrado | int(11) | não |  | PK, NOT NULL |  |
| modo | tinyint(1) | não |  | NOT NULL | 0: pessoa / 1: parente ou amigo / 2: instituicao |
| instituicao | varchar(255) | não |  | NOT NULL |  |
| nome_cadastrante | varchar(100) | não |  | NOT NULL |  |
| telefone_cadastrante | varchar(20) | não |  | NOT NULL |  |
| nome | varchar(100) | não |  | NOT NULL |  |
| rg | varchar(20) | não |  | NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| sexo | char(1) | não |  | NOT NULL | M, F, O |
| outro_sexo | varchar(20) | não |  | NOT NULL |  |
| estado_civil | smallint(6) | não |  | NOT NULL | 1: solteiro, 2: união estável, 3: casado, 4: viúvo, 5: divorciado, 6: outro |
| outro_ec | varchar(20) | não |  | NOT NULL |  |
| raca | smallint(6) | não |  | NOT NULL | 1: Preto, 2: Pardo, 3: Branco, 4: Indígena, 5: Amarelo, 6: Outros |
| outra_raca | varchar(20) | não |  | NOT NULL |  |
| deficiencia | smallint(6) | não |  | NOT NULL | 1: fisica, 2: visual, 3: auditiva, 4: intelectual, 5: multipla, 6: não, 7: outra |
| outra_deficiencia | varchar(50) | não |  | NOT NULL |  |
| grau_deficiencia | smallint(6) | não | 0 | NOT NULL | 1: leve / 2: moderada / 3: severa |
| telefone1 | varchar(20) | não |  | NOT NULL |  |
| telefone2 | varchar(20) | não |  | NOT NULL |  |
| whatsapp | varchar(20) | não |  | NOT NULL |  |
| tamanho_camisa | smallint(6) | não |  | NOT NULL | 1: PP, 2: P, 3: M, 4: G, 5: GG, 6: XG |
| modalidade | smallint(6) | não |  | NOT NULL | 1: presencial / 2: online / 3: ambos |
| endereco | varchar(255) | não |  | NOT NULL |  |
| numero | varchar(20) | não |  | NOT NULL |  |
| complemento | varchar(100) | não |  | NOT NULL |  |
| cep | varchar(9) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| estado | varchar(50) | não |  | NOT NULL |  |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| trabalha | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| desc_trabalho | varchar(100) | não |  | NOT NULL |  |
| turno_trabalho | smallint(6) | não | 0 | NOT NULL | 1: manhã, 2: tarde, 3: manhã e tarde, 4: noite |
| atv_extra | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| desc_atv_extra | varchar(100) | não |  | NOT NULL |  |
| turno_atv_extra | smallint(6) | não | 0 | NOT NULL | 1: manhã, 2: tarde, 3: manhã e tarde, 4: noite |
| internet | smallint(6) | não |  | NOT NULL | 1: dados moveis, 2: internet cabeada, 3: wifi, 4: não possui |
| melhor_operadora | smallint(6) | não |  | NOT NULL | 0: nenhuma, 1: oi, 2: tim, 3: vivo, 4: claro |
| turno | text | não |  | NOT NULL |  |
| dh_inclusao | datetime | sim |  |  |  |
| id_registro_oficial | int(11) | sim |  | FK |  |

**Chaves estrangeiras (referencia):**

- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_registro_oficial` → `aluno(id_aluno)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `cad_integrado_cursos.id_cad_integrado` → `cad_integrado(id_cad_integrado)`
- `cad_integrado_entrevista.id_cad_integrado` → `cad_integrado(id_cad_integrado)`
- `cad_integrado_ligacoes.id_cad_integrado` → `cad_integrado(id_cad_integrado)`

**Índices:**

- `cad_integrado_ibfk_2` (NON-UNIQUE, BTREE): id_registro_oficial
- `cpf` (UNIQUE, BTREE): cpf
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `PRIMARY` (UNIQUE, BTREE): id_cad_integrado

---

### cad_integrado_cursos

- Engine: `InnoDB` | Linhas aprox.: 302
- Chave primária: `-`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_cad_integrado | int(11) | não |  | FK, NOT NULL |  |
| id_curso | int(11) | não |  | FK, NOT NULL |  |
| data_inclusao | date | não |  | NOT NULL |  |
| lotado | tinyint(1) | não | 0 | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_cad_integrado` → `cad_integrado(id_cad_integrado)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_curso` → `curso_cad_integrado(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_cad_integrado` (UNIQUE, BTREE): id_cad_integrado, id_curso
- `id_curso` (NON-UNIQUE, BTREE): id_curso

---

### cad_integrado_entrevista

- Engine: `InnoDB` | Linhas aprox.: 29
- Chave primária: `id_entrevista`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_entrevista | int(11) | não |  | PK, NOT NULL |  |
| id_cad_integrado | int(11) | não |  | FK, NOT NULL |  |
| id_projeto | int(11) | não |  | FK, NOT NULL |  |
| id_usuario_entrevista | int(11) | sim |  | FK |  |
| whatsapp_grupos | varchar(255) | não |  | NOT NULL |  |
| email | varchar(255) | não |  | NOT NULL |  |
| nome_responsavel | varchar(200) | não |  | NOT NULL |  |
| contato_responsavel | varchar(50) | não |  | NOT NULL |  |
| parentesco_responsavel | smallint(6) | não |  | NOT NULL | 1: filho(a) / 2: neto(a) / 3: irmão(a) / 4: esposo(a) / 5: amigo(a) / 6: outra |
| outro_par_responsavel | varchar(100) | não |  | NOT NULL |  |
| pis_nis | varchar(50) | não |  | NOT NULL |  |
| horario_desejado | varchar(255) | não |  | NOT NULL |  |
| local_cadastro | smallint(6) | não |  | NOT NULL | 1: casa / 2: cate / 3: sine / 4: outro |
| outro_local_cadastro | varchar(100) | não |  | NOT NULL |  |
| nome_mae | varchar(200) | não |  | NOT NULL |  |
| nome_pai | varchar(200) | não |  | NOT NULL |  |
| identidade_genero | smallint(6) | não |  | NOT NULL | 1: feminina / 2: masculina / 3: trans / 4: travesti / 5: mulher trans / 6: homem trans / 7: não binário / 8: não respondeu / 9: outros |
| orientacao_sexual | smallint(6) | não |  | NOT NULL | 1: assexual / 2: bissexual / 3: pansexual / 4: heterossexual / 5: homossexual / 6: não respondeu / 7: outros |
| categoria | smallint(6) | não |  | NOT NULL | 1: trabalhador formal / 2: trabalhador informal / 3: dona de casa / 4: desempregado / 5: estudante / 6: aprendiz /  / 7: estagiário / 8: empreendedor inf / 9: empreendedor form / 10: empreendedor social / 11: outro |
| outra_categoria | varchar(100) | não |  | NOT NULL |  |
| pretensao_profissional | varchar(255) | não |  | NOT NULL |  |
| experiencias_profissionais | text | não |  | NOT NULL |  |
| area_formacao | varchar(100) | não |  | NOT NULL |  |
| medicacoes | text | não |  | NOT NULL |  |
| outras_medicacoes | varchar(255) | não |  | NOT NULL |  |
| redes_sociais | text | não |  | NOT NULL |  |
| outras_redes | varchar(255) | não |  | NOT NULL |  |
| estudante | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| tipo_escola | smallint(6) | não |  | NOT NULL | 1: publica / 2: privada |
| nome_escola | varchar(200) | não |  | NOT NULL |  |
| turno_escola | smallint(6) | não |  | NOT NULL | 1: manhã, 2: tarde, 3: manhã e tarde, 4: noite |
| serie_escola | varchar(50) | não |  | NOT NULL |  |
| curso_univ | varchar(50) | não |  | NOT NULL |  |
| dias_disp | varchar(50) | não |  | NOT NULL |  |
| equipamentos | text | não |  | NOT NULL |  |
| outros_equipamentos | varchar(255) | não |  | NOT NULL |  |
| equipamento_compart | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| possui_ajudante | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| nome_ajudante | varchar(200) | não |  | NOT NULL |  |
| contato_ajudante | varchar(50) | não |  | NOT NULL |  |
| parentesco_ajudante | smallint(6) | não |  | NOT NULL | 1: filho(a) / 2: neto(a) / 3: irmão(a) / 4: esposo(a) / 5: amigo(a) / 6: outra |
| outro_par_ajudante | varchar(100) | não |  | NOT NULL |  |
| ja_fez_ead | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| instituicao_ead | varchar(200) | não |  | NOT NULL |  |
| carga_ead | int(11) | não |  | NOT NULL |  |
| pessoas_residencia | int(11) | não |  | NOT NULL |  |
| renda_total | smallint(6) | não |  | NOT NULL | 1: menos de 1 salário, 2: de meio a 1 salário, 3: 1 a 2 salários, 4: 2 a 3 salários, 5: 3 a 4 salários, 6: 5 a 6 salários, 7: 7 a 8 salários, 8: 9 salários ou mais |
| programas_sociais | text | não |  | NOT NULL |  |
| outros_programas | varchar(255) | não |  | NOT NULL |  |
| meio_descoberta | text | não |  | NOT NULL |  |
| outros_meios | varchar(255) | não |  | NOT NULL |  |
| quem_indicou | varchar(200) | não |  | NOT NULL |  |
| veterano | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| hab_cell_cha | text | não |  | NOT NULL |  |
| atv_int_cha_norm | text | não |  | NOT NULL |  |
| outra_atv_int_cha | varchar(255) | não |  | NOT NULL |  |
| atv_int_cha_vet | text | não |  | NOT NULL |  |
| pretensao_pos_curso | smallint(6) | não |  | NOT NULL | 1: empreendedorismo / 2: mercado de trabalho |
| intencao_conhecimentos | varchar(255) | não |  | NOT NULL |  |
| instagram | varchar(255) | não |  | NOT NULL |  |
| possui_filhos | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| idades_filhos | varchar(255) | não |  | NOT NULL |  |
| quem_mora_filhos | varchar(255) | não |  | NOT NULL |  |
| problema_saude | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| qual_problema | varchar(255) | não |  | NOT NULL |  |
| aparelho_especial | smallint(6) | não |  | NOT NULL | 0: não / 1: cadeira de rodas / 2: aparelho auditivo / 3: prótese / 4: muletas / 5: andador |
| atestado | smallint(6) | não |  | NOT NULL | 0: não / 1: laudo / 2: inss / 3: drt |
| situacao_na_familia | smallint(6) | não |  | NOT NULL | 1: chefe / 2: dependente / 3: compõe renda |
| trabalhadores_casa | int(11) | não |  | NOT NULL |  |
| renda_familiar | decimal(19,2) | não |  | NOT NULL |  |
| auxilios_governo | smallint(6) | não |  | NOT NULL | 0: não / 1: bolsa família / 2: seguro desemprego / 3: pensão / 4: aposentadoria INSS |
| situacao_ocupacional | smallint(6) | não |  | NOT NULL | 1: emprego formal / 2: emprego informal / 3: autônomo / 4: desempregado |
| conhecimento_costura | smallint(6) | não |  | NOT NULL | 0: nenhum / 1: básico / 2: intermediário / 3: avançado |
| conhecimento_costura_detalhes | varchar(255) | não |  | NOT NULL |  |
| areas_confeccao_conhecimento | varchar(255) | não |  | NOT NULL |  |
| conhecimento_maquinas | varchar(255) | não |  | NOT NULL |  |
| possui_maquina | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| tipo_maquina | varchar(100) | não |  | NOT NULL |  |
| tempo_atuacao_area | varchar(100) | não |  | NOT NULL |  |
| locais_experiencia_costura | text | não |  | NOT NULL |  |
| descricao_ultima_empresa | varchar(255) | não |  | NOT NULL |  |
| associacao | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| qual_associacao | varchar(100) | não |  | NOT NULL |  |
| interesse_associacao | tinyint(4) | não |  | NOT NULL | 0: não / 1: sim |
| obs | text | não |  | NOT NULL |  |
| id_usuario_ligacoes | int(11) | sim |  | FK |  |
| cpf_entregue | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| rg_entregue | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| comp_res_entregue | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| leituras | text | não |  | NOT NULL |  |
| outras_leituras | varchar(255) | não |  | NOT NULL |  |
| motivacao_projeto | text | não |  | NOT NULL |  |
| data_hora | datetime | não |  | NOT NULL |  |
| status | smallint(6) | não |  | NOT NULL | 1: dentro do perfil (pré), 2: fora do perfil (pré), 3: cadastro reserva (pré), 4: fora do perfil (entr), 5: em análise (entr), 6: habilitado (entr) / 7: lotado |

**Chaves estrangeiras (referencia):**

- `id_cad_integrado` → `cad_integrado(id_cad_integrado)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_usuario_entrevista` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_usuario_ligacoes` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_cad_integrado` (UNIQUE, BTREE): id_cad_integrado, id_projeto
- `id_projeto` (NON-UNIQUE, BTREE): id_projeto
- `id_usuario_entrevista` (NON-UNIQUE, BTREE): id_usuario_entrevista
- `id_usuario_ligacoes` (NON-UNIQUE, BTREE): id_usuario_ligacoes
- `PRIMARY` (UNIQUE, BTREE): id_entrevista

---

### cad_integrado_ligacoes

- Engine: `InnoDB` | Linhas aprox.: 32
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| id_cad_integrado | int(11) | não |  | FK, NOT NULL |  |
| ligacao | int(11) | não |  | NOT NULL |  |
| data | date | não |  | NOT NULL |  |
| hora | time | não |  | NOT NULL |  |
| situacao | smallint(6) | não |  | NOT NULL | 1: não atendeu / 2: atendeu / 3: número errado / 4: telefone não existe / 5: ocupado / 6: deixei recado |
| observacoes | text | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_cad_integrado` → `cad_integrado(id_cad_integrado)` [ON UPDATE NO ACTION, ON DELETE CASCADE]

**Índices:**

- `id_cad_integrado` (NON-UNIQUE, BTREE): id_cad_integrado
- `PRIMARY` (UNIQUE, BTREE): id

---

### cad_online_costura

- Engine: `InnoDB` | Linhas aprox.: 1106
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(200) | não |  | NOT NULL |  |
| id_curso | int(11) | não |  | FK, NOT NULL |  |
| nivel_conhecimento | smallint(6) | não |  | NOT NULL | 0: nenhum / 1: básico / 2: intermediário / 3: avançado |
| id_curso_sec | int(11) | não |  | FK, NOT NULL |  |
| nivel_conhecimento_sec | smallint(6) | não |  | NOT NULL | 0: nenhum / 1: básico / 2: intermediário / 3: avançado |
| turno | smallint(6) | não |  | NOT NULL | 1: manhã / 2: tarde |
| objetivo_pos_curso | smallint(6) | não |  | NOT NULL | 1: empreendedorismo / 2: mercado de trabalho / 3: outro |
| outro_objetivo | varchar(255) | não |  | NOT NULL |  |
| situacao_ocupacional | smallint(6) | não |  | NOT NULL | 1: desempregado / 2: emprego formal / 3: trabalho informal / 4: negócio próprio |
| fonte_renda | varchar(200) | não |  | NOT NULL |  |
| procurando_emprego | tinyint(4) | não | 0 | NOT NULL | 0: não / 1: sim |
| tentou_empreender | varchar(200) | não |  | NOT NULL |  |
| pretende_conhecimento | varchar(200) | não |  | NOT NULL |  |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| sexo | char(1) | não |  | NOT NULL |  |
| outro_sexo | varchar(50) | não |  | NOT NULL |  |
| ident_genero | smallint(6) | não |  | NOT NULL | 1: feminina / 2: masculina / 3: trans / 4: travesti / 5: mulher trans / 6: homem trans / 7: não binário / 8: não respondeu / 9: outros |
| outra_ident_genero | varchar(50) | não |  | NOT NULL |  |
| orien_sexual | smallint(6) | não |  | NOT NULL | 1: assexual / 2: bissexual / 3: pansexual / 4: heterossexual / 5: homossexual / 6: não respondeu / 7: outros |
| outra_orien_sexual | varchar(50) | não |  | NOT NULL |  |
| raca | smallint(6) | não |  | NOT NULL | 1: Preto, 2: Pardo, 3: Branco, 4: Indígena, 5: Amarelo, 6: Outros |
| outra_raca | varchar(50) | não |  | NOT NULL |  |
| rg | varchar(20) | não |  | NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| endereco | varchar(200) | não |  | NOT NULL |  |
| numero | varchar(50) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| whatsapp | varchar(20) | não |  | NOT NULL |  |
| telefone1 | varchar(20) | não |  | NOT NULL |  |
| telefone2 | varchar(20) | não |  | NOT NULL |  |
| pessoa_recado | varchar(100) | não |  | NOT NULL |  |
| email | varchar(255) | não |  | NOT NULL |  |
| estado_civil | smallint(6) | não |  | NOT NULL | 1: solteiro / 2: união estável / 3: casado / 4: separado / 5: divorciado / 6: viúvo |
| situacao_familia | smallint(6) | não |  | NOT NULL | 1: chefe de família / 2: dependente / 3: compõe renda |
| tem_filhos | tinyint(4) | não | 0 | NOT NULL | 0: não / 1: sim |
| idades_filhos | varchar(200) | não |  | NOT NULL |  |
| pessoas_casa | int(11) | não |  | NOT NULL |  |
| quem_cuida_filhos | varchar(200) | não |  | NOT NULL |  |
| trabalhadores_casa | int(11) | não |  | NOT NULL |  |
| renda_familiar | smallint(6) | não |  | NOT NULL | 1: até 1 salário / 2: até 2 salários / 3: até 3 salários / 4: mais de 3 salários |
| programa_social | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| programas_sociais | text | não |  | NOT NULL |  |
| outros_programas | varchar(255) | não |  | NOT NULL |  |
| passe_livre | tinyint(4) | não | 0 | NOT NULL | 0: não / 1: sim |
| problemas_saude | tinyint(4) | não | 0 | NOT NULL | 0: não / 1: sim |
| qual_problema | varchar(200) | não |  | NOT NULL |  |
| deficiencia | smallint(6) | não |  | NOT NULL | 0: não / 1: fisica / 2: visual / 3: auditiva / 4: intelectual / 5: psicossocial / 6: multipla / 7: outra |
| outra_deficiencia | varchar(200) | não |  | NOT NULL |  |
| grau_deficiencia | smallint(6) | não |  | NOT NULL | 1: leve / 2: moderada / 3: grave |
| aparelho_deficiencia | varchar(200) | não |  | NOT NULL |  |
| homologacao_deficiencia | smallint(6) | não |  | NOT NULL | 0: não / 1: laudo médico / 2: documento da perícia do INSS / 3: outro |
| outra_homologacao | varchar(200) | não |  | NOT NULL |  |
| atv_extra | tinyint(4) | não | 0 | NOT NULL | 0: não / 1: sim |
| desc_atv_extra | varchar(255) | não |  | NOT NULL |  |
| inclusao | datetime | não |  | NOT NULL |  |
| id_usuario_entrevista | int(11) | sim |  | FK |  |
| p01_como_soube | varchar(255) | não |  | NOT NULL |  |
| pt_p01 | int(11) | não | 0 | NOT NULL |  |
| p02_estudando | tinyint(4) | não | 0 | NOT NULL | 1: não / 2: sim |
| p02_turno | smallint(6) | não | 0 | NOT NULL | 1: manhã / 2: tarde / 3: noite |
| p02_id_nivel_escolar | int(11) | sim |  | FK |  |
| pt_p02 | int(11) | não | 0 | NOT NULL |  |
| p03_tempo_moradia | varchar(255) | não |  | NOT NULL |  |
| pt_p03 | int(11) | não | 0 | NOT NULL |  |
| p04_ambicoes | varchar(255) | não |  | NOT NULL |  |
| pt_p04 | int(11) | não | 0 | NOT NULL |  |
| p05_motivo_curso | varchar(255) | não |  | NOT NULL |  |
| pt_p05 | int(11) | não | 0 | NOT NULL |  |
| p06_personalidade | varchar(255) | não |  | NOT NULL |  |
| pt_p06 | int(11) | não | 0 | NOT NULL |  |
| p07_alergia | tinyint(4) | não | 0 | NOT NULL | 1: não / 2: sim |
| p07_qual_alergia | varchar(255) | não |  | NOT NULL |  |
| pt_p07 | int(11) | não | 0 | NOT NULL |  |
| p08_quem_cuida_filhos | smallint(6) | não | 0 | NOT NULL | 1: pais / 2: creche / 3: sozinhos / 4: parentes / 5: babá / 6: vizinhos / 7: filho mais velho / 8: outro |
| p08_idade_filho | varchar(255) | não |  | NOT NULL |  |
| p08_outro_cuida | varchar(255) | não |  | NOT NULL |  |
| pt_p08 | int(11) | não | 0 | NOT NULL |  |
| p09_caso_filho_adoeca | varchar(255) | não |  | NOT NULL |  |
| pt_p09 | int(11) | não | 0 | NOT NULL |  |
| p10_transporte | smallint(6) | não | 0 | NOT NULL | 1: carro / 2: ônibus / 3: metrô / 4: bicicleta / 5: moto / 6: carona / 7: a pé |
| pt_p10 | int(11) | não | 0 | NOT NULL |  |
| p11_como_lida_ordem | varchar(255) | não |  | NOT NULL |  |
| pt_p11 | int(11) | não | 0 | NOT NULL |  |
| p12_dificuldade_convivio | varchar(255) | não |  | NOT NULL |  |
| pt_p12 | int(11) | não | 0 | NOT NULL |  |
| p13_ciencia_celular | tinyint(4) | não | 0 | NOT NULL | 1: não / 2: sim |
| pt_p13 | int(11) | não | 0 | NOT NULL |  |
| data_entrevista | datetime | sim |  |  |  |
| status | smallint(6) | não |  | NOT NULL | 1: 1 - pre insc / 2: 1 - cad reserva / 3: 2 - ent - fora / 4: 2 - ent - analise / 5: 2 - ent - incom / 6: 2 - ent - hab / 7: 3 - lotado |

**Chaves estrangeiras (referencia):**

- `id_curso` → `curso_cad_online_costura(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso_sec` → `curso_cad_online_costura(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_usuario_entrevista` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `p02_id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_curso` (NON-UNIQUE, BTREE): id_curso
- `id_curso_sec` (NON-UNIQUE, BTREE): id_curso_sec
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `id_usuario_entrevista` (NON-UNIQUE, BTREE): id_usuario_entrevista
- `p02_id_nivel_escolar` (NON-UNIQUE, BTREE): p02_id_nivel_escolar
- `PRIMARY` (UNIQUE, BTREE): id

---

### cad_online_despertar

- Engine: `InnoDB` | Linhas aprox.: 811
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(200) | não |  | NOT NULL |  |
| id_curso_1 | int(11) | não |  | FK, NOT NULL |  |
| id_curso_2 | int(11) | não |  | FK, NOT NULL |  |
| ja_estudou_informatica | tinyint(1) | não |  | NOT NULL | 0: não, 1: sim |
| sexo | char(1) | não |  | NOT NULL |  |
| outro_sexo | varchar(50) | não |  | NOT NULL |  |
| id_raca | int(11) | não |  | FK, NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| estado_civil | smallint(6) | não |  | NOT NULL | 1: solteiro / 2: união estável / 3: casado / 4: viúvo / 5: divorciado / 6: outro |
| outro_estado_civil | varchar(50) | não |  | NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| rg | varchar(20) | não |  | NOT NULL |  |
| nis | varchar(20) | não |  | NOT NULL |  |
| contato | varchar(20) | não |  | NOT NULL |  |
| email | varchar(255) | não |  | NOT NULL |  |
| nome_resp | varchar(200) | não |  | NOT NULL |  |
| parentesco_resp | smallint(6) | não |  | NOT NULL | 1: mãe/pai, 2: avô/avó, 3: tia(o), 4: prima(o), 5: irmã(o), 6: outro |
| outro_parentesco_resp | varchar(50) | não |  | NOT NULL |  |
| contato_resp | varchar(20) | não |  | NOT NULL |  |
| deficiencia | smallint(6) | não |  | NOT NULL | 0: não, 1: visual, 2: motora, 3: intelectual, 4: auditiva, 5: tdah, 6: tea |
| endereco | varchar(200) | não |  | NOT NULL |  |
| num_endereco | varchar(50) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| cep | varchar(9) | não |  | NOT NULL |  |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| alfabetizado | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| tipo_escola | smallint(6) | não |  | NOT NULL | 1: pública / 2: privada |
| escola | varchar(255) | não |  | NOT NULL |  |
| escola_alt | varchar(255) | não |  | NOT NULL |  |
| turno | text | não |  | NOT NULL |  |
| redes_sociais | text | não |  | NOT NULL |  |
| outra_rede | varchar(50) | não |  | NOT NULL |  |
| como_descobriu | int(11) | não |  | NOT NULL | 1: comunidade religiosa / 2: internet / 3: ligação SETEC / 4: amigo projeto / 5: órgão da prefeitura / 6: indicação familiar / 7: facebook ou whatsapp / 8: instagram despertar / 9: instagram idear / 10: propaganda / 11: associação ou entidade / 12: site p |
| outra_descoberta | varchar(255) | não |  | NOT NULL |  |
| pessoas_casa | int(11) | não |  | NOT NULL |  |
| programa_social | tinyint(1) | não |  | NOT NULL | 0: não, 1: sim |
| programas_sociais | text | não |  | NOT NULL |  |
| socio_casa | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: propria / 3: alugada / 4: cedida |
| socio_mora_com | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pais / 3: mãe / 4: pai / 5: avos / 6: tios / 7: outros |
| socio_mora_outros | varchar(50) | não |  | NOT NULL |  |
| socio_escolaridade_pai | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_escolaridade_mae | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_despesas | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pai e mãe / 3: apenas mãe / 4: apenas pai / 5: avó / 6: avô / 7: irmão ou irmã / 8: tios / 9: ninguém |
| socio_renda | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: nenhuma / 3: menos de 1 SM / 4: 1 a 2 SMs / 5: 2 a 3 SMs / 6: acima de 3 SMs |
| socio_pretensao | tinyint(2) | não |  | NOT NULL | 1: não especificado / 2: não sei / 3: administração / 4: artes / 5: ciências biológicas / 6: análise e desenvolvimento / 7: ciências sociais / 8: comunicação / 9: engenharia / 10: saúde |
| inclusao | datetime | não |  | NOT NULL |  |
| id_status | int(11) | não |  | FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_curso_1` → `curso_cad_online_despertar(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso_2` → `curso_cad_online_despertar(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_raca` → `raca(id_raca)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_status` → `status_cad_online_despertar(id_status)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_curso_1` (NON-UNIQUE, BTREE): id_curso_1
- `id_curso_2` (NON-UNIQUE, BTREE): id_curso_2
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `id_raca` (NON-UNIQUE, BTREE): id_raca
- `id_status` (NON-UNIQUE, BTREE): id_status
- `PRIMARY` (UNIQUE, BTREE): id

---

### cad_online_geral_ligacoes

- Engine: `InnoDB` | Linhas aprox.: 606
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| projeto | int(11) | não |  | NOT NULL | 1: prog ação / 2: prog itinerante / 3: despertar / 4: ideartec |
| id_cadastro | int(11) | não |  | NOT NULL |  |
| ligacao | int(11) | não |  | NOT NULL |  |
| id_usuario_responsavel | int(11) | sim |  | FK |  |
| data | date | não |  | NOT NULL |  |
| hora | time | não |  | NOT NULL |  |
| hora_termino | time | sim |  |  |  |
| situacao | smallint(6) | não | 0 | NOT NULL | 1: não atendeu / 2: atendeu / 3: número errado / 4: telefone não existe / 5: ocupado / 6: deixei recado / 7: entrevistado |
| observacoes | text | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_usuario_responsavel` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_cadastro` (UNIQUE, BTREE): projeto, id_cadastro, ligacao
- `id_usuario_responsavel` (NON-UNIQUE, BTREE): id_usuario_responsavel
- `PRIMARY` (UNIQUE, BTREE): id

---

### cad_online_ideartec

- Engine: `InnoDB` | Linhas aprox.: 2
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(255) | não |  | NOT NULL |  |
| sexo | char(1) | não |  | NOT NULL |  |
| outro_sexo | varchar(50) | não |  | NOT NULL |  |
| id_raca | int(11) | não |  | FK, NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| rg | varchar(20) | não |  | NOT NULL |  |
| nis | varchar(20) | não |  | NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| nome_resp | varchar(255) | não |  | NOT NULL |  |
| cpf_resp | varchar(14) | não |  | NOT NULL |  |
| rg_resp | varchar(20) | não |  | NOT NULL |  |
| parentesco_resp | smallint(6) | não |  | NOT NULL | 1: mãe/pai, 2: avô/avó, 3: tia(o), 4: prima(o), 5: irmã(o), 6: outro |
| outro_parentesco_resp | varchar(255) | não |  | NOT NULL |  |
| contato_resp | varchar(20) | não |  | NOT NULL |  |
| contato_aluno | varchar(20) | não |  | NOT NULL |  |
| contato_para_grupo | smallint(6) | não |  | NOT NULL | 1: aluno / 2: responsavel / 3: ambos |
| email | varchar(255) | não |  | NOT NULL |  |
| endereco | varchar(255) | não |  | NOT NULL |  |
| num_endereco | varchar(50) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| nacionalidade | varchar(100) | não |  | NOT NULL |  |
| tipo_escola | smallint(6) | não |  | NOT NULL | 1: publica / 2: privada |
| escola | varchar(255) | não |  | NOT NULL |  |
| escola_alt | varchar(255) | não |  | NOT NULL |  |
| turno | smallint(6) | não |  | NOT NULL | 1: manhã, 2: tarde, 3: noite, 4: integral, 5: concluiu em, 6: evadido |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| alfabetizado | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| turnos_disponiveis | text | não |  | NOT NULL |  |
| deficiencia | smallint(6) | não |  | NOT NULL | 0: não, 1: visual, 2: motora, 3: intelectual, 4: auditiva, 5: tdah, 6: tea |
| como_descobriu | smallint(6) | não |  | NOT NULL | 1: fb, 2: whats, 3: insta, 4: site idear, 5: ação assoc, 6: ação escola, 7: indicação amigo externo, 8: indicação amigo geral, 9: equipamento social |
| tamanho_camisa | smallint(6) | não |  | NOT NULL | 1: pp, 2: p, 3: m, 4: g, 5: gg |
| id_curso_1 | int(11) | não |  | FK, NOT NULL |  |
| id_curso_2 | int(11) | não |  | FK, NOT NULL |  |
| ja_estudou_informatica | tinyint(1) | não |  | NOT NULL | 0: não, 1: sim |
| pessoas_casa | int(11) | não |  | NOT NULL |  |
| programa_social | tinyint(1) | não |  | NOT NULL | 0: não, 1: sim |
| programas_sociais | text | não |  | NOT NULL |  |
| socio_casa | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: propria / 3: alugada / 4: cedida |
| socio_mora_com | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pais / 3: mãe / 4: pai / 5: avos / 6: tios / 7: outros |
| socio_mora_outros | varchar(50) | não |  | NOT NULL |  |
| socio_escolaridade_pai | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_escolaridade_mae | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_despesas | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pai e mãe / 3: apenas mãe / 4: apenas pai / 5: avó / 6: avô / 7: irmão ou irmã / 8: tios / 9: ninguém |
| socio_renda | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: nenhuma / 3: menos de 1 SM / 4: 1 a 2 SMs / 5: 2 a 3 SMs / 6: acima de 3 SMs |
| socio_pretensao | tinyint(2) | não |  | NOT NULL | 1: não especificado / 2: não sei / 3: administração / 4: artes / 5: ciências biológicas / 6: análise e desenvolvimento / 7: ciências sociais / 8: comunicação / 9: engenharia / 10: saúde |
| inclusao | datetime | não |  | NOT NULL |  |
| id_status | int(11) | não |  | FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_raca` → `raca(id_raca)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_status` → `status_cad_online_geral(id_status)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso_1` → `curso_cad_online_geral(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso_2` → `curso_cad_online_geral(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `cpf` (UNIQUE, BTREE): cpf
- `id_curso_1` (NON-UNIQUE, BTREE): id_curso_1
- `id_curso_2` (NON-UNIQUE, BTREE): id_curso_2
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `id_raca` (NON-UNIQUE, BTREE): id_raca
- `id_status` (NON-UNIQUE, BTREE): id_status
- `PRIMARY` (UNIQUE, BTREE): id

---

### cad_online_prog_acao

- Engine: `InnoDB` | Linhas aprox.: 148
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(255) | não |  | NOT NULL |  |
| sexo | char(1) | não |  | NOT NULL |  |
| id_raca | int(11) | não |  | FK, NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| rg | varchar(20) | não |  | NOT NULL |  |
| nis | varchar(20) | não |  | NOT NULL |  |
| nome_resp | varchar(255) | não |  | NOT NULL |  |
| contato_resp | varchar(20) | não |  | NOT NULL |  |
| cpf_resp | varchar(14) | não |  | NOT NULL |  |
| rg_resp | varchar(20) | não |  | NOT NULL |  |
| parentesco_resp | smallint(6) | não |  | NOT NULL | 1: mãe/pai, 2: avô/avó, 3: tia(o), 4: prima(o), 5: irmã(o), 6: outro |
| outro_parentesco_resp | varchar(255) | não |  | NOT NULL |  |
| contato_aluno | varchar(20) | não |  | NOT NULL |  |
| contato_para_grupo | smallint(6) | não |  | NOT NULL | 1: aluno / 2: responsavel / 3: ambos |
| email | varchar(255) | não |  | NOT NULL |  |
| endereco | varchar(255) | não |  | NOT NULL |  |
| num_endereco | varchar(50) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| tipo_escola | smallint(6) | não |  | NOT NULL | 1: publica / 2: privada |
| escola | varchar(255) | não |  | NOT NULL |  |
| escola_alt | varchar(255) | não |  | NOT NULL |  |
| turno | smallint(6) | não |  | NOT NULL | 1: manhã, 2: tarde, 3: noite, 4: integral, 5: concluiu em, 6: evadido |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| alfabetizado | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| turnos_disponiveis | text | não |  | NOT NULL |  |
| deficiencia | smallint(6) | não |  | NOT NULL | 0: não, 1: visual, 2: motora, 3: intelectual, 4: auditiva, 5: tdah, 6: tea |
| como_descobriu | smallint(6) | não |  | NOT NULL | 1: fb, 2: whats, 3: insta, 4: site idear, 5: ação assoc, 6: ação escola, 7: ação timbó, 8: ação acarac, 9: indicação amigo prog, 10: indicação amigo geral |
| tamanho_camisa | smallint(6) | não |  | NOT NULL | 1: pp, 2: p, 3: m, 4: g, 5: gg |
| id_curso_1 | int(11) | não |  | FK, NOT NULL |  |
| id_curso_2 | int(11) | não |  | FK, NOT NULL |  |
| ja_estudou_informatica | tinyint(1) | não |  | NOT NULL | 0: não, 1: sim |
| pessoas_casa | int(11) | não |  | NOT NULL |  |
| programa_social | tinyint(1) | não |  | NOT NULL | 0: não, 1: sim |
| programas_sociais | text | não |  | NOT NULL |  |
| socio_casa | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: propria / 3: alugada / 4: cedida |
| socio_mora_com | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pais / 3: mãe / 4: pai / 5: avos / 6: tios / 7: outros |
| socio_mora_outros | varchar(50) | não |  | NOT NULL |  |
| socio_escolaridade_pai | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_escolaridade_mae | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_despesas | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pai e mãe / 3: apenas mãe / 4: apenas pai / 5: avó / 6: avô / 7: irmão ou irmã / 8: tios / 9: ninguém |
| socio_renda | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: nenhuma / 3: menos de 1 SM / 4: 1 a 2 SMs / 5: 2 a 3 SMs / 6: acima de 3 SMs |
| socio_pretensao | tinyint(2) | não |  | NOT NULL | 1: não especificado / 2: não sei / 3: administração / 4: artes / 5: ciências biológicas / 6: análise e desenvolvimento / 7: ciências sociais / 8: comunicação / 9: engenharia / 10: saúde |
| inclusao | datetime | não |  | NOT NULL |  |
| id_status | int(11) | não |  | FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_raca` → `raca(id_raca)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_status` → `status_cad_online_prog_acao(id_status)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso_1` → `curso_cad_online_prog_acao(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso_2` → `curso_cad_online_prog_acao(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `cpf` (UNIQUE, BTREE): cpf
- `id_curso_1` (NON-UNIQUE, BTREE): id_curso_1
- `id_curso_2` (NON-UNIQUE, BTREE): id_curso_2
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `id_raca` (NON-UNIQUE, BTREE): id_raca
- `id_status` (NON-UNIQUE, BTREE): id_status
- `PRIMARY` (UNIQUE, BTREE): id

---

### cad_online_prog_itinerante

- Engine: `InnoDB` | Linhas aprox.: 17
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(255) | não |  | NOT NULL |  |
| sexo | char(1) | não |  | NOT NULL |  |
| outro_sexo | varchar(50) | não |  | NOT NULL |  |
| id_raca | int(11) | não |  | FK, NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| rg | varchar(20) | não |  | NOT NULL |  |
| nis | varchar(20) | não |  | NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| nome_resp | varchar(255) | não |  | NOT NULL |  |
| cpf_resp | varchar(14) | não |  | NOT NULL |  |
| rg_resp | varchar(20) | não |  | NOT NULL |  |
| parentesco_resp | smallint(6) | não |  | NOT NULL | 1: mãe/pai, 2: avô/avó, 3: tia(o), 4: prima(o), 5: irmã(o), 6: outro |
| outro_parentesco_resp | varchar(255) | não |  | NOT NULL |  |
| contato_resp | varchar(20) | não |  | NOT NULL |  |
| contato_aluno | varchar(20) | não |  | NOT NULL |  |
| contato_para_grupo | smallint(6) | não |  | NOT NULL | 1: aluno / 2: responsavel / 3: ambos |
| email | varchar(255) | não |  | NOT NULL |  |
| endereco | varchar(255) | não |  | NOT NULL |  |
| num_endereco | varchar(50) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| tipo_escola | smallint(6) | não |  | NOT NULL | 1: publica / 2: privada |
| escola | varchar(255) | não |  | NOT NULL |  |
| escola_alt | varchar(255) | não |  | NOT NULL |  |
| turno | smallint(6) | não |  | NOT NULL | 1: manhã, 2: tarde, 3: noite, 4: integral, 5: concluiu em, 6: evadido |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| alfabetizado | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| turnos_disponiveis | text | não |  | NOT NULL |  |
| deficiencia | smallint(6) | não |  | NOT NULL | 0: não, 1: visual, 2: motora, 3: intelectual, 4: auditiva, 5: tdah, 6: tea |
| como_descobriu | smallint(6) | não |  | NOT NULL | 1: fb, 2: whats, 3: insta, 4: site idear, 5: ação assoc, 6: ação escola, 7: ação timbó, 8: ação acarac, 9: indicação amigo prog, 10: indicação amigo geral |
| tamanho_camisa | smallint(6) | não |  | NOT NULL | 1: pp, 2: p, 3: m, 4: g, 5: gg |
| id_curso_1 | int(11) | não |  | FK, NOT NULL |  |
| id_curso_2 | int(11) | não |  | FK, NOT NULL |  |
| ja_estudou_informatica | tinyint(1) | não |  | NOT NULL | 0: não, 1: sim |
| pessoas_casa | int(11) | não |  | NOT NULL |  |
| programa_social | tinyint(1) | não |  | NOT NULL | 0: não, 1: sim |
| programas_sociais | text | não |  | NOT NULL |  |
| socio_casa | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: propria / 3: alugada / 4: cedida |
| socio_mora_com | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pais / 3: mãe / 4: pai / 5: avos / 6: tios / 7: outros |
| socio_mora_outros | varchar(50) | não |  | NOT NULL |  |
| socio_escolaridade_pai | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_escolaridade_mae | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: não estudou / 3: 1 a 4 serie / 4: 5 a 8 serie / 5: medio / 6: superior / 7: especialização / 8: não sabe informar |
| socio_despesas | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: pai e mãe / 3: apenas mãe / 4: apenas pai / 5: avó / 6: avô / 7: irmão ou irmã / 8: tios / 9: ninguém |
| socio_renda | tinyint(1) | não |  | NOT NULL | 1: não especificado / 2: nenhuma / 3: menos de 1 SM / 4: 1 a 2 SMs / 5: 2 a 3 SMs / 6: acima de 3 SMs |
| socio_pretensao | tinyint(2) | não |  | NOT NULL | 1: não especificado / 2: não sei / 3: administração / 4: artes / 5: ciências biológicas / 6: análise e desenvolvimento / 7: ciências sociais / 8: comunicação / 9: engenharia / 10: saúde |
| inclusao | datetime | não |  | NOT NULL |  |
| id_status | int(11) | não |  | FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_raca` → `raca(id_raca)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_status` → `status_cad_online_prog_itinerante(id_status)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso_1` → `curso_cad_online_prog_itinerante(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso_2` → `curso_cad_online_prog_itinerante(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `cpf` (UNIQUE, BTREE): cpf
- `id_curso_1` (NON-UNIQUE, BTREE): id_curso_1
- `id_curso_2` (NON-UNIQUE, BTREE): id_curso_2
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `id_raca` (NON-UNIQUE, BTREE): id_raca
- `id_status` (NON-UNIQUE, BTREE): id_status
- `PRIMARY` (UNIQUE, BTREE): id

---

### cadastro_online

- Engine: `InnoDB` | Linhas aprox.: 5038
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| id_projeto | int(11) | não | 0 | FK, NOT NULL |  |
| modo | tinyint(1) | não |  | NOT NULL | 0: pessoa / 1: parente ou amigo / 2: instituicao |
| instituicao | varchar(255) | não |  | NOT NULL |  |
| nome_cadastrante | varchar(100) | não |  | NOT NULL |  |
| telefone_cadastrante | varchar(20) | não |  | NOT NULL |  |
| nome | varchar(100) | não |  | NOT NULL |  |
| rg | varchar(20) | não |  | NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| sexo | char(1) | não |  | NOT NULL | M, F, O |
| outro_sexo | varchar(20) | não |  | NOT NULL |  |
| estado_civil | smallint(6) | não |  | NOT NULL | 1: solteiro, 2: união estável, 3: casado, 4: viúvo, 5: divorciado, 6: outro |
| outro_ec | varchar(20) | não |  | NOT NULL |  |
| raca | smallint(6) | não |  | NOT NULL | 1: Preto, 2: Pardo, 3: Branco, 4: Indígena, 5: Amarelo, 6: Outros |
| outra_raca | varchar(20) | não |  | NOT NULL |  |
| id_grupo_minoritario | int(11) | sim |  | FK |  |
| outro_grupo_minoritario | varchar(200) | não |  | NOT NULL |  |
| deficiencia | smallint(6) | não |  | NOT NULL | 1: fisica, 2: visual, 3: auditiva, 4: intelectual, 5: multipla, 6: não, 7: outra |
| outra_deficiencia | varchar(50) | não |  | NOT NULL |  |
| grau_deficiencia | smallint(6) | não | 0 | NOT NULL | 1: leve / 2: moderada / 3: severa |
| medicacoes | text | não |  | NOT NULL |  |
| nome_medicacoes | varchar(255) | não |  | NOT NULL |  |
| outras_medicacoes | varchar(255) | não |  | NOT NULL |  |
| endereco | varchar(255) | não |  | NOT NULL |  |
| numero | varchar(20) | não |  | NOT NULL |  |
| complemento | varchar(100) | não |  | NOT NULL |  |
| bairro | varchar(50) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| estado | varchar(50) | não |  | NOT NULL |  |
| cep | varchar(9) | não |  | NOT NULL |  |
| telefone1 | varchar(20) | não |  | NOT NULL |  |
| telefone2 | varchar(20) | não |  | NOT NULL |  |
| whatsapp | varchar(20) | não |  | NOT NULL |  |
| email | varchar(255) | não |  | NOT NULL |  |
| id_nivel_escolar | int(11) | não |  | FK, NOT NULL |  |
| serie_termino | int(11) | não |  | NOT NULL | 1: F1, 2: F2, 3: F3, 4: F4, 5: F5, 6: F6, 7: F7, 8: F8, 9: F9, 10: M1, 11: M2, 12: M3 |
| tamanho_camisa | smallint(6) | não |  | NOT NULL | 1: PP, 2: P, 3: M, 4: G, 5: GG, 6: XG |
| turno | smallint(6) | não |  | NOT NULL | 1: ambos, 2: manhã, 3: tarde, 4: nenhum |
| outro_turno | varchar(100) | não |  | NOT NULL |  |
| trabalha | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| desc_trabalho | varchar(100) | não |  | NOT NULL |  |
| turno_trabalho | smallint(6) | não | 0 | NOT NULL | 1: manhã, 2: tarde, 3: manhã e tarde, 4: noite |
| atv_extra | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| desc_atv_extra | varchar(100) | não |  | NOT NULL |  |
| turno_atv_extra | smallint(6) | não | 0 | NOT NULL | 1: manhã, 2: tarde, 3: manhã e tarde, 4: noite |
| horas | smallint(6) | não |  | NOT NULL | 1, 2, 3, 4, 5+ |
| equipamentos | text | não |  | NOT NULL |  |
| outros_equipamentos | varchar(255) | não |  | NOT NULL |  |
| equipamento_e_compart | tinyint(1) | não |  | NOT NULL | 1: sim, 2: não, 3: não tem |
| internet | smallint(6) | não |  | NOT NULL | 1: dados moveis, 2: internet cabeada, 3: wifi, 4: não possui |
| outra_internet | varchar(50) | não |  | NOT NULL |  |
| qualidade_internet | smallint(6) | não | 0 | NOT NULL | 1: ruim / 2: regular / 3: boa |
| melhor_operadora | smallint(6) | não |  | NOT NULL | 0: nenhuma, 1: oi, 2: tim, 3: vivo, 4: claro |
| redes_sociais | text | não |  | NOT NULL |  |
| outras_redes | varchar(255) | não |  | NOT NULL |  |
| possui_ajudante | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| nome_ajudante | varchar(100) | não |  | NOT NULL |  |
| telefone_ajudante | varchar(20) | não |  | NOT NULL |  |
| ligacao_ajudante | smallint(6) | não | 0 | NOT NULL | 1: filho(a) / 2: neto(a) / 3: irmão(a) / 4: esposo(a) / 5: amigo(a) / 6: outra |
| outra_ligacao_ajudante | varchar(100) | não |  | NOT NULL |  |
| pessoas_residencia | int(11) | não |  | NOT NULL |  |
| membros_familia | text | não |  | NOT NULL |  |
| outros_membros | varchar(255) | não |  | NOT NULL |  |
| renda | int(11) | não |  | NOT NULL | 1: menos de 1 salário, 2: de meio a 1 salário, 3: 1 a 2 salários, 4: 2 a 3 salários, 5: 3 a 4 salários, 6: 5 a 6 salários, 7: 7 a 8 salários, 8: 9 salários ou mais |
| programa_social | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| programas_sociais | text | não |  | NOT NULL |  |
| outros_programas | varchar(255) | não |  | NOT NULL |  |
| como_descobriu | text | não |  | NOT NULL |  |
| outro_meio | varchar(255) | não |  | NOT NULL |  |
| nome_indicador | varchar(255) | não |  | NOT NULL |  |
| ja_participou | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| possui_celular | tinyint(1) | não | 0 | NOT NULL | 0: s/i / 1: não / 2: sim |
| habilidades_celular | text | não |  | NOT NULL |  |
| atividades_passadas | text | não |  | NOT NULL |  |
| atividades_interesse_1 | text | não |  | NOT NULL |  |
| atividades_interesse_2 | text | não |  | NOT NULL |  |
| outra_atividade | varchar(255) | não |  | NOT NULL |  |
| palestra | varchar(255) | não |  | NOT NULL |  |
| id_status | int(11) | não |  | FK, NOT NULL |  |
| motivo_nao_iniciou | varchar(255) | não |  | NOT NULL |  |
| id_motivo_fora_perf | int(11) | sim |  | FK |  |
| desc_motivo | varchar(255) | não |  | NOT NULL |  |
| observacoes | text | não |  | NOT NULL |  |
| responsavel_entrevista | int(11) | sim |  | FK |  |
| envio_cpf | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| envio_rg | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| envio_comp_res | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| habitos_leitura | text | não |  | NOT NULL |  |
| outros_habitos_leitura | text | não |  | NOT NULL |  |
| motivacao_participacao | text | não |  | NOT NULL |  |
| checagem_informacoes | text | não |  | NOT NULL |  |
| confirmacao_escolaridade | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: confirmada / 2: incompatível |
| escolaridade_correta | varchar(255) | não |  | NOT NULL |  |
| conf_atividades_extras | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: trabalha em casa / 2: trabalha fora de casa / 3: grupos / 4: atv física / 5: atv doméstica / 6: outras / 7: trabalho informal |
| conf_atividades_extras_outra | varchar(255) | não |  | NOT NULL |  |
| conf_atividades_extras_esp | varchar(255) | não |  | NOT NULL |  |
| conf_atividades_extras_turno | text | não |  | NOT NULL |  |
| conf_pessoas_residencia | int(11) | não | 0 | NOT NULL |  |
| conf_renda | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: sim / 2: não |
| conf_renda_correta | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: 1 salário / 2: 2 salários / 3: 3 salários / 4: 4 salários / 5: acima de 4 salários |
| conf_renda_correta_esp | varchar(255) | não |  | NOT NULL |  |
| gasto_medicamentos | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: < 100 / 2: entre 100 e 200/ 3: entre 200 e 300 / 4: entre 300 e 400 / 5: entre 400 e 500 / 6: outro / 7: não tem |
| gasto_medicamentos_esp | varchar(255) | não |  | NOT NULL |  |
| gasto_emprestimos | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: < 100 / 2: entre 100 e 200/ 3: entre 200 e 300 / 4: entre 300 e 400 / 5: entre 400 e 500 / 6: outro / 7: não tem |
| gasto_emprestimos_esp | varchar(255) | não |  | NOT NULL |  |
| tipo_moradia | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: casa própria / 2: casa alugada / 3: mora com parentes / 4: mora em casa de permanência / 5: outros / 6: casa c/ financiamento / 7: casa cedida |
| parcela_tipo_moradia | varchar(255) | não |  | NOT NULL |  |
| outro_tipo_moradia | varchar(255) | não |  | NOT NULL |  |
| pcds_na_residencia | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: sim / 2: não |
| pcds_esp | varchar(255) | não |  | NOT NULL |  |
| pcds_bpc | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: sim / 2: não |
| pcds_contribui | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: sim / 2: não |
| pcds_contribuicao | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: < 100 / 2: entre 100 e 200 / 3: entre 200 e 300 / 4: entre 300 e 400 / 5: entre 400 e 500 / 6: acima de 500 / 7: outro |
| pcds_contribuicao_esp | varchar(255) | não |  | NOT NULL |  |
| dominio_leitura | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: não lê / 2: não escreve / 3: básico / 4: tem o hábito |
| desejo_aprendizado | text | não |  | NOT NULL |  |
| pontuacao_renda | smallint(6) | não | 0 | NOT NULL |  |
| pontuacao_programas | smallint(6) | não | 0 | NOT NULL |  |
| pontuacao_disponibilidade | smallint(6) | não | 0 | NOT NULL |  |
| pontuacao_interesse | smallint(6) | não | 0 | NOT NULL |  |
| pontuacao_necessidade | smallint(6) | não | 0 | NOT NULL |  |
| pontuacao_fac_contato | smallint(6) | não | 0 | NOT NULL |  |
| pontuacao_pcd | smallint(6) | não | 0 | NOT NULL |  |
| dh_inclusao | datetime | sim |  |  |  |

**Chaves estrangeiras (referencia):**

- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `responsavel_entrevista` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_motivo_fora_perf` → `mtv_fora_perf_cad_online(id_motivo)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_status` → `status_cad_online(id_status)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_grupo_minoritario` → `grupo_minoritario(id_grupo_minoritario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `cadastro_online_analise.id_cadastro` → `cadastro_online(id)`
- `cadastro_online_ligacoes.id_cadastro` → `cadastro_online(id)`
- `cadastro_online_log.id_cadastro` → `cadastro_online(id)`

**Índices:**

- `id_grupo_minoritario` (NON-UNIQUE, BTREE): id_grupo_minoritario
- `id_motivo_fora_perf` (NON-UNIQUE, BTREE): id_motivo_fora_perf
- `id_nivel_escolar` (NON-UNIQUE, BTREE): id_nivel_escolar
- `id_projeto` (UNIQUE, BTREE): id_projeto, cpf
- `id_status` (NON-UNIQUE, BTREE): id_status
- `PRIMARY` (UNIQUE, BTREE): id
- `responsavel_entrevista` (NON-UNIQUE, BTREE): responsavel_entrevista

---

### cadastro_online_analise

- Engine: `InnoDB` | Linhas aprox.: 372
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| id_cadastro | int(11) | não |  | FK, NOT NULL |  |
| id_usuario_responsavel | int(11) | não |  | FK, NOT NULL |  |
| data | date | não |  | NOT NULL |  |
| hora | time | não |  | NOT NULL |  |
| observacoes | text | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_cadastro` → `cadastro_online(id)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_usuario_responsavel` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_cadastro` (NON-UNIQUE, BTREE): id_cadastro
- `id_usuario_responsavel` (NON-UNIQUE, BTREE): id_usuario_responsavel
- `PRIMARY` (UNIQUE, BTREE): id

---

### cadastro_online_ligacoes

- Engine: `InnoDB` | Linhas aprox.: 9651
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| id_cadastro | int(11) | não |  | FK, NOT NULL |  |
| ligacao | int(11) | não |  | NOT NULL |  |
| id_usuario_responsavel | int(11) | sim |  | FK |  |
| data | date | não |  | NOT NULL |  |
| hora | time | não |  | NOT NULL |  |
| hora_termino | time | sim |  |  |  |
| situacao | smallint(6) | não | 0 | NOT NULL | 1: não atendeu / 2: atendeu / 3: número errado / 4: telefone não existe / 5: ocupado / 6: deixei recado / 7: entrevistado |
| observacoes | text | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_cadastro` → `cadastro_online(id)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_usuario_responsavel` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_cadastro` (UNIQUE, BTREE): id_cadastro, ligacao
- `id_usuario_responsavel` (NON-UNIQUE, BTREE): id_usuario_responsavel
- `PRIMARY` (UNIQUE, BTREE): id

---

### cadastro_online_log

- Engine: `InnoDB` | Linhas aprox.: 4039
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| id_cadastro | int(11) | não |  | FK, NOT NULL |  |
| id_usuario | int(11) | não |  | FK, NOT NULL |  |
| data_hora | datetime | não |  | NOT NULL |  |
| id_status | int(11) | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_cadastro` → `cadastro_online(id)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_usuario` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_cadastro` (NON-UNIQUE, BTREE): id_cadastro
- `id_usuario` (NON-UNIQUE, BTREE): id_usuario
- `PRIMARY` (UNIQUE, BTREE): id

---

### convocacao_cha

- Engine: `InnoDB` | Linhas aprox.: 1
- Chave primária: `id_convocacao`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_convocacao | int(11) | não |  | PK, NOT NULL |  |
| id_projeto | int(11) | não |  | FK, NOT NULL |  |
| tipo_turma | smallint(6) | não |  | NOT NULL | 1: novatos / 2: veteranos / 3: presencial |
| turma | varchar(50) | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `convocacao_cha_ligacoes.id_convocacao` → `convocacao_cha(id_convocacao)`

**Índices:**

- `id_projeto` (UNIQUE, BTREE): id_projeto, tipo_turma, turma
- `PRIMARY` (UNIQUE, BTREE): id_convocacao

---

### convocacao_cha_ligacoes

- Engine: `InnoDB` | Linhas aprox.: 2
- Chave primária: `id_ligacao`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_ligacao | int(11) | não |  | PK, NOT NULL |  |
| id_convocacao | int(11) | não |  | FK, NOT NULL |  |
| id_aluno | int(11) | não |  | FK, NOT NULL |  |
| data | date | não |  | NOT NULL |  |
| id_usuario | int(11) | não |  | FK, NOT NULL |  |
| status | smallint(6) | não |  | NOT NULL | 1: confirmou / 2: desistiu / 3: incomunicavel |

**Chaves estrangeiras (referencia):**

- `id_convocacao` → `convocacao_cha(id_convocacao)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_aluno` → `aluno(id_aluno)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_usuario` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_aluno` (NON-UNIQUE, BTREE): id_aluno
- `id_convocacao` (NON-UNIQUE, BTREE): id_convocacao
- `id_usuario` (NON-UNIQUE, BTREE): id_usuario
- `PRIMARY` (UNIQUE, BTREE): id_ligacao

---

### criterio_cad_integrado

- Engine: `InnoDB` | Linhas aprox.: 16
- Chave primária: `id_criterio`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_criterio | int(11) | não |  | PK, NOT NULL |  |
| descricao | text | não |  | NOT NULL |  |
| ordem | int(11) | não |  | NOT NULL |  |

**Referenciada por:**

- `curso_criterios_cad_integrado.id_criterio` → `criterio_cad_integrado(id_criterio)`

**Índices:**

- `ordem` (UNIQUE, BTREE): ordem
- `PRIMARY` (UNIQUE, BTREE): id_criterio

---

### curso

- Engine: `InnoDB` | Linhas aprox.: 718
- Chave primária: `id_curso`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não |  | PK, NOT NULL |  |
| codigo | varchar(15) | não |  | NOT NULL |  |
| descricao | varchar(100) | não |  | NOT NULL |  |
| carga_horaria | int(11) | não |  | NOT NULL |  |
| atividade_complementar | varchar(255) | não |  | NOT NULL |  |
| id_projeto | int(11) | não |  | FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `atividade.id_curso` → `curso(id_curso)`
- `modulo.id_curso` → `curso(id_curso)`
- `turma.id_curso` → `curso(id_curso)`

**Índices:**

- `codigo` (UNIQUE, BTREE): codigo
- `id_projeto` (NON-UNIQUE, BTREE): id_projeto
- `PRIMARY` (UNIQUE, BTREE): id_curso

---

### curso_cad_integrado

- Engine: `InnoDB` | Linhas aprox.: 65
- Chave primária: `id_curso`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não |  | PK, NOT NULL |  |
| id_projeto | int(11) | não |  | FK, NOT NULL |  |
| categoria | varchar(100) | não |  | NOT NULL |  |
| nome | varchar(200) | não |  | NOT NULL |  |
| descricao | text | não |  | NOT NULL |  |
| carga_horaria | int(11) | não |  | NOT NULL |  |
| ativo | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| destaque | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |

**Chaves estrangeiras (referencia):**

- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `cad_integrado_cursos.id_curso` → `curso_cad_integrado(id_curso)`
- `curso_criterios_cad_integrado.id_curso` → `curso_cad_integrado(id_curso)`

**Índices:**

- `id_projeto` (UNIQUE, BTREE): id_projeto, nome
- `PRIMARY` (UNIQUE, BTREE): id_curso

---

### curso_cad_online_costura

- Engine: `InnoDB` | Linhas aprox.: 8
- Chave primária: `id_curso`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(200) | não |  | NOT NULL |  |
| ativo | tinyint(1) | não | 1 | NOT NULL | 0: não / 1: sim |

**Referenciada por:**

- `cad_online_costura.id_curso` → `curso_cad_online_costura(id_curso)`
- `cad_online_costura.id_curso_sec` → `curso_cad_online_costura(id_curso)`

**Índices:**

- `nome` (UNIQUE, BTREE): nome
- `PRIMARY` (UNIQUE, BTREE): id_curso

---

### curso_cad_online_despertar

- Engine: `InnoDB` | Linhas aprox.: 16
- Chave primária: `id_curso`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(255) | não |  | NOT NULL |  |
| ativo | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |

**Referenciada por:**

- `cad_online_despertar.id_curso_1` → `curso_cad_online_despertar(id_curso)`
- `cad_online_despertar.id_curso_2` → `curso_cad_online_despertar(id_curso)`

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_curso

---

### curso_cad_online_geral

- Engine: `InnoDB` | Linhas aprox.: 7
- Chave primária: `id_curso`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não |  | PK, NOT NULL |  |
| formulario | int(11) | não |  | NOT NULL | 1: ideartec |
| nome | varchar(255) | não |  | NOT NULL |  |
| ativo | tinyint(1) | não |  | NOT NULL |  |

**Referenciada por:**

- `cad_online_ideartec.id_curso_1` → `curso_cad_online_geral(id_curso)`
- `cad_online_ideartec.id_curso_2` → `curso_cad_online_geral(id_curso)`

**Índices:**

- `formulario` (UNIQUE, BTREE): formulario, nome
- `PRIMARY` (UNIQUE, BTREE): id_curso

---

### curso_cad_online_prog_acao

- Engine: `InnoDB` | Linhas aprox.: 4
- Chave primária: `id_curso`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(255) | não |  | NOT NULL |  |
| ativo | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |

**Referenciada por:**

- `cad_online_prog_acao.id_curso_1` → `curso_cad_online_prog_acao(id_curso)`
- `cad_online_prog_acao.id_curso_2` → `curso_cad_online_prog_acao(id_curso)`

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_curso

---

### curso_cad_online_prog_itinerante

- Engine: `InnoDB` | Linhas aprox.: 5
- Chave primária: `id_curso`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(255) | não |  | NOT NULL |  |
| ativo | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |

**Referenciada por:**

- `cad_online_prog_itinerante.id_curso_1` → `curso_cad_online_prog_itinerante(id_curso)`
- `cad_online_prog_itinerante.id_curso_2` → `curso_cad_online_prog_itinerante(id_curso)`

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_curso

---

### curso_criterios_cad_integrado

- Engine: `InnoDB` | Linhas aprox.: 289
- Chave primária: `-`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não |  | FK, NOT NULL |  |
| id_criterio | int(11) | não |  | FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_criterio` → `criterio_cad_integrado(id_criterio)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_curso` → `curso_cad_integrado(id_curso)` [ON UPDATE NO ACTION, ON DELETE CASCADE]

**Índices:**

- `curso_criterios_cad_integrado_ibfk_1` (NON-UNIQUE, BTREE): id_criterio
- `id_curso` (UNIQUE, BTREE): id_curso, id_criterio

---

### curso_nome

_VIEW_

- Engine: `None` | Linhas aprox.: None
- Chave primária: `-`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_curso | int(11) | não | 0 | NOT NULL |  |
| id_projeto | int(11) | não |  | NOT NULL |  |
| nome | varchar(118) | não |  | NOT NULL |  |
| carga_horaria | int(11) | não |  | NOT NULL |  |

---

### escola

- Engine: `InnoDB` | Linhas aprox.: 134
- Chave primária: `id_escola`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_escola | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(100) | não |  | NOT NULL |  |

**Referenciada por:**

- `aluno.id_escola` → `escola(id_escola)`
- `turma.id_escola` → `escola(id_escola)`

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_escola

---

### estagiario

- Engine: `InnoDB` | Linhas aprox.: 8
- Chave primária: `id_estagiario`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_estagiario | int(11) | não |  | PK, NOT NULL |  |
| id_projeto | int(11) | não |  | FK, NOT NULL |  |
| nome | varchar(255) | não |  | NOT NULL |  |
| data_inicio | date | não |  | NOT NULL |  |
| data_termino | date | não |  | NOT NULL |  |
| carga_horaria | smallint(6) | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_projeto` (NON-UNIQUE, BTREE): id_projeto
- `PRIMARY` (UNIQUE, BTREE): id_estagiario

---

### evasao

- Engine: `InnoDB` | Linhas aprox.: 2
- Chave primária: `id_evasao`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_evasao | int(11) | não |  | PK, NOT NULL |  |
| id_turma | int(11) | não |  | NOT NULL |  |
| id_aluno | int(11) | não |  | NOT NULL |  |
| motivo | varchar(255) | não |  | NOT NULL |  |
| responsavel | varchar(100) | não |  | NOT NULL |  |
| data | date | não |  | NOT NULL |  |
| modelo_tablet | varchar(100) | não |  | NOT NULL |  |
| situacao_tablet | smallint(6) | não |  | NOT NULL | 1: a recolher / 2: recolhido (parceiros) / 3: recolhido (idear) |

**Índices:**

- `id_turma` (UNIQUE, BTREE): id_turma, id_aluno
- `PRIMARY` (UNIQUE, BTREE): id_evasao

---

### feriado

- Engine: `InnoDB` | Linhas aprox.: 11
- Chave primária: `id_feriado`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_feriado | int(11) | não |  | PK, NOT NULL |  |
| modalidade | smallint(6) | não |  | NOT NULL | 1: nacional / 2: estadual / 3: municipal |
| tipo | smallint(6) | não |  | NOT NULL | 1: fixo / 2: variável |
| cidade | varchar(50) | não |  | NOT NULL |  |
| uf | varchar(2) | não |  | NOT NULL |  |
| descricao | varchar(100) | não |  | NOT NULL |  |
| data | date | não |  | NOT NULL |  |

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_feriado

---

### frequencia

- Engine: `InnoDB` | Linhas aprox.: 562831
- Chave primária: `id_frequencia`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_frequencia | int(11) | não |  | PK, NOT NULL |  |
| id_aula | int(11) | não |  | FK, NOT NULL |  |
| id_aluno | int(11) | não |  | FK, NOT NULL |  |
| presenca | tinyint(1) | não |  | NOT NULL | 0: Não especificado / 1: Presente / 2: Faltou / 3: Falta justificada / 4: Reposição |
| atividade | tinyint(1) | não | 0 | NOT NULL | 0: não / 1: sim |
| obs | varchar(255) | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_aluno` → `aluno(id_aluno)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_aula` → `aula(id_aula)` [ON UPDATE CASCADE, ON DELETE CASCADE]

**Índices:**

- `id_aluno` (NON-UNIQUE, BTREE): id_aluno
- `id_aula` (UNIQUE, BTREE): id_aula, id_aluno
- `PRIMARY` (UNIQUE, BTREE): id_frequencia

---

### grupo_minoritario

- Engine: `InnoDB` | Linhas aprox.: 4
- Chave primária: `id_grupo_minoritario`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_grupo_minoritario | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(200) | não |  | NOT NULL |  |
| ativo | tinyint(1) | não | 1 | NOT NULL | 0: não / 1: sim |

**Referenciada por:**

- `cadastro_online.id_grupo_minoritario` → `grupo_minoritario(id_grupo_minoritario)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `PRIMARY` (UNIQUE, BTREE): id_grupo_minoritario

---

### instrutor

- Engine: `InnoDB` | Linhas aprox.: 97
- Chave primária: `id_instrutor`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_instrutor | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(100) | não |  | NOT NULL |  |
| assinatura | varchar(255) | não |  | NOT NULL |  |

**Referenciada por:**

- `aula.id_instrutor` → `instrutor(id_instrutor)`
- `instrutor_projetos.id_instrutor` → `instrutor(id_instrutor)`
- `turma.id_instrutor` → `instrutor(id_instrutor)`

**Índices:**

- `nome` (UNIQUE, BTREE): nome
- `PRIMARY` (UNIQUE, BTREE): id_instrutor

---

### instrutor_projetos

- Engine: `InnoDB` | Linhas aprox.: 0
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| id_instrutor | int(11) | não |  | FK, NOT NULL |  |
| id_projeto | int(11) | não |  | FK, NOT NULL |  |
| carga_horaria | smallint(6) | não |  | NOT NULL |  |
| tipo_contratacao | smallint(6) | não |  | NOT NULL | 1: mensal / 2: horas |
| status_contrato | smallint(6) | não |  | NOT NULL | 1: ativo / 2: encerrado |

**Chaves estrangeiras (referencia):**

- `id_instrutor` → `instrutor(id_instrutor)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_instrutor` (UNIQUE, BTREE): id_instrutor, id_projeto
- `id_projeto` (NON-UNIQUE, BTREE): id_projeto
- `PRIMARY` (UNIQUE, BTREE): id

---

### local

- Engine: `InnoDB` | Linhas aprox.: 73
- Chave primária: `id_local`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_local | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(100) | não |  | NOT NULL |  |

**Referenciada por:**

- `turma.id_local` → `local(id_local)`

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_local

---

### matricula

- Engine: `InnoDB` | Linhas aprox.: 57266
- Chave primária: `id_matricula`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_matricula | int(11) | não |  | PK, NOT NULL |  |
| id_aluno | int(11) | não |  | FK, NOT NULL |  |
| id_turma | int(11) | não |  | FK, NOT NULL |  |
| avaliacao | tinyint(1) | não |  | NOT NULL | 0 - não especificado / 1: ótimo / 2: bom / 3: regular |
| situacao | smallint(1) | não |  | NOT NULL | 0 - não especificado / 1 - matriculado / 2 - concluiu / 3 - desistiu / 4 - evadido / 5: não aprovado / 6: não iniciou / 7: ativo / 8: transferido |
| interesse_comp | varchar(100) | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_aluno` → `aluno(id_aluno)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_turma` → `turma(id_turma)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `matricula_modulos.id_matricula` → `matricula(id_matricula)`

**Índices:**

- `id_aluno` (NON-UNIQUE, BTREE): id_aluno
- `id_aluno_2` (UNIQUE, BTREE): id_aluno, id_turma
- `id_turma` (NON-UNIQUE, BTREE): id_turma
- `PRIMARY` (UNIQUE, BTREE): id_matricula

---

### matricula_modulos

- Engine: `InnoDB` | Linhas aprox.: 32412
- Chave primária: `id_matricula, id_modulo`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_matricula | int(11) | não |  | PK, FK, NOT NULL |  |
| id_modulo | int(11) | não |  | PK, FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_matricula` → `matricula(id_matricula)` [ON UPDATE CASCADE, ON DELETE CASCADE]
- `id_modulo` → `modulo(id)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_modulo` (NON-UNIQUE, BTREE): id_modulo
- `PRIMARY` (UNIQUE, BTREE): id_matricula, id_modulo

---

### meta_turma

- Engine: `InnoDB` | Linhas aprox.: 23
- Chave primária: `id_meta_turma`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_meta_turma | int(11) | não |  | PK, NOT NULL |  |
| id_projeto | int(11) | não |  | FK, NOT NULL |  |
| id_projeto_aditivo | int(11) | sim |  | FK |  |
| meta | varchar(100) | não |  | NOT NULL |  |
| unidade | varchar(255) | não |  | NOT NULL |  |
| valor | decimal(19,2) | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_projeto_aditivo` → `projeto_aditivo(id_projeto_aditivo)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `turma.id_meta_turma` → `meta_turma(id_meta_turma)`

**Índices:**

- `id_projeto` (NON-UNIQUE, BTREE): id_projeto
- `id_projeto_aditivo` (NON-UNIQUE, BTREE): id_projeto_aditivo
- `PRIMARY` (UNIQUE, BTREE): id_meta_turma

---

### modalidade

- Engine: `InnoDB` | Linhas aprox.: 3
- Chave primária: `id_modalidade`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_modalidade | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(100) | não |  | NOT NULL |  |

**Referenciada por:**

- `aula.id_modalidade` → `modalidade(id_modalidade)`
- `modulo.id_modalidade` → `modalidade(id_modalidade)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `PRIMARY` (UNIQUE, BTREE): id_modalidade

---

### modulo

- Engine: `InnoDB` | Linhas aprox.: 237
- Chave primária: `id`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id | int(11) | não |  | PK, NOT NULL |  |
| id_curso | int(11) | não |  | FK, NOT NULL |  |
| nome | varchar(50) | não |  | NOT NULL |  |
| carga_horaria | tinyint(11) | não |  | NOT NULL |  |
| id_modalidade | int(11) | não |  | FK, NOT NULL |  |
| descricao | text | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_curso` → `curso(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_modalidade` → `modalidade(id_modalidade)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `aula.id_modulo` → `modulo(id)`
- `aula_padrao.id_modulo` → `modulo(id)`
- `matricula_modulos.id_modulo` → `modulo(id)`

**Índices:**

- `id_curso` (UNIQUE, BTREE): id_curso, nome
- `id_modalidade` (NON-UNIQUE, BTREE): id_modalidade
- `PRIMARY` (UNIQUE, BTREE): id

---

### mtv_fora_perf_cad_online

- Engine: `InnoDB` | Linhas aprox.: 9
- Chave primária: `id_motivo`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_motivo | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(255) | não |  | NOT NULL |  |

**Referenciada por:**

- `cadastro_online.id_motivo_fora_perf` → `mtv_fora_perf_cad_online(id_motivo)`

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_motivo

---

### municipio

- Engine: `InnoDB` | Linhas aprox.: 184
- Chave primária: `id_municipio`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_municipio | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(100) | não |  | NOT NULL |  |
| latitude | decimal(19,6) | não |  | NOT NULL |  |
| longitude | decimal(19,6) | não |  | NOT NULL |  |

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_municipio

---

### nivel_escolar

- Engine: `InnoDB` | Linhas aprox.: 21
- Chave primária: `id_nivel_escolar`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_nivel_escolar | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(100) | não |  | NOT NULL |  |

**Referenciada por:**

- `aluno.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `art_artesao_empreendedor.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `cadastro_online.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `cad_integrado.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `cad_online_costura.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `cad_online_costura.p02_id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `cad_online_despertar.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `cad_online_ideartec.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `cad_online_prog_acao.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`
- `cad_online_prog_itinerante.id_nivel_escolar` → `nivel_escolar(id_nivel_escolar)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `PRIMARY` (UNIQUE, BTREE): id_nivel_escolar

---

### pre_insc_ead

- Engine: `InnoDB` | Linhas aprox.: 1
- Chave primária: `id_inscricao`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_inscricao | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(255) | não |  | NOT NULL |  |
| email | varchar(255) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| estado | varchar(2) | não |  | NOT NULL |  |
| data_nascimento | date | não |  | NOT NULL |  |
| celular | varchar(20) | não |  | NOT NULL |  |
| id_curso_mdl | int(11) | sim |  |  |  |
| id_aluno | int(11) | sim |  | FK |  |
| id_user_mdl | int(11) | sim |  |  |  |
| status | smallint(6) | não |  | NOT NULL |  |
| data_inscricao | datetime | não |  | NOT NULL |  |
| data_atualizacao | datetime | sim |  |  |  |

**Chaves estrangeiras (referencia):**

- `id_aluno` → `aluno(id_aluno)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_aluno` (NON-UNIQUE, BTREE): id_aluno
- `PRIMARY` (UNIQUE, BTREE): id_inscricao

---

### projeto

- Engine: `InnoDB` | Linhas aprox.: 20
- Chave primária: `id_projeto`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_projeto | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(100) | não |  | NOT NULL |  |
| controle_modulos | tinyint(1) | não |  | NOT NULL | 0: não / 1: sim |
| cha_tecnologico | tinyint(1) | não | 0 | NOT NULL |  |

**Referenciada por:**

- `cadastro_online.id_projeto` → `projeto(id_projeto)`
- `cad_integrado_entrevista.id_projeto` → `projeto(id_projeto)`
- `convocacao_cha.id_projeto` → `projeto(id_projeto)`
- `curso.id_projeto` → `projeto(id_projeto)`
- `curso_cad_integrado.id_projeto` → `projeto(id_projeto)`
- `estagiario.id_projeto` → `projeto(id_projeto)`
- `instrutor_projetos.id_projeto` → `projeto(id_projeto)`
- `meta_turma.id_projeto` → `projeto(id_projeto)`
- `projeto_aditivo.id_projeto` → `projeto(id_projeto)`
- `psicoagenda.id_projeto` → `projeto(id_projeto)`
- `seg_usuarios_projetos.id_projeto` → `projeto(id_projeto)`

**Índices:**

- `nome` (UNIQUE, BTREE): nome
- `PRIMARY` (UNIQUE, BTREE): id_projeto

---

### projeto_aditivo

- Engine: `InnoDB` | Linhas aprox.: 11
- Chave primária: `id_projeto_aditivo`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_projeto_aditivo | int(11) | não |  | PK, NOT NULL |  |
| id_projeto | int(11) | não |  | FK, NOT NULL |  |
| numero | varchar(50) | não |  | NOT NULL |  |
| inicio | date | não |  | NOT NULL |  |
| fim | date | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `meta_turma.id_projeto_aditivo` → `projeto_aditivo(id_projeto_aditivo)`

**Índices:**

- `id_projeto` (UNIQUE, BTREE): id_projeto, numero
- `PRIMARY` (UNIQUE, BTREE): id_projeto_aditivo

---

### psicoagenda

- Engine: `InnoDB` | Linhas aprox.: 29
- Chave primária: `id_psicoagenda`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_psicoagenda | int(11) | não |  | PK, NOT NULL |  |
| id_projeto | int(11) | sim |  | FK |  |
| id_turma | int(11) | sim |  | FK |  |
| id_usuario | int(11) | sim |  | FK |  |
| profissional | smallint(6) | não |  | NOT NULL |  |
| data | date | não |  | NOT NULL |  |
| hora_inicio | time | não |  | NOT NULL |  |
| hora_fim | time | não |  | NOT NULL |  |
| justificativa | text | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_projeto` → `projeto(id_projeto)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_turma` → `turma(id_turma)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_usuario` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Índices:**

- `id_projeto` (NON-UNIQUE, BTREE): id_projeto
- `id_turma` (NON-UNIQUE, BTREE): id_turma
- `id_usuario` (NON-UNIQUE, BTREE): id_usuario
- `PRIMARY` (UNIQUE, BTREE): id_psicoagenda

---

### raca

- Engine: `InnoDB` | Linhas aprox.: 6
- Chave primária: `id_raca`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_raca | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(255) | não |  | NOT NULL |  |

**Referenciada por:**

- `cad_online_despertar.id_raca` → `raca(id_raca)`
- `cad_online_ideartec.id_raca` → `raca(id_raca)`
- `cad_online_prog_acao.id_raca` → `raca(id_raca)`
- `cad_online_prog_itinerante.id_raca` → `raca(id_raca)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `PRIMARY` (UNIQUE, BTREE): id_raca

---

### seg_aplicacoes

- Engine: `InnoDB` | Linhas aprox.: 216
- Chave primária: `id_aplicacao`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_aplicacao | varchar(100) | não |  | PK, NOT NULL |  |
| descricao | varchar(60) | sim |  |  |  |

**Referenciada por:**

- `seg_grupos_aplicacoes.id_aplicacao` → `seg_aplicacoes(id_aplicacao)`

**Índices:**

- `id_aplicacao_UNIQUE` (UNIQUE, BTREE): id_aplicacao
- `PRIMARY` (UNIQUE, BTREE): id_aplicacao

---

### seg_grupos

- Engine: `InnoDB` | Linhas aprox.: 10
- Chave primária: `id_grupo`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_grupo | int(11) | não |  | PK, NOT NULL |  |
| nome | varchar(60) | não |  | NOT NULL |  |

**Referenciada por:**

- `seg_grupos_aplicacoes.id_grupo` → `seg_grupos(id_grupo)`
- `seg_usuarios.id_grupo` → `seg_grupos(id_grupo)`

**Índices:**

- `nome_UNIQUE` (UNIQUE, BTREE): nome
- `PRIMARY` (UNIQUE, BTREE): id_grupo

---

### seg_grupos_aplicacoes

- Engine: `InnoDB` | Linhas aprox.: 1586
- Chave primária: `-`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_grupo | int(11) | não |  | FK, NOT NULL |  |
| id_aplicacao | varchar(100) | não |  | FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_grupo` → `seg_grupos(id_grupo)` [ON UPDATE NO ACTION, ON DELETE CASCADE]
- `id_aplicacao` → `seg_aplicacoes(id_aplicacao)` [ON UPDATE NO ACTION, ON DELETE CASCADE]

**Índices:**

- `id_grupo` (NON-UNIQUE, BTREE): id_grupo
- `seg_grupos_aplicacoes_ibfk_2` (NON-UNIQUE, BTREE): id_aplicacao

---

### seg_usuarios

- Engine: `InnoDB` | Linhas aprox.: 116
- Chave primária: `id_usuario`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_usuario | int(11) | não |  | PK, NOT NULL |  |
| id_grupo | int(11) | não |  | FK, NOT NULL |  |
| nome | varchar(200) | não |  | NOT NULL |  |
| login | varchar(20) | não |  | NOT NULL |  |
| senha | varchar(255) | não |  | NOT NULL |  |
| data_cadastro | date | não |  | NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_grupo` → `seg_grupos(id_grupo)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `atendimento.id_usuario_responsavel` → `seg_usuarios(id_usuario)`
- `atendimento_encaminhamentos.id_usuario_origem` → `seg_usuarios(id_usuario)`
- `atendimento_encaminhamentos.id_usuario_destino` → `seg_usuarios(id_usuario)`
- `cadastro_online.responsavel_entrevista` → `seg_usuarios(id_usuario)`
- `cadastro_online_analise.id_usuario_responsavel` → `seg_usuarios(id_usuario)`
- `cadastro_online_ligacoes.id_usuario_responsavel` → `seg_usuarios(id_usuario)`
- `cadastro_online_log.id_usuario` → `seg_usuarios(id_usuario)`
- `cad_integrado_entrevista.id_usuario_entrevista` → `seg_usuarios(id_usuario)`
- `cad_integrado_entrevista.id_usuario_ligacoes` → `seg_usuarios(id_usuario)`
- `cad_online_costura.id_usuario_entrevista` → `seg_usuarios(id_usuario)`
- `cad_online_geral_ligacoes.id_usuario_responsavel` → `seg_usuarios(id_usuario)`
- `convocacao_cha_ligacoes.id_usuario` → `seg_usuarios(id_usuario)`
- `psicoagenda.id_usuario` → `seg_usuarios(id_usuario)`
- `seg_usuarios_projetos.id_usuario` → `seg_usuarios(id_usuario)`
- `turma.id_usuario_atualizacao` → `seg_usuarios(id_usuario)`

**Índices:**

- `id_grupo` (NON-UNIQUE, BTREE): id_grupo
- `login` (UNIQUE, BTREE): login
- `PRIMARY` (UNIQUE, BTREE): id_usuario

---

### seg_usuarios_projetos

- Engine: `InnoDB` | Linhas aprox.: 504
- Chave primária: `id_usuario, id_projeto`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_usuario | int(11) | não |  | PK, FK, NOT NULL |  |
| id_projeto | int(11) | não |  | PK, FK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_usuario` → `seg_usuarios(id_usuario)` [ON UPDATE CASCADE, ON DELETE CASCADE]
- `id_projeto` → `projeto(id_projeto)` [ON UPDATE CASCADE, ON DELETE NO ACTION]

**Índices:**

- `id_projeto` (NON-UNIQUE, BTREE): id_projeto
- `PRIMARY` (UNIQUE, BTREE): id_usuario, id_projeto

---

### status_cad_online

- Engine: `InnoDB` | Linhas aprox.: 11
- Chave primária: `id_status`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_status | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(255) | não |  | NOT NULL |  |
| ordem | int(11) | não |  | NOT NULL |  |

**Referenciada por:**

- `cadastro_online.id_status` → `status_cad_online(id_status)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `PRIMARY` (UNIQUE, BTREE): id_status

---

### status_cad_online_despertar

- Engine: `InnoDB` | Linhas aprox.: 6
- Chave primária: `id_status`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_status | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(255) | não |  | NOT NULL |  |
| ordem | int(11) | não |  | NOT NULL |  |

**Referenciada por:**

- `cad_online_despertar.id_status` → `status_cad_online_despertar(id_status)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `ordem` (UNIQUE, BTREE): ordem
- `PRIMARY` (UNIQUE, BTREE): id_status

---

### status_cad_online_geral

- Engine: `InnoDB` | Linhas aprox.: 6
- Chave primária: `id_status`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_status | int(11) | não |  | PK, NOT NULL |  |
| formulario | int(11) | não |  | NOT NULL | 1: ideartec |
| descricao | varchar(255) | não |  | NOT NULL |  |
| ordem | int(11) | não |  | NOT NULL |  |

**Referenciada por:**

- `cad_online_ideartec.id_status` → `status_cad_online_geral(id_status)`

**Índices:**

- `formulario` (UNIQUE, BTREE): formulario, descricao
- `formulario_2` (UNIQUE, BTREE): formulario, ordem
- `PRIMARY` (UNIQUE, BTREE): id_status

---

### status_cad_online_prog_acao

- Engine: `InnoDB` | Linhas aprox.: 6
- Chave primária: `id_status`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_status | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(255) | não |  | NOT NULL |  |
| ordem | int(11) | não |  | NOT NULL |  |

**Referenciada por:**

- `cad_online_prog_acao.id_status` → `status_cad_online_prog_acao(id_status)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `ordem` (UNIQUE, BTREE): ordem
- `PRIMARY` (UNIQUE, BTREE): id_status

---

### status_cad_online_prog_itinerante

- Engine: `InnoDB` | Linhas aprox.: 6
- Chave primária: `id_status`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_status | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(255) | não |  | NOT NULL |  |
| ordem | int(11) | não |  | NOT NULL |  |

**Referenciada por:**

- `cad_online_prog_itinerante.id_status` → `status_cad_online_prog_itinerante(id_status)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao
- `ordem` (UNIQUE, BTREE): ordem
- `PRIMARY` (UNIQUE, BTREE): id_status

---

### tablets_temp

- Engine: `InnoDB` | Linhas aprox.: 0
- Chave primária: `-`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| pulsos | varchar(100) | não |  | NOT NULL |  |
| imei | varchar(100) | não |  | NOT NULL |  |
| cpf | varchar(14) | não |  | NOT NULL |  |
| numero | varchar(100) | não |  | NOT NULL |  |
| operadora | varchar(50) | não |  | NOT NULL |  |
| email | varchar(255) | não |  | NOT NULL |  |

---

### tipo_atendimento

- Engine: `InnoDB` | Linhas aprox.: 12
- Chave primária: `id_tipo_atendimento`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_tipo_atendimento | int(11) | não |  | PK, NOT NULL |  |
| descricao | varchar(200) | não |  | NOT NULL |  |
| ordem | int(11) | sim |  |  |  |

**Referenciada por:**

- `atendimento.id_tipo_atendimento` → `tipo_atendimento(id_tipo_atendimento)`

**Índices:**

- `descricao` (UNIQUE, BTREE): descricao, ordem
- `PRIMARY` (UNIQUE, BTREE): id_tipo_atendimento

---

### turma

- Engine: `InnoDB` | Linhas aprox.: 4488
- Chave primária: `id_turma`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_turma | int(11) | não |  | PK, NOT NULL |  |
| id_curso | int(11) | não |  | FK, NOT NULL |  |
| codigo | varchar(25) | não |  | NOT NULL |  |
| id_instrutor | int(11) | não |  | FK, NOT NULL |  |
| id_meta_turma | int(11) | sim |  | FK |  |
| data_inicio | date | não |  | NOT NULL |  |
| data_fim | date | não |  | NOT NULL |  |
| hora_inicio | time | não |  | NOT NULL |  |
| hora_fim | time | não |  | NOT NULL |  |
| turno | tinyint(1) | não |  | NOT NULL | 1: manhã / 2: tarde / 3: noite |
| id_local | int(11) | não |  | FK, NOT NULL |  |
| id_escola | int(11) | não |  | FK, NOT NULL |  |
| dias | varchar(100) | não |  | NOT NULL |  |
| cidade | varchar(50) | não |  | NOT NULL |  |
| uf | varchar(2) | não |  | NOT NULL |  |
| status | smallint(6) | não | 0 | NOT NULL | 0: não especificado / 1: não iniciada / 2: iniciada / 3: concluída / 4: cancelada |
| id_usuario_atualizacao | int(11) | sim |  | FK |  |
| dh_ultima_atualizacao | datetime | sim |  |  |  |

**Chaves estrangeiras (referencia):**

- `id_curso` → `curso(id_curso)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_instrutor` → `instrutor(id_instrutor)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_local` → `local(id_local)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_escola` → `escola(id_escola)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_meta_turma` → `meta_turma(id_meta_turma)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]
- `id_usuario_atualizacao` → `seg_usuarios(id_usuario)` [ON UPDATE NO ACTION, ON DELETE NO ACTION]

**Referenciada por:**

- `atendimento.id_turma` → `turma(id_turma)`
- `aula.id_turma` → `turma(id_turma)`
- `matricula.id_turma` → `turma(id_turma)`
- `psicoagenda.id_turma` → `turma(id_turma)`
- `turma_dias.id_turma` → `turma(id_turma)`

**Índices:**

- `codigo` (UNIQUE, BTREE): codigo
- `id_curso` (NON-UNIQUE, BTREE): id_curso
- `id_escola` (NON-UNIQUE, BTREE): id_escola
- `id_instrutor` (NON-UNIQUE, BTREE): id_instrutor
- `id_local` (NON-UNIQUE, BTREE): id_local
- `id_meta_turma` (NON-UNIQUE, BTREE): id_meta_turma
- `id_usuario_atualizacao` (NON-UNIQUE, BTREE): id_usuario_atualizacao
- `PRIMARY` (UNIQUE, BTREE): id_turma

---

### turma_dias

- Engine: `InnoDB` | Linhas aprox.: 1119
- Chave primária: `id_turma, dia`

| Coluna | Tipo | Nulo | Default | Flags | Comentário |
|---|---|---|---|---|---|
| id_turma | int(11) | não |  | PK, FK, NOT NULL |  |
| dia | smallint(6) | não |  | PK, NOT NULL |  |

**Chaves estrangeiras (referencia):**

- `id_turma` → `turma(id_turma)` [ON UPDATE NO ACTION, ON DELETE CASCADE]

**Índices:**

- `PRIMARY` (UNIQUE, BTREE): id_turma, dia

---
