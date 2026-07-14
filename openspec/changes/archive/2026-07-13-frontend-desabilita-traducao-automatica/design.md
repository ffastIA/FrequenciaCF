## Context

`frontend/index.html` é o template base do Vite (`<html lang="en">`), nunca ajustado para o idioma real do conteúdo (português). O Google Translate/Chrome Translate decide se oferece tradução combinando detecção de idioma do conteúdo com sinais da página; um `lang` incorreto e a ausência do sinal explícito `notranslate` deixam a página sujeita a esse recurso. O incidente relatado (cabeçalhos "Início"/"Término" mangled) é um sintoma de tradução automática de textos curtos e sem contexto suficiente para o modelo de tradução — comportamento de um serviço de terceiros, fora do nosso controle.

## Goals / Non-Goals

**Goals:**
- O Chrome (e o Google Translate) SHALL NOT oferecer/aplicar tradução automática nesta aplicação.
- Corrigir o `lang` declarado para refletir o conteúdo real (português).
- Proteger **toda** a interface do mesmo tipo de erro, não só as colunas reportadas.

**Non-Goals:**
- Internacionalização (i18n) da aplicação — o sistema é uso interno em português; não há necessidade de suportar outros idiomas.
- Renomear rótulos existentes como mitigação — descartado como solução primária (ver `proposal.md`: não resolve a causa raiz, é aposta em comportamento de terceiro).

## Decisions

1. **`<meta name="google" content="notranslate">` em vez de renomear rótulos**: é o mecanismo padrão da web que o Google Translate respeita para desativar a oferta de tradução numa página inteira — resolve a causa raiz de uma vez (qualquer texto, presente ou futuro), em vez de uma correção pontual em duas colunas que deixaria o resto da interface exposto ao mesmo risco.

2. **Corrigir `lang="en"` → `lang="pt-BR"`**: mudança pequena e diretamente relacionada — o atributo estava simplesmente errado (herdado do template padrão do Vite, nunca ajustado), e declarar o idioma correto é boa prática independente do problema de tradução, além de reduzir ainda mais a chance de o navegador sinalizar a página como candidata a tradução por incoerência de idioma.

3. **Não usar `translate="no"` por elemento**: o atributo HTML `translate="no"` (ou classe `notranslate`) permite excluir só partes específicas da página, mantendo o resto traduzível — útil para apps que **querem** suportar tradução parcial. Não é o caso aqui: a aplicação inteira é para uso interno em português, então a meta tag (que desliga a oferta de tradução na página inteira) é mais simples e completa que aplicar o atributo em cada elemento.

## Risks / Trade-offs

- [Depende do Google Translate/Chrome respeitar a meta tag] → É o mecanismo oficialmente documentado e amplamente respeitado pelo Google Translate; não há garantia absoluta de comportamento de terceiro, mas é a mitigação padrão da indústria para este problema.
- [Usuário que realmente queira traduzir a página perde essa opção] → Aceitável: o sistema é interno, para usuários que já leem português (contexto do próprio domínio: Centro de Formação, termos como "turma", "aditivo" não fariam sentido traduzidos de qualquer forma).

## Migration Plan

Mudança de uma linha em `index.html`, sem dependências, sem impacto em dados/backend. Deploy do frontend novo é suficiente. Rollback: reverter o arquivo.

## Open Questions

Nenhuma.
