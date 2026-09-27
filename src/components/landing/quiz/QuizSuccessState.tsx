import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoffeeLottie } from "@/components/ui/coffee-lottie";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const SPLASH_DURATION = 1800;

type Props = { waUrl: string };

export function QuizSuccessState({ waUrl }: Props) {
  const reduced = usePrefersReducedMotion();
  const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowRedirect(true), SPLASH_DURATION);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-[280px]">
      <AnimatePresence mode="wait">
        {!showRedirect ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 py-8"
          >
            {!reduced && (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <CoffeeLottie size={140} speed={0.55} />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check className="h-5 w-5" />
              </span>
              <h3 className="font-display text-xl text-foreground md:text-2xl">
                Cotação recebida!
              </h3>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="redirect"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center gap-4 py-8 text-center"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check className="h-6 w-6" />
            </span>
            <h3 className="font-display text-xl leading-snug text-foreground md:text-2xl">
              Cotação recebida!
            </h3>
            <p className="max-w-sm font-sans text-sm text-muted-foreground">
              Estamos direcionando você para o atendimento da Arteflan.
            </p>
            <Button asChild size="lg" className="mt-1 min-h-12 rounded-full">
              <a href={waUrl}>
                <MessageCircle className="mr-2 h-5 w-5" aria-hidden="true" />
                Continuar para o WhatsApp
              </a>
            </Button>
            <p className="font-sans text-xs text-muted-foreground">
              Redirecionando automaticamente…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
