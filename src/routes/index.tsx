import heroPoster from "@/assets/hero-coador-poster.jpg";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { AuthorityStrip } from "@/components/landing/AuthorityStrip";
import { UseCases } from "@/components/landing/UseCases";
import { Products } from "@/components/landing/Products";
import { ProductShowcase } from "@/components/landing/ProductShowcase";
import { Differentials } from "@/components/landing/Differentials";
import { Process } from "@/components/landing/Process";
import { B2BAdvantages } from "@/components/landing/B2BAdvantages";
import { Credibility } from "@/components/landing/Credibility";
import { Clients } from "@/components/landing/Clients";
import { Faq } from "@/components/landing/Faq";
import { FinalQuoteCta } from "@/components/landing/FinalQuoteCta";
import { Footer } from "@/components/landing/Footer";
import { WhatsAppFab } from "@/components/landing/WhatsAppFab";
import { WholesaleOffer } from "@/components/quote/WholesaleOffer";
import { CtaInline } from "@/components/landing/CtaInline";

const CANONICAL = "https://lp-arteflan.vercel.app/";
const TITLE = "Coadores de Tecido no Atacado Direto da Fábrica | Arteflan";
const DESCRIPTION =
  "Coadores de tecido 100% algodão direto da fábrica. 7 tamanhos para supermercados, distribuidores e cafeterias. Solicite a tabela de atacado pelo WhatsApp.";

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Quais os diferenciais dos coadores Arteflan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tecido premium 100% algodão de gramatura estruturada, costura reforçada, 7 tamanhos e fornecimento direto da indústria.",
      },
    },
    {
      "@type": "Question",
      name: "Qual o pedido mínimo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A partir de R$ 500,00. Condições especiais de atacado a partir de R$ 2.000,00.",
      },
    },
    {
      "@type": "Question",
      name: "Vocês entregam em todo o Brasil?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sim. Frete CIF para MS a partir de R$ 700,00 e SP Capital a partir de R$ 3.000,00. Demais regiões consultar.",
      },
    },
    {
      "@type": "Question",
      name: "Quais tamanhos estão disponíveis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sete tamanhos: Mini, Pequeno, Bar, Especial, Médio, Grande e GG.",
      },
    },
    {
      "@type": "Question",
      name: "Atendem pessoa física?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Foco em B2B (distribuição/revenda), mas atendemos demandas específicas a partir do pedido mínimo.",
      },
    },
    {
      "@type": "Question",
      name: "O coador altera o sabor do café?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Não. O tecido 100% algodão Arteflan não passa pó e preserva o sabor autêntico do café.",
      },
    },
  ],
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Arteflan",
  url: CANONICAL,
  logo: `${CANONICAL}favicon.png`,
  sameAs: [],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+55-67-99234-8962",
      contactType: "sales",
      areaServed: "BR",
      availableLanguage: ["pt-BR"],
    },
  ],
};

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: CANONICAL,
  name: "Arteflan",
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: CANONICAL },
      { property: "og:site_name", content: "Arteflan" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:image", content: `${CANONICAL}og-arteflan.png` },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "965" },
      { property: "og:image:height", content: "541" },
      {
        property: "og:image:alt",
        content: "Linha de coadores de café em tecido Arteflan para atacado",
      },
      { name: "twitter:image", content: `${CANONICAL}og-arteflan.png` },
      { name: "twitter:image:alt", content: "Coadores de tecido Arteflan direto da fábrica" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [
      { rel: "canonical", href: CANONICAL },
      { rel: "preload", as: "image", href: heroPoster, fetchPriority: "high" },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(orgLd) },
      { type: "application/ld+json", children: JSON.stringify(websiteLd) },
      { type: "application/ld+json", children: JSON.stringify(faqLd) },
    ],
  }),
});

function Index() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main id="conteudo" className="flex-1">
        <Hero />
        <AuthorityStrip />
        <Products />
        <ProductShowcase />
        <UseCases />
        <Differentials />
        <CtaInline
          title="Quer a tabela de distribuição completa?"
          subtitle="Enviamos tamanhos, condições e prazos pelo WhatsApp."
          source="cta_inline_after_differentials"
        />
        <Process />
        <B2BAdvantages />
        <Clients />
        <Credibility />
        <CtaInline
          title="Pronto para montar seu primeiro pedido?"
          subtitle="Fale com o time comercial e receba as condições da sua região."
          source="cta_inline_before_faq"
          variant="primary"
        />
        <Faq />
        <FinalQuoteCta />
      </main>
      <Footer />
      <WhatsAppFab />
      <WholesaleOffer />
    </div>
  );
}
