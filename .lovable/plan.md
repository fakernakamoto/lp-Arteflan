Escopo enorme — vou executar em 4 sprints, cada um em um turno separado, para manter qualidade e permitir revisão. Sem alterar identidade visual, textos de marca ou o número WhatsApp (5567992348962). Sem inserir IDs fictícios de GA4/Ads.

## Sprint 1 — Conversão

**Hero (`src/components/landing/Hero.tsx`)**
- Nova hierarquia: badge → headline curta ("Coadores Premium desde 1990") → subheadline → CTA primário "Falar com Consultor" → 4 bullets de confiança → vídeo por último (abaixo em mobile).
- Garantir CTA acima da dobra 320–430px: reduzir paddings, mover vídeo para depois do CTA no mobile via `order`.

**Formulário (`ContactForm.tsx`)**
- `autoComplete` (name, tel, email, address-level2), `inputMode` (tel/email/text), `type="tel"`/`"email"`.
- Máscara BR de telefone `(00) 00000-0000` on-change.
- Validação em tempo real (zod) com mensagens amigáveis PT-BR.
- Estado `submitting`: botão disabled + spinner (Loader2), impede double-submit com ref.
- Sucesso visual (toast sonner + estado interno) antes do redirect.

**CTAs adicionais** (âncora para `#contato`)
- Novo componente `CtaInline` reutilizável, inserido após: `B2BAdvantages`, `Products`/`ProductShowcase`, antes de `Faq`, e no final (mantém `CtaB2B`).

**Provas de confiança acima do formulário**
- Novo bloco em `ContactForm.tsx` (ou componente `TrustBadges`) com 5 selos: Empresa brasileira, Atendimento rápido, Produção própria, Fabricação personalizada, Resposta em minutos.

## Sprint 2 — Performance

**Hero vídeo**
- Gerar poster WebP (imagegen), `<video preload="none" poster>` sem autoplay.
- Carregar `src` apenas após `requestIdleCallback` + IntersectionObserver.
- LCP passa a ser o poster/headline, não o vídeo.

**Imagens**
- Instalar `vite-imagetools`. Reexportar imagens principais como AVIF/WebP com `?format=avif&as=srcset` + fallback.
- Adicionar `width`, `height`, `loading="lazy"`, `decoding="async"`, `sizes`.

**JS/bundle**
- `React.lazy` + `Suspense` para seções abaixo da dobra (`Products`, `ProductShowcase`, `Credibility`, `Clients`, `Faq`, `ContactForm`).
- `React.memo` em componentes puros de lista.
- Remover imports não usados (varredura com `rg`).
- Reduzir framer-motion acima da dobra (Hero sem `motion` desnecessário).

## Sprint 3 — Google Ads / Tracking

**Infra (`src/lib/analytics.ts` novo)**
- Wrappers `gaEvent()`, `adsConversion()` que checam presença de `VITE_GA4_ID` / `VITE_ADS_ID` via `import.meta.env`. Sem ID → no-op. Sem placeholders.
- Loader condicional de `gtag.js` no `__root.tsx` (só em produção, só se env vars presentes).

**Consent Mode v2 (`src/lib/consent.ts` + `CookieBanner.tsx`)**
- Default `denied` para `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`.
- Banner minimal (Aceitar / Rejeitar / Preferências).
- `gtag('consent','update',...)` após escolha; Meta Pixel também respeita consent (só inicializa após aceite ou queda para modo restrito).

**Eventos** (adicionar aos handlers existentes)
- `page_view` automático; `scroll_25/50/75/100` via listener; `click_cta`, `click_whatsapp`, `click_phone`, `begin_form` (primeiro focus), `field_focus`, `submit_form`, `generate_lead`, `download_catalog`, `video_play`, `video_complete`.

**UTMs (`src/lib/utm.ts`)**
- Capturar `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `ttclid`, `msclkid` no primeiro load.
- Persistir em `localStorage` (30 dias).
- `buildLeadMeta` passa a ler do storage; webhook recebe automaticamente.

## Sprint 4 — SEO técnico + A11y + Headers

**Head/meta (`__root.tsx` + `routes/index.tsx`)**
- Canonical `https://lp.arteflan.com/`, Open Graph completo, Twitter Cards, `theme-color`, `apple-touch-icon`.
- `public/site.webmanifest`, `public/robots.txt`, `src/routes/sitemap[.]xml.ts` (server route).

**JSON-LD** (scripts no head do index)
- Organization + LocalBusiness (Arteflan), WebSite + SearchAction, Product (linha coadores), BreadcrumbList, FAQPage (a partir dos itens já presentes em `Faq.tsx`).

**Headings**
- 1 único H1 no Hero; H2 por seção; H3 dentro de FAQ/produtos. Auditar e corrigir.

**Acessibilidade**
- Skip-to-content link no `__root`.
- `aria-label` em botões ícone-only e no FAB WhatsApp (já existe — validar).
- Focus-visible ring consistente via tokens.
- Contraste de `text-white/70` sobre gradiente do formulário — subir para `/85` se falhar.

**Headers de segurança (`vite.config.ts` dev server + docs)**
- CSP (relatório-only inicial), Referrer-Policy `strict-origin-when-cross-origin`, Permissions-Policy restritiva, X-Content-Type-Options `nosniff`, X-Frame-Options `DENY`. HSTS documentado (aplicado pelo Cloudflare no domínio).

## Auditoria final
- Rodar Lighthouse via Playwright headless em mobile emulation contra `http://localhost:8080`.
- Reportar: LCP, CLS, INP, FCP, TBT, Performance/SEO/A11y/BP scores, itens corrigidos vs pendentes.
- Regressão: submit dos 2 formulários com fetch mockado, redirect WhatsApp preservado, UTMs no payload, máscaras, FAQ, navegação.

## Regras técnicas
- Sem alterar layout/marca/número WhatsApp.
- Sem IDs fictícios: GA4/Ads ativam somente se env vars presentes.
- Meta Pixel continua gated para `lp.arteflan.com` + agora também gated por consent.
- Cada sprint em um turno separado; ao final de cada, faço build check.

## Ordem de execução
1. Sprint 1 (conversão) — impacto imediato em CPL
2. Sprint 2 (performance) — LCP e bundle
3. Sprint 3 (tracking) — habilita mensuração
4. Sprint 4 (SEO/A11y/segurança) — quality score
5. Auditoria Lighthouse + relatório

Confirma para eu iniciar pela Sprint 1?