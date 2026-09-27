import { motion } from "framer-motion";
import { inView, staggerContainer, staggerItem } from "@/lib/motion";
import { processSteps } from "@/data/landing";
import { SectionHeading } from "./SectionHeading";
import { DoodleFollowScroll } from "@/components/ui/doodle-follow-scroll";

export function Process() {
  return (
    <section id="processo" className="section-y relative overflow-hidden bg-background">
      {/* 21st.dev "stroke that follows the scroll progress" */}
      <DoodleFollowScroll
        className="hidden lg:block -right-[10%] left-auto top-0 w-[150%] md:w-[110%]"
        stroke="hsl(var(--primary) / 0.55)"
        strokeWidth={26}
      />

      <div className="container-page relative">
        <SectionHeading
          eyebrow="Como funciona"
          title="Cinco etapas entre o primeiro contato e o recebimento"
          description="Um processo comercial direto, sem intermediários entre a sua operação e a fábrica."
          align="left"
        />

        <div className="relative mt-12 md:mt-16">
          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="relative space-y-4 md:space-y-5"
          >
            {processSteps.map((step, i) => (
              <motion.li
                key={step.n}
                variants={staggerItem}
                className={`glass-card grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-xl p-4 sm:gap-4 sm:p-5 transition-transform duration-[260ms] hover:-translate-y-0.5 md:gap-6 md:p-6 lg:w-[calc(50%-3rem)] ${
                  i % 2 === 1 ? "lg:ml-auto" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="font-display text-2xl font-semibold text-primary md:text-3xl"
                >
                  {step.n}
                </span>
                <div className="min-w-0">
                  <span className="type-label text-muted-foreground">{step.label}</span>
                  <h3 className="type-h3 mt-1.5 text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
