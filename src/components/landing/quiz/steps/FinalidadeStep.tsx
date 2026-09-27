import { QuizOption } from "../QuizOption";
import { QuizStepShell } from "./QuizStepShell";
import { FINALIDADE_OPTIONS, type FinalidadeCompra, type QuizAnswers } from "@/types/quizLead";

type Props = {
  answers: QuizAnswers;
  onSelect: (value: FinalidadeCompra) => void;
};

export function FinalidadeStep({ answers, onSelect }: Props) {
  return (
    <QuizStepShell
      question="Qual é o objetivo da sua compra?"
      helper="Isso nos ajuda a orientar melhor a proposta comercial."
    >
      <div role="radiogroup" aria-label="Finalidade da compra" className="grid gap-2.5 sm:grid-cols-2">
        {FINALIDADE_OPTIONS.map((o) => (
          <QuizOption
            key={o.value}
            id={`finalidade-${o.value}`}
            label={o.label}
            selected={answers.finalidade_compra === o.value}
            onSelect={() => onSelect(o.value)}
          />
        ))}
      </div>
    </QuizStepShell>
  );
}
