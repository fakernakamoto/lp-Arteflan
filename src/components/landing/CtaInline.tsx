import { MessageCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { QuoteLink } from "@/components/navigation/QuoteLink";
import { fadeUp, inView } from "@/lib/motion";

type Variant = "primary" | "muted";

export function CtaInline({
  title,
  subtitle,
  ctaLabel = "Solicitar cotação",
  source,
  variant = "muted",
}: {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  source: string;
  variant?: Variant;
}) {
  const isPrimary = variant === "primary";
  return (
    <section
      className={
        isPrimary
          ? "section-y-tight bg-brand-hero text-white"
          : "section-y-tight border-y border-brand-brown/12 bg-background"
      }
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={inView}
        className="container-page flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between"
      >
        <div className="min-w-0">
          <h2 className={`type-h3 ${isPrimary ? "text-white" : "text-foreground"}`}>{title}</h2>
          {subtitle && (
            <p
              className={`mt-1.5 text-sm md:text-base ${
                isPrimary ? "text-white/80" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
        <QuoteLink
          source={source}
          className={`group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ${
            isPrimary
              ? "bg-brand-gold text-brand-dark hover:bg-brand-gold/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {ctaLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </QuoteLink>
      </motion.div>
    </section>
  );
}
