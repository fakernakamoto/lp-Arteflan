import { QuizOption } from "../QuizOption";
import { QuizStepShell } from "./QuizStepShell";
import { PRAZO_OPTIONS, type PrazoCompra, type QuizAnswers } from "@/types/quizLead";

type Props = {
  answers: QuizAnswers;
  onSelect: (value: PrazoCompra) => void;
};

export function PrazoStep({ answers, onSelect }: Props) {
  return (
    <QuizStepShell question="Quando pretende realizar o pedido?">
      <div role="radiogroup" aria-label="Prazo de compra" className="grid gap-2.5 sm:grid-cols-2">
        {PRAZO_OPTIONS.map((o) => (
          <QuizOption
            key={o.value}
            id={`prazo-${o.value}`}
            label={o.label}
            selected={answers.prazo_compra === o.value}
            onSelect={() => onSelect(o.value)}
          />
        ))}
      </div>
    </QuizStepShell>
  );
}
