import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuizNavigationProps = {
  canGoBack: boolean;
  isLast: boolean;
  submitting: boolean;
  showContinue: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function QuizNavigation({
  canGoBack,
  isLast,
  submitting,
  showContinue,
  onBack,
  onNext,
}: QuizNavigationProps) {
  return (
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
      {canGoBack ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={submitting}
          className="min-h-11 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" aria-hidden="true" />
          Voltar
        </Button>
      ) : (
        <span />
      )}

      {showContinue && (
        <Button
          type="button"
          onClick={onNext}
          disabled={submitting}
          aria-disabled={submitting}
          className="ml-auto min-h-11 min-w-[11rem]"
        >
          {/* No animation inside the card: the full-screen transition covers it. */}
          {submitting ? (
            "Enviando…"
          ) : isLast ? (
            <>
              Receber cotação
              <Send className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
