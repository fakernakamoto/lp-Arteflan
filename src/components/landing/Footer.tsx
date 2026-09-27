import { Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/arteflan-logo-footer.png";

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Produtos", href: "#produtos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Solicitar cotação", href: "#cotacao" },
];

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-3">
          <div>
            <img
              src={logo}
              alt="Arteflan — fábrica de coadores de tecido desde 1990"
              loading="lazy"
              decoding="async"
              className="mb-4 h-24 w-auto object-contain md:h-28"
            />
            <p className="max-w-xs text-sm text-white/60">
              A marca de qualidade superior nº 1 na fabricação de coadores de café em tecido premium
              com qualidade 100% nacional.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Navegação</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-white/70 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Contato</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-brand-gold" />
                <a href="tel:+5567992348962" className="hover:text-primary">
                  (67) 99234-8962
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-brand-gold" />
                <a href="mailto:comercial@arteflan.com.br" className="hover:text-primary">
                  comercial@arteflan.com.br
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-gold" />
                <span>
                  Rua Monte Negro, 293 — Comércio
                  <br />
                  Campo Grande / MS
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © Copyright Arteflan · CNPJ 04.814.488/0001-41 · Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
