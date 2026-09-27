import { motion } from "framer-motion";
import { Building2, Coffee, ShoppingCart, Truck, type LucideIcon } from "lucide-react";
import { inView, staggerContainer, staggerItem } from "@/lib/motion";
import { audiences } from "@/data/landing";
import { SectionHeading } from "./SectionHeading";

const icons: Record<string, LucideIcon> = {
  revenda: Truck,
  supermercados: ShoppingCart,
  cafeterias: Coffee,
  hotelaria: Building2,
};

export function UseCases() {
  return (
    <section id="publicos" className="section-y bg-gradient-hero relative overflow-hidden text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at top right, hsl(38 85% 50% / 0.22), transparent 58%), radial-gradient(ellipse at bottom left, hsl(17 85% 46% / 0.22), transparent 55%)",
        }}
      />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Públicos e aplicações"
          title="Fornecimento pensado para cada tipo de operação"
          description="Necessidade, solução e benefício operacional — sem promessas absolutas."
          tone="dark"
          align="left"
        />

        <motion.dl
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2"
        >
          {audiences.map((a) => {
            const Icon = icons[a.id] ?? Coffee;
            return (
              <motion.div
                key={a.id}
                variants={staggerItem}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-4 border-t border-white/12 pt-6"
              >
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="type-h3 text-white">{a.eyebrow}</dt>
                  <dd className="mt-3 space-y-2 text-sm leading-relaxed text-white/80">
                    <p>
                      <span className="type-label mr-2 text-brand-gold">Necessidade</span>
                      {a.need}
                    </p>
                    <p>
                      <span className="type-label mr-2 text-brand-gold">Solução</span>
                      {a.solution}
                    </p>
                    <p>
                      <span className="type-label mr-2 text-brand-gold">Benefício</span>
                      {a.benefit}
                    </p>
                  </dd>
                </div>
              </motion.div>
            );
          })}
        </motion.dl>
      </div>
    </section>
  );
}
