import { Building2, ShoppingCart, Coffee, UtensilsCrossed, BedDouble, Store, Boxes, Rocket, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizStepShell } from "./QuizStepShell";
import { PERFIL_ENTRADA_OPTIONS, type QuizAnswers } from "@/types/quizLead";

type Props = {
  answers: QuizAnswers;
  onSelect: (value: string) => void;
};

const ICONS: Record<string, React.ElementType> = {
  distribuidora: Boxes,
  supermercado: ShoppingCart,
  loja_revenda: Store,
  cafeteria: Coffee,
  restaurante: UtensilsCrossed,
  hotel: BedDouble,
  outra_empresa: Building2,
  estruturando: Rocket,
  uso_proprio: User,
};

export function PerfilStep({ answers, onSelect }: Props) {
  return (
    <QuizStepShell
      question="Qual é o perfil da sua operação?"
      helper="Selecione a opção que melhor descreve seu negócio."
    >
      <div role="radiogroup" aria-label="Perfil da operação" className="grid gap-2 sm:grid-cols-2">
        {PERFIL_ENTRADA_OPTIONS.map((o) => {
          const Icon = ICONS[o.value] ?? Building2;
          const selected = answers.perfil_entrada === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(o.value)}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "min-h-[52px]",
                selected
                  ? "border-primary bg-primary/8 shadow-soft"
                  : "border-brand-brown/15 bg-card hover:border-primary/40 hover:bg-muted",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  selected ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-sans text-sm font-medium leading-snug text-foreground">
                  {o.label}
                </span>
                {o.hint && (
                  <span className="block font-sans text-xs text-muted-foreground">{o.hint}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </QuizStepShell>
  );
}
