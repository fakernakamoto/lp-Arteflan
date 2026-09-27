import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Loader2, MapPin, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuizOption } from "../QuizOption";
import { QuizStepShell, FieldError } from "./QuizStepShell";
import { CEP_ERROR_MESSAGES, lookupCEP, type CepErrorCode } from "@/lib/quiz/addressService";
import { maskCEP, onlyDigits } from "@/lib/quiz/documents";
import type { QuizAnswers } from "@/types/quizLead";

type Props = {
  answers: QuizAnswers;
  patch: (p: Partial<QuizAnswers>) => void;
  onConfirmRegiao: () => void;
};

export function LocalizacaoStep({ answers, patch, onConfirmRegiao }: Props) {
  const empresa = answers.empresa;
  const temRegiaoDaEmpresa = Boolean(empresa?.municipio_empresa && empresa?.uf_empresa);

  // PJ com endereço vindo do CNPJ: só confirma, sem digitar nada.
  if (temRegiaoDaEmpresa && answers.entrega_mesma_regiao !== false) {
    return (
      <QuizStepShell question="A entrega será nessa região?">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Localização identificada
          </p>
          <p className="mt-2 flex items-center gap-2 font-display text-lg text-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            {empresa?.municipio_empresa} — {empresa?.uf_empresa}
          </p>
        </div>

        <div role="radiogroup" aria-label="Confirmação da região de entrega" className="mt-4 grid gap-2.5 sm:grid-cols-2">
          <QuizOption
            id="entrega-sim"
            label="Sim, entrega nessa região"
            selected={answers.entrega_mesma_regiao === true}
            onSelect={() => {
              patch({
                entrega_mesma_regiao: true,
                endereco: {
                  cep_entrega: empresa?.cep_empresa ?? "",
                  cidade_entrega: empresa?.municipio_empresa ?? "",
                  uf_entrega: empresa?.uf_empresa ?? "",
                  codigo_ibge: "",
                },
              });
              onConfirmRegiao();
            }}
          />
          <QuizOption
            id="entrega-nao"
            label="Não, é em outra cidade"
            selected={false}
            onSelect={() => patch({ entrega_mesma_regiao: false, endereco: null })}
          />
        </div>
      </QuizStepShell>
    );
  }

  return <CepLookup answers={answers} patch={patch} />;
}

function CepLookup({ answers, patch }: Pick<Props, "answers" | "patch">) {
  const [cep, setCep] = useState(() =>
    answers.endereco?.cep_entrega ? maskCEP(answers.endereco.cep_entrega) : "",
  );
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    answers.endereco ? "ok" : "idle",
  );
  const [errorCode, setErrorCode] = useState<CepErrorCode | null>(null);
  const lastQueried = useRef<string>(answers.endereco?.cep_entrega ?? "");
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const consultar = useCallback(
    async (digits: string) => {
      if (lastQueried.current === digits && status !== "error") return;
      lastQueried.current = digits;
      setStatus("loading");
      setErrorCode(null);

      const result = await lookupCEP(digits);
      if (!mountedRef.current) return;
      if (result.ok) {
        setStatus("ok");
        patch({ endereco: result.endereco });
      } else {
        setStatus("error");
        setErrorCode(result.code);
        patch({ endereco: null });
      }
    },
    [patch, status],
  );

  useEffect(() => {
    const digits = onlyDigits(cep);
    if (digits.length !== 8) {
      if (status !== "idle") setStatus("idle");
      return;
    }
    void consultar(digits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cep]);

  return (
    <QuizStepShell
      question="Qual o CEP para entrega?"
      helper="Só o CEP — preenchemos cidade e estado automaticamente."
    >
      {status === "idle" && (
        <p className="mb-3 flex items-center gap-1.5 font-sans text-xs text-primary/80">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Auto-preenchimento
        </p>
      )}

      <div className="space-y-1.5 sm:max-w-[200px]">
        <Label htmlFor="quiz-cep" className="text-sm font-medium">CEP</Label>
        <Input
          id="quiz-cep"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(maskCEP(e.target.value))}
          aria-describedby="quiz-cep-status"
          className="min-h-12 text-base"
        />
      </div>

      <div id="quiz-cep-status" aria-live="polite">
        {status === "loading" && (
          <p className="mt-3 flex items-center gap-2 font-sans text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
            Localizando…
          </p>
        )}
        {status === "ok" && answers.endereco && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 font-sans text-sm font-medium text-foreground">
            <Check className="h-4 w-4 text-primary" strokeWidth={3} aria-hidden="true" />
            {answers.endereco.cidade_entrega} — {answers.endereco.uf_entrega}
          </p>
        )}
        {status === "error" && errorCode && <FieldError>{CEP_ERROR_MESSAGES[errorCode]}</FieldError>}
      </div>
    </QuizStepShell>
  );
}
