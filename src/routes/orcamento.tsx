import { createFileRoute, Link, ClientOnly } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, ShieldCheck, Factory } from "lucide-react";
import { assetUrl } from "@/lib/asset-url";
import logo from "@/assets/arteflan-logo-v2.png.asset.json";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { gaEvent } from "@/lib/analytics";
import { getEntrySource } from "@/lib/quote-attribution";

const TITLE = "Solicitar cotação | Arteflan";
const DESCRIPTION =
  "Solicite a tabela de atacado da Arteflan pelo WhatsApp. Informe seu nome, telefone, empresa e segmento.";

export const Route = createFileRoute("/orcamento")({
  component: OrcamentoPage,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
});

const trustSignals = [
  { icon: Clock, text: "Menos de 1 minuto" },
  { icon: ShieldCheck, text: "Dados protegidos" },
  { icon: Factory, text: "Fabricação própria" },
];

function OrcamentoPage() {
  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Carregando…</p>
        </div>
      }
    >
      <OrcamentoClient />
    </ClientOnly>
  );
}

function OrcamentoClient() {
  const [logoSrc, setLogoSrc] = useState(() => assetUrl(logo));

  useEffect(() => {
    const source = getEntrySource();
    gaEvent("quote_page_view", {
      page_location: window.location.href,
      entry_source: source || undefined,
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      document.getElementById("orcamento-titulo")?.focus({ preventScroll: true });
    }, 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      {/* Simplified header */}
      <header className="sticky top-0 z-40 border-b border-brand-brown/10 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:h-16 md:px-6">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar ao site</span>
          </Link>

          <Link to="/" aria-label="Arteflan — página inicial">
            <img
              src={logoSrc}
              alt="Arteflan"
              className="h-8 w-auto object-contain md:h-10"
              decoding="async"
              onError={() => setLogoSrc("/favicon.png")}
            />
          </Link>

          <a
            href="#cotacao"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Solicitar cotação
          </a>
        </div>
      </header>

      <main
        id="conteudo"
        className="flex flex-1 flex-col items-center px-4 pb-12 pt-6 md:px-6 md:pt-10"
      >
        {/* Compact page heading */}
        <div className="w-full max-w-[820px] text-center">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Cotação personalizada
          </span>
          <h1
            id="orcamento-titulo"
            tabIndex={-1}
            className="mt-2 font-display text-xl leading-snug text-foreground outline-none md:text-2xl lg:text-3xl"
          >
            Encontre a melhor linha de produtos para sua operação
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Preencha seus dados e continue no WhatsApp para receber a tabela de preços e as
            condições para sua empresa.
          </p>
        </div>

        {/* Trust signals */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:mt-5">
          {trustSignals.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
            >
              <Icon className="h-3.5 w-3.5 text-primary/70" aria-hidden="true" />
              {text}
            </span>
          ))}
        </div>

        {/* Quote form */}
        <div
          id="cotacao"
          tabIndex={-1}
          className="mt-6 w-full max-w-lg rounded-2xl border border-border bg-card p-5 shadow-card md:mt-8 sm:p-8"
        >
          <QuoteForm source="quote_page" />
        </div>
      </main>
    </div>
  );
}
