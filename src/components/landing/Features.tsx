import { motion } from "framer-motion";
import {
  ShieldCheck,
  Leaf,
  Coffee,
  Award,
  Filter,
  Ruler,
  type LucideIcon,
} from "lucide-react";

type Feature = { icon: LucideIcon; title: string; desc: string };

const features: Feature[] = [
  {
    icon: Award,
    title: "Qualidade Superior",
    desc: "Posicionamento premium com fabricação nacional de alto valor percebido.",
  },
  {
    icon: Filter,
    title: "Gramatura Superior",
    desc: "O tecido não passa pó, garantindo uma filtração perfeita.",
  },
  {
    icon: ShieldCheck,
    title: "Estrutura Reforçada",
    desc: "Durabilidade superior que resiste ao alto volume de passagens diárias.",
  },
  {
    icon: Coffee,
    title: "Sabor Intacto",
    desc: "Malha de qualidade superior que não altera o sabor do café.",
  },
  {
    icon: Leaf,
    title: "Produto Sustentável",
    desc: "Coadores 100% recicláveis.",
  },
  {
    icon: Ruler,
    title: "7 Opções de Tamanho",
    desc: "Atendimento para linha individual, residencial e profissional.",
  },
];

export function Features() {
  return (
    <section id="sobre" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Por que Arteflan
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Qualidade superior, fabricação 100% nacional
          </h2>
          <p className="mt-4 text-muted-foreground">
            Mais de três décadas produzindo coadores em tecido premium que
            entregam performance e alto valor percebido para o seu negócio.
          </p>
        </motion.div>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {features.map(({ icon: Icon, title }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.08 }}
              className="group inline-flex items-center gap-3 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-5 py-3 transition-all hover:-translate-y-0.5 hover:border-brand-gold/60 hover:shadow-elegant"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold leading-tight text-foreground">
                {title}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}