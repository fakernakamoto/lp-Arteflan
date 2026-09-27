import { motion } from "framer-motion";
import { Droplets, Recycle, Scissors, Sparkles, type LucideIcon } from "lucide-react";
import { fadeUp, imageReveal, inView, staggerContainer, staggerItem } from "@/lib/motion";
import { SectionHeading } from "./SectionHeading";
import fabricImg from "@/assets/coadores-credibilidade.png";

type Item = { icon: LucideIcon; title: string; desc: string };

const items: Item[] = [
  {
    icon: Scissors,
    title: "Tecido 100% algodão",
    desc: "Gramatura estruturada e costura reforçada, adequadas ao uso diário intenso.",
  },
  {
    icon: Droplets,
    title: "Extração limpa",
    desc: "O tecido retém o pó do café e mantém a bebida sem resíduos na xícara.",
  },
  {
    icon: Sparkles,
    title: "Sabor preservado",
    desc: "Sem materiais que interfiram no aroma e no corpo do café.",
  },
  {
    icon: Recycle,
    title: "Reutilizável",
    desc: "Uso repetido com a devida higienização, reduzindo descarte na operação.",
  },
];

export function Differentials() {
  return (
    <section className="section-y bg-muted/50">
      <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <motion.div
          variants={imageReveal}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="relative order-last lg:order-first"
        >
          <div className="glass-card overflow-hidden rounded-[1.5rem] p-3">
            <img
              src={fabricImg}
              alt="Coadores Arteflan em tecido de algodão, com costura reforçada"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full rounded-[1.15rem] object-cover"
            />
          </div>
        </motion.div>

        <div>
          <SectionHeading
            eyebrow="Diferenciais do produto"
            title="O tecido define o resultado na xícara"
            description="A matéria-prima e o acabamento são o que sustentam o padrão da linha Arteflan."
            align="left"
          />

          <motion.dl
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2"
          >
            {items.map(({ icon: Icon, title, desc }) => (
              <motion.div key={title} variants={staggerItem} className="min-w-0">
                <dt className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                  <Icon className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  {title}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            aria-hidden="true"
            className="mt-8 h-px origin-left bg-brand-brown/15"
          />
        </div>
      </div>
    </section>
  );
}
