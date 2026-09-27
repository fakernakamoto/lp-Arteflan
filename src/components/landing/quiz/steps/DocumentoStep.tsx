import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyResultCard } from "../CompanyResultCard";
import { QuizStepShell, FieldError } from "./QuizStepShell";
import { CNPJ_ERROR_MESSAGES, lookupCNPJ, type CnpjErrorCode } from "@/lib/quiz/cnpjService";
import { maskCNPJ, maskCPF, onlyDigits, validateCNPJ, validateCPF } from "@/lib/quiz/documents";
import type { QuizAnswers } from "@/types/quizLead";

type Props = {
  answers: QuizAnswers;
  patch: (p: Partial<QuizAnswers>) => void;
  onSemCnpj: () => void;
};

export function DocumentoStep({ answers, patch, onSemCnpj }: Props) {
  return answers.tipo_pessoa === "PJ" ? (
    <CnpjStep answers={answers} patch={patch} onSemCnpj={onSemCnpj} />
  ) : (
    <CpfStep answers={answers} patch={patch} />
  );
}

function CnpjStep({ answers, patch, onSemCnpj }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    answers.empresa ? "ok" : "idle",
  );
  const [errorCode, setErrorCode] = useState<CnpjErrorCode | null>(null);
  const lastQueried = useRef<string>(answers.empresa?.cnpj ?? "");
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

      const result = await lookupCNPJ(digits);
      if (!mountedRef.current) return;
      if (result.ok) {
        setStatus("ok");
        patch({ empresa: result.empresa, empresa_manual: "" });
      } else {
        setStatus("error");
        setErrorCode(result.code);
        patch({ empresa: null });
      }
    },
    [patch, status],
  );

  useEffect(() => {
    const digits = onlyDigits(answers.cnpj);
    if (digits.length !== 14) {
      if (status !== "idle") setStatus("idle");
      return;
    }
    if (!validateCNPJ(digits)) {
      setStatus("error");
      setErrorCode("invalido");
      return;
    }
    void consultar(digits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers.cnpj]);

  const falhaDeRede = errorCode === "timeout" || errorCode === "indisponivel";

  return (
    <QuizStepShell
      question="Vamos localizar sua empresa"
      helper="Digite o CNPJ — preenchemos o resto automaticamente."
    >
      {/* Dica de auto-preenchimento */}
      {status === "idle" && (
        <p className="mb-3 flex items-center gap-1.5 font-sans text-xs text-primary/80">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Auto-preenchimento inteligente
        </p>
      )}

      <div className="space-y-1.5 sm:max-w-[280px]">
        <Label htmlFor="quiz-cnpj" className="text-sm font-medium">CNPJ</Label>
        <Input
          id="quiz-cnpj"
          inputMode="numeric"
          autoComplete="off"
          placeholder="00.000.000/0000-00"
          value={answers.cnpj}
          onChange={(e) => patch({ cnpj: maskCNPJ(e.target.value) })}
          aria-describedby="quiz-cnpj-status"
          className="min-h-12 text-base"
        />
      </div>

      <div id="quiz-cnpj-status" aria-live="polite">
        {status === "loading" && (
          <p className="mt-3 flex items-center gap-2 font-sans text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
            Consultando na Receita Federal…
          </p>
        )}

        {status === "ok" && answers.empresa && <CompanyResultCard empresa={answers.empresa} />}

        {status === "error" && errorCode && (
          <>
            <FieldError>{CNPJ_ERROR_MESSAGES[errorCode]}</FieldError>
            {falhaDeRede && (
              <div className="mt-3 space-y-1.5">
                <Label htmlFor="quiz-empresa-manual" className="text-sm">Nome da empresa</Label>
                <Input
                  id="quiz-empresa-manual"
                  autoComplete="organization"
                  maxLength={160}
                  placeholder="Razão social ou nome fantasia"
                  value={answers.empresa_manual}
                  onChange={(e) => patch({ empresa_manual: e.target.value })}
                  className="min-h-11"
                />
              </div>
            )}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onSemCnpj}
        className="mt-5 inline-flex items-center gap-1 font-sans text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      >
        Ainda não tenho CNPJ
      </button>
    </QuizStepShell>
  );
}

function CpfStep({ answers, patch }: Pick<Props, "answers" | "patch">) {
  const digits = onlyDigits(answers.cpf);
  const mostrarErro = digits.length === 11 && answers.cpf_valido === false;

  return (
    <QuizStepShell
      question="Informe seu CPF"
      helper="Usamos apenas para emitir a proposta comercial."
    >
      <div className="space-y-1.5 sm:max-w-[240px]">
        <Label htmlFor="quiz-cpf" className="text-sm font-medium">CPF</Label>
        <Input
          id="quiz-cpf"
          inputMode="numeric"
          autoComplete="off"
          placeholder="000.000.000-00"
          value={answers.cpf}
          onChange={(e) => {
            const masked = maskCPF(e.target.value);
            const d = onlyDigits(masked);
            patch({ cpf: masked, cpf_valido: d.length === 11 ? validateCPF(d) : null });
          }}
          className="min-h-12 text-base"
        />
        {mostrarErro && <FieldError>Informe um CPF válido.</FieldError>}
      </div>
    </QuizStepShell>
  );
}
