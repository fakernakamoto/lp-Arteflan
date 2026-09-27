import { motion } from "framer-motion";
import { Award, Factory, Layers, Scissors, Truck } from "lucide-react";
import { fadeUp, inView } from "@/lib/motion";
import { ProofPill } from "./ProofPill";

const proofs = [
  { icon: Award, label: "Desde 1990" },
  { icon: Factory, label: "Fabricação própria" },
  { icon: Scissors, label: "Tecido 100% algodão" },
  { icon: Layers, label: "7 tamanhos" },
  { icon: Truck, label: "Fornecimento nacional" },
];

/** Compact authority band right under the hero. */
export function AuthorityStrip() {
  return (
    <section aria-label="Provas de autoridade" className="border-y border-brand-brown/12 bg-muted/60">
      <motion.ul
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="container-page flex flex-wrap items-center justify-center gap-2 py-5 md:gap-3 md:py-6"
      >
        {proofs.map(({ icon, label }) => (
          <ProofPill key={label} icon={icon}>
            {label}
          </ProofPill>
        ))}
      </motion.ul>
    </section>
  );
}
