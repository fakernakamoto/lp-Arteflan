import { cn } from "@/lib/utils";

type QuizProgressProps = {
  step: number;
  total: number;
  className?: string;
};

export function QuizProgress({ step, total, className }: QuizProgressProps) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          Etapa {step} de {total}
        </p>
        <p className="font-sans text-xs text-muted-foreground">
          {pct}% · Leva menos de 1 minuto
        </p>
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Progresso do quiz: etapa ${step} de ${total}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-brand-brown/12"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
