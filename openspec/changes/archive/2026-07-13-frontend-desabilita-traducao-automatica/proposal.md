## Why

O Google Translate (embutido no Chrome) ofereceu/aplicou tradução automática na página, e mangled cabeçalhos curtos e sem contexto da tabela de turmas — "Início" virou algo como "Não se trata de uma questão de...", "Término" virou "Terminal". Reportado e confirmado pelo responsável do projeto. Renomear os rótulos (ex.: "Data Início") reduziria o risco só para essas duas colunas, mas não resolve a causa raiz: qualquer outro texto curto da tela (Código, Curso, Situação, Alunos ativos...) continua vulnerável ao mesmo tipo de erro para outro visitante, outro navegador ou outra versão do tradutor. O sistema é uso interno, 100% em português, para usuários brasileiros — não há motivo para o navegador sequer oferecer tradução.

## What Changes

- **`frontend/index.html` ganha `<meta name="google" content="notranslate">`**: impede o Google Translate (e o tradutor embutido do Chrome, que usa o mesmo mecanismo) de oferecer ou aplicar tradução automática na página inteira.
- **Correção do atributo de idioma**: `<html lang="en">` está incorreto (o conteúdo é 100% em português) — corrigido para `<html lang="pt-BR">`, o que também ajuda o navegador a não sinalizar a página como candidata a tradução por divergência de idioma.
- **Sem mudança de texto/rótulos**: os cabeçalhos continuam "Início"/"Término" como estão hoje — a correção é impedir a tradução de ser oferecida, não reescrever conteúdo na esperança de "escapar" de um tradutor que não controlamos.

## Capabilities

### New Capabilities
(nenhuma)

### Modified Capabilities
- `frontend-dashboard`: a aplicação passa a sinalizar explicitamente ao navegador que não deve ser traduzida automaticamente.

## Impact

- **Frontend alterado**: `frontend/index.html` (meta tag + atributo `lang`).
- **Sem mudança de comportamento funcional**, sem dependências novas, sem impacto em backend.
- **Efeito esperado**: a oferta/execução de tradução automática do Chrome deixa de aparecer para esta aplicação; qualquer texto da interface (não só "Início"/"Término") fica protegido do mesmo tipo de erro.
