# Deploy da landing page Arteflan na Vercel

## Stack

- React 19
- TanStack Start
- Vite
- Nitro
- TypeScript
- Tailwind CSS

## Configuração recomendada no projeto Vercel

- **Framework Preset:** TanStack Start
- **Root Directory:** raiz deste projeto
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** deixe vazio; não configure `dist`, `.output` ou `.vercel/output`
- **Node.js:** 22.x

O build do Nitro gera o formato apropriado para a Vercel. Um Output Directory manual pode fazer a Vercel tratar a aplicação SSR como um site estático e quebrar `/api/lead`.

## Variáveis de ambiente obrigatórias

Cadastre em **Production** e **Preview**:

```text
MAKE_ARTEFLAN_WEBHOOK_URL=<webhook exclusivo da Arteflan no Make>
VITE_ARTEFLAN_WHATSAPP_NUMBER=5567992348962
VITE_ASSET_ORIGIN=https://timeless-filter-glow.lovable.app
```

Variáveis opcionais de mídia:

```text
VITE_GA4_ID=
VITE_ADS_ID=
VITE_ADS_CONVERSION_LABEL=
```

`MAKE_ARTEFLAN_WEBHOOK_URL` é server-side e não deve ter prefixo `VITE_`.


## Assets exportados do Lovable

Algumas imagens do catálogo usam arquivos `.asset.json`. O build do Lovable usa `VITE_ASSET_ORIGIN` para apontar esses assets ao projeto publicado. Sem essa variável, imagens como logo e produtos podem retornar 404 na Vercel.

## Deploy por terminal

```bash
cd "/caminho/para/arteflan-landing-page"
npm install
npm run verify
vercel link
vercel env add MAKE_ARTEFLAN_WEBHOOK_URL production
vercel env add MAKE_ARTEFLAN_WEBHOOK_URL preview
vercel env add VITE_ARTEFLAN_WHATSAPP_NUMBER production
vercel env add VITE_ARTEFLAN_WHATSAPP_NUMBER preview
vercel env add VITE_ASSET_ORIGIN production
vercel env add VITE_ASSET_ORIGIN preview
vercel --prod
```

## Deploy por GitHub

1. Crie um repositório privado.
2. Envie este projeto para a branch `main`.
3. Importe o repositório na Vercel.
4. Selecione o preset **TanStack Start**.
5. Cadastre as variáveis acima.
6. Faça o primeiro deploy.

## Testes após o deploy

1. Abra a página principal.
2. Confirme que o vídeo do hero carrega e o poster aparece como fallback.
3. Preencha o quiz até o final.
4. Confirme que `POST /api/lead` retorna `200`.
5. Confirme no Make que o payload completo foi recebido.
6. Teste o redirecionamento ao WhatsApp.
7. Teste o botão flutuante do WhatsApp.
8. Verifique o console do navegador e os logs da função na Vercel.

## Segurança aplicada

- O webhook do Make não está gravado no código cliente.
- A rota `/api/lead` exige `MAKE_ARTEFLAN_WEBHOOK_URL` no servidor.
- Sem essa variável, a rota retorna erro de configuração e não simula sucesso.
- O formulário principal só dispara conversões após confirmação 2xx do endpoint.
