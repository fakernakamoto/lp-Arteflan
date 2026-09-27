# Auditoria de preparação para Vercel

## Correções aplicadas

1. **Webhook protegido**
   - Removido o fallback com URL real do Make do código-fonte.
   - `POST /api/lead` agora exige `MAKE_ARTEFLAN_WEBHOOK_URL` no ambiente do servidor.
   - Se a variável não existir, o endpoint retorna erro de configuração em vez de simular sucesso.

2. **Fluxo único de leads**
   - Removidos os componentes antigos e não utilizados `ContactForm.tsx` e `CtaB2B.tsx`.
   - O formulário principal continua sendo o quiz, com envio por `/api/lead`.
   - O botão flutuante do WhatsApp não envia um segundo payload incompleto nem duplica conversões.

3. **WhatsApp centralizado**
   - Criado `src/lib/whatsapp.ts`.
   - O quiz e o botão flutuante utilizam `VITE_ARTEFLAN_WHATSAPP_NUMBER`.

4. **Assets do Lovable**
   - Adicionada a variável `VITE_ASSET_ORIGIN` porque parte do catálogo usa arquivos `.asset.json`.
   - Valor atual: `https://timeless-filter-glow.lovable.app`.

5. **HTML e tracking**
   - O fallback `noscript` do Meta Pixel foi movido para o início do `<body>`.
   - O ID e o hostname do Pixel foram centralizados nas constantes já existentes.

6. **Scripts de validação**
   - `npm run typecheck`
   - `npm run check:deploy`
   - `npm run verify`
   - `npm run start`

7. **Configuração do projeto**
   - Nome do pacote atualizado para `arteflan-landing-page`.
   - Node fixado em `22.x`.
   - `.env.example` adicionado sem segredos.
   - `.vercel/` e arquivos `.env` protegidos pelo `.gitignore`.

## Validações executadas neste pacote

- Verificação estrutural de arquivos obrigatórios: aprovada.
- Busca por webhook do Make exposto em `src`: nenhuma URL real encontrada.
- Sintaxe TypeScript/TSX: aprovada em todos os arquivos-fonte.
- Resolução de imports locais: aprovada.

## Validação que ainda deve ser executada no computador/Vercel

O ambiente de montagem deste pacote não conseguiu baixar `@cloudflare/vite-plugin` do registro interno disponível, então o `npm install` e o build completo não foram executados aqui. Rode antes do deploy:

```bash
npm install
npm run verify
```

Depois confirme um envio real do quiz e o recebimento integral do payload no cenário do Make.
