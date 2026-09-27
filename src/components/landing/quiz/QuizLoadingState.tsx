import { motion } from "framer-motion";
import { CoffeeLottie } from "@/components/ui/coffee-lottie";

/** Animated overlay while the lead submission is in flight. */
export function QuizLoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-20 flex items-center justify-center rounded-[inherit] bg-card/92 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
        className="mx-4 flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border border-brand-brown/12 bg-background px-6 py-7 shadow-soft"
      >
        <CoffeeLottie size={100} speed={0.6} />
        <p className="font-display text-lg text-foreground">Enviando sua solicitação…</p>
        <p className="font-sans text-sm text-muted-foreground">
          Estamos preparando seu atendimento comercial.
        </p>
      </motion.div>
    </motion.div>
  );
}
