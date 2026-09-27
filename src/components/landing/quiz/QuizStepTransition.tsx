import { motion } from "framer-motion";
import { CoffeeLottie } from "@/components/ui/coffee-lottie";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Props = { visible: boolean };

/** Brief animation between auto-advance quiz steps. */
export function QuizStepTransition({ visible }: Props) {
  const reduced = usePrefersReducedMotion();
  if (!visible || reduced) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center justify-center py-4"
    >
      <CoffeeLottie size={72} loop={false} speed={0.7} />
    </motion.div>
  );
}
