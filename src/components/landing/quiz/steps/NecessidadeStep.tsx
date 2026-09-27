import { QuizOption } from "../QuizOption";
import { QuizStepShell } from "./QuizStepShell";
import {
  FAIXA_OPTIONS,
  PRODUTO_OPTIONS,
  type FaixaPedido,
  type ProdutoInteresse,
  type QuizAnswers,
} from "@/types/quizLead";

type Props = {
  answers: QuizAnswers;
  patch: (p: Partial<QuizAnswers>) => void;
};

export function NecessidadeStep({ answers, patch }: Props) {
  return (
    <QuizStepShell question="O que você procura?">
      {/* Produto */}
      <div role="radiogroup" aria-label="Produto de interesse" className="grid gap-2 sm:grid-cols-2">
        {PRODUTO_OPTIONS.map((o) => (
          <QuizOption
            key={o.value}
            id={`produto-${o.value}`}
            label={o.label}
            selected={answers.produto_interesse === o.value}
            onSelect={() => patch({ produto_interesse: o.value as ProdutoInteresse })}
          />
        ))}
      </div>

      {/* Faixa de pedido — aparece após selecionar produto */}
      {answers.produto_interesse && (
        <div className="mt-6 border-t border-brand-brown/10 pt-5">
          <p className="mb-3 font-sans text-sm font-medium text-foreground">
            Estimativa do primeiro pedido
          </p>
          <div role="radiogroup" aria-label="Estimativa do primeiro pedido" className="grid gap-2 sm:grid-cols-2">
            {FAIXA_OPTIONS.map((o) => (
              <QuizOption
                key={o.value}
                id={`faixa-${o.value}`}
                label={o.label}
                selected={answers.pedido_estimado_faixa === o.value}
                onSelect={() => patch({ pedido_estimado_faixa: o.value as FaixaPedido })}
              />
            ))}
          </div>
        </div>
      )}
    </QuizStepShell>
  );
}
