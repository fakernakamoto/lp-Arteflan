# Refatoração CRO e SEO — 27/09/2026

## Fluxo atualizado

- CTAs de cotação usam a âncora `#cotacao` com rolagem suave e compensação do cabeçalho. O movimento reduzido desabilita a rolagem animada.
- `QuoteForm` é compartilhado pela landing, pelo popup e por `/orcamento`. Valida nome, empresa/CNPJ e segmento; monta uma mensagem codificada e abre o número oficial 5567992348962.
- O visitante confirma o envio dentro do WhatsApp. O evento `quote_whatsapp_redirect` representa tentativa de contato, não mensagem enviada. Dados pessoais não são enviados ao analytics.
- O novo formulário não depende do endpoint antigo `/api/lead` nem do questionário. Os arquivos legados continuam disponíveis, sem uso nas rotas atuais.
- O popup abre após 15 segundos ou saída superior do mouse em desktop. Há limite de uma exibição por sessão, supressão durante preenchimento/menu e suporte a Escape/foco por teclado.
- O número oficial é fixado em `src/lib/whatsapp.ts`, conforme o escopo; a variável legada `VITE_ARTEFLAN_WHATSAPP_NUMBER` não sobrescreve esse destino.

## SEO, imagens e mobile

- Title, description, Open Graph/Twitter com imagem pública e URL canônica existente; um h1 e um main por página.
- H2 nos blocos de CTA e rodapé, h3 nos produtos e etapas; textos alternativos descritivos para a vitrine.
- Oito imagens que dependiam do ambiente Lovable agora são arquivos locais WebP. Peso total: 9.968.396 para 319.992 bytes (96,8% menor nesse conjunto, não na página inteira).
- Cabeçalho com WhatsApp visível a partir de 320 px; formulário com campos de 16 px; seletores de produto com área mínima de 44 px; botão flutuante oculto durante a visualização da cotação.

## Verificação

- `npm test`: cinco testes de validação e codificação da mensagem.
- `npm run verify`: checagem estrutural, TypeScript e build aprovados.
- ESLint nos arquivos TypeScript alterados: sem erros ou avisos.
- Playwright/Chromium: âncoras, formulário inválido/válido, destino WhatsApp interceptado (nenhuma mensagem enviada), saída de mouse, temporizador, foco, Escape, sessão, preenchimento em andamento, menu mobile, troca de produtos e rota `/orcamento`.
- Viewports: 320, 375, 768, 1024 e 1440 px. Modal também inspecionado em 375 × 812.
- HTML SSR inspecionado para metadados, h1/main e alt. Sem erros de JavaScript ou 404 na última verificação de navegação.

## Prévia local

`npm run dev -- --host 127.0.0.1 --port 5173`

O script legado `npm run preview` procura `dist/server/server.js`, enquanto este projeto gera `.output` para Cloudflare. Para testar o artefato compilado, use:

`npx wrangler dev --config .output/server/wrangler.json --port 5174 --local`

Nenhuma publicação foi realizada. O domínio canônico existente continua sendo `https://lp-arteflan.vercel.app/`.
