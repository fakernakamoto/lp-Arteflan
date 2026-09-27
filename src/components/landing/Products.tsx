import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { QuoteLink } from "@/components/navigation/QuoteLink";
import { inView, staggerContainer, staggerItem } from "@/lib/motion";
import { productLines } from "@/data/landing";
import { SectionHeading } from "./SectionHeading";
import { ProductTag } from "./ProductTag";

export function Products() {
  return (
    <section id="produtos" className="section-y bg-background">
      <div className="container-page">
        <SectionHeading
          eyebrow="Produtos e tamanhos"
          title="Três linhas, sete tamanhos, um só fornecedor"
          description="Do preparo individual ao alto volume, a linha Arteflan cobre toda a operação com o mesmo padrão de tecido e costura."
          align="left"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
        >
          {productLines.map((line) => (
            <motion.article
              key={line.id}
              variants={staggerItem}
              className="glass-card group flex h-full flex-col overflow-hidden rounded-xl border border-brand-brown/12 shadow-soft transition-all duration-[260ms] hover:-translate-y-1 hover:shadow-card"
            >
              {/* Only this line's own models — never the whole catalogue. */}
              <div className="relative flex min-h-[228px] w-full items-center bg-muted p-4">
                <ul className="grid w-full grid-cols-2 gap-2 pt-7">
                  {line.models.map((model) => (
                    <li
                      key={model.name}
                      className="rounded-lg border border-brand-brown/8 bg-background/70 p-2"
                    >
                      <img
                        src={model.image}
                        alt={`Coador de café ${model.name} Arteflan em tecido 100% algodão — ${line.category.toLowerCase()}`}
                        width={160}
                        height={96}
                        loading="lazy"
                        decoding="async"
                        className="h-16 w-full object-contain transition-transform duration-[400ms] group-hover:scale-[1.04]"
                      />
                      <span className="mt-1 block text-center text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                        {model.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <span className="glass-pill absolute left-3 top-3 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-brand-brown">
                  {line.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5 md:p-6">
                <h3 className="type-h3 text-foreground">{line.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{line.desc}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {line.tags.slice(0, 3).map((t) => (
                    <ProductTag key={t}>{t}</ProductTag>
                  ))}
                </div>

                <div className="mt-5 flex-1" />
                <QuoteLink
                  source={`produtos_${line.id}`}
                  className="group/cta -ml-3 inline-flex min-h-11 w-fit items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Ver condições desta linha
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
                </QuoteLink>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
