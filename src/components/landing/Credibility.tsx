import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { assetUrl } from "@/lib/asset-url";
import destaqueImg from "@/assets/destaque-arteflan-v2.png.asset.json";
import { SectionEyebrow } from "./SectionEyebrow";

const points = [
  "Estrutura reforçada ideal para uso diário intenso",
  "Produto sustentável e 100% reciclável",
  "Entrega garantida em todo o território nacional",
  "Atendimento e pós-venda personalizados",
];

const stats = [
  { value: "+30", label: "Anos de mercado" },
  { value: "7", label: "Tamanhos disponíveis" },
  { value: "100%", label: "Fabricação nacional" },
];

export function Credibility() {
  return (
    <section id="sobre" className="section-y bg-background">
      <div className="container-page grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <SectionEyebrow>Sobre a Arteflan</SectionEyebrow>
          <h2 className="type-h2 mt-4 text-balance text-foreground">
            Mais de 30 anos fabricando coadores de tecido no Brasil
          </h2>
          <p className="type-body mt-4 text-muted-foreground">
            Operação industrial própria, com controle de matéria-prima, acabamento e expedição — do
            tecido ao pedido entregue.
          </p>

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-foreground">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/20 via-brand-gold/15 to-transparent blur-2xl" />
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] border border-brand-gold/40 bg-card p-4 shadow-elegant md:p-6">
            <img
              src={assetUrl(destaqueImg)}
              alt="Linha de coadores de café Arteflan em tecido de algodão, com fabricação própria para atacado"
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="glass-card rounded-2xl border border-brand-gold/30 px-3 py-4 text-center shadow-sm"
              >
                <p className="text-2xl font-extrabold text-primary md:text-3xl">{s.value}</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
