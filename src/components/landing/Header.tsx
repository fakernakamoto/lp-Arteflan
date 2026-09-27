import { useEffect, useRef, useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import { assetUrl } from "@/lib/asset-url";
import { QuoteLink } from "@/components/navigation/QuoteLink";
import { suppressQuoteOffer } from "@/lib/quote-offer";
import { gaEvent } from "@/lib/analytics";
import logo from "@/assets/arteflan-logo-v2.png.asset.json";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Processo", href: "#processo" },
  { label: "Sobre", href: "#sobre" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full transition-[background-color,box-shadow,border-color,color] duration-300 ${
        scrolled
          ? "glass-nav border-b border-brand-brown/15 text-foreground shadow-soft"
          : "border-b border-white/10 bg-brand-dark/40 text-white backdrop-blur-[10px]"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-2 md:h-[84px]">
        <a
          href="#inicio"
          className="flex h-11 w-[76px] min-w-0 shrink-0 items-center overflow-hidden rounded-md sm:w-[100px] md:h-14 md:w-[125px]"
          aria-label="Arteflan — início"
        >
          <img
            src={assetUrl(logo)}
            alt="Arteflan — desde 1990"
            className={`h-full w-full scale-[1.6] object-contain ${scrolled ? "" : "brightness-0 invert"}`}
            decoding="async"
          />
        </a>

        <nav aria-label="Navegação principal" className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                scrolled
                  ? "text-foreground/80 hover:text-primary"
                  : "text-white/85 hover:text-brand-gold"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          id="cotacao-link-header"
          href="#cotacao"
          className="whatsapp-cta ml-auto inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold sm:px-4 sm:text-sm lg:ml-0 lg:order-last"
          onClick={() => {
            suppressQuoteOffer();
            setOpen(false);
            gaEvent("click_cta", { source: "header_whatsapp", destination: "#cotacao" });
          }}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Falar no WhatsApp
        </a>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="menu-mobile"
          className={`order-[-1] inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border lg:hidden ${
            scrolled ? "border-brand-brown/15 text-foreground" : "border-white/25 text-white"
          }`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div id="menu-mobile" className="border-t border-brand-brown/15 bg-background lg:hidden">
          <nav aria-label="Navegação móvel" className="container-page flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-foreground/85 hover:bg-muted hover:text-primary"
              >
                {item.label}
              </a>
            ))}
            <QuoteLink
              source="header_mobile_orcamento"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-60"
            >
              Solicitar cotação
            </QuoteLink>
          </nav>
        </div>
      )}
    </header>
  );
}
