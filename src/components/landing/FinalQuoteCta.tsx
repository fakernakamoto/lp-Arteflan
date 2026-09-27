import { Check, MessageCircle } from "lucide-react";
import { QuoteForm } from "@/components/quote/QuoteForm";

export function FinalQuoteCta() {
  return (
    <section
      id="cotacao"
      aria-labelledby="cotacao-titulo"
      tabIndex={-1}
      className="section-y bg-muted/50"
    >
      <div className="container-page grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="type-label text-primary">Direto da fábrica para o seu negócio</span>
          <h2 id="cotacao-titulo" className="type-h2 mt-4 text-balance">
            Receba a Tabela de Preços de Atacado
          </h2>
          <p className="type-body mt-5 text-muted-foreground">
            Conte para quem é a cotação. Nosso time comercial ajuda a escolher os coadores e as
            condições para a sua operação.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Sete tamanhos de coadores de tecido 100% algodão",
              "Atendimento para supermercados, cafeterias e distribuidores",
              "Pedido mínimo de R$ 500; condições de atacado a partir de R$ 2.000",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#128C4A]" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-7 flex items-center gap-2 text-sm font-medium">
            <MessageCircle className="h-5 w-5 text-[#128C4A]" aria-hidden="true" />
            Converse diretamente com a Arteflan
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card sm:p-8">
          <QuoteForm source="landing_quote" />
        </div>
      </div>
    </section>
  );
}
