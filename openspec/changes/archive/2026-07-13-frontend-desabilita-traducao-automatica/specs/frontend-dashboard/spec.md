## ADDED Requirements

### Requirement: Aplicação não oferece tradução automática do navegador
`frontend/index.html` SHALL declarar `<meta name="google" content="notranslate">` e `<html lang="pt-BR">`, para que o Google Translate (e o tradutor embutido do Chrome) SHALL NOT ofereça nem aplique tradução automática nesta aplicação — o sistema é de uso interno, integralmente em português, e textos curtos de interface (cabeçalhos de tabela, rótulos) são especialmente propensos a tradução automática incorreta e sem contexto.

#### Scenario: Navegador não oferece traduzir a página
- **WHEN** um usuário com Chrome (ou navegador baseado em Chromium com Google Translate) abre qualquer tela da aplicação
- **THEN** o navegador não exibe o prompt/ícone de oferecimento de tradução automática para a página

#### Scenario: Idioma declarado corretamente
- **WHEN** o HTML da aplicação é inspecionado
- **THEN** o atributo `lang` do elemento `<html>` é `pt-BR`, refletindo o idioma real do conteúdo
