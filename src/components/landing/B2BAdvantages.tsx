import { motion } from "framer-motion";
import { Wallet, Tags, Truck, MapPin, type LucideIcon } from "lucide-react";
import { inView, staggerContainer, staggerItem } from "@/lib/motion";
import { SectionHeading } from "./SectionHeading";

type Benefit = { icon: LucideIcon; title: string; desc: string };

const benefits: Benefit[] = [
  {
    icon: Wallet,
    title: "Pedido mínimo acessível",
    desc: "A partir de R$ 500,00.",
  },
  {
    icon: Tags,
    title: "Condição de atacado",
    desc: "Valores diferenciados para pedidos a partir de R$ 2.000,00.",
  },
  {
    icon: Truck,
    title: "Frete CIF para MS",
    desc: "Para pedidos a partir de R$ 700,00.",
  },
  {
    icon: MapPin,
    title: "Frete CIF para SP capital",
    desc: "Para pedidos a partir de R$ 3.000,00.",
  },
];

export function B2BAdvantages() {
  return (
    <section className="section-y bg-background">
      <div className="container-page">
        <SectionHeading
          eyebrow="Condições comerciais"
          title="Condições claras para começar a revender"
          align="left"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {benefits.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={staggerItem}
              className="glass-card rounded-xl border border-brand-brown/12 p-5 shadow-soft transition-all duration-[260ms] hover:-translate-y-1 hover:shadow-card md:p-6"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-hero text-brand-gold">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-base font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
