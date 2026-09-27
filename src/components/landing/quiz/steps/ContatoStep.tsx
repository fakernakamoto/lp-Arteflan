import { ShieldCheck, MessageCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuizOption } from "../QuizOption";
import { QuizStepShell } from "./QuizStepShell";
import { PAPEL_OPTIONS, type PapelDecisao, type QuizAnswers } from "@/types/quizLead";
import { maskBrPhone } from "@/lib/phoneMask";

type Props = {
  answers: QuizAnswers;
  patch: (p: Partial<QuizAnswers>) => void;
};

export function ContatoStep({ answers, patch }: Props) {
  return (
    <QuizStepShell
      question="Quase lá! Como podemos falar com você?"
      helper="Enviaremos as condições comerciais pelo WhatsApp."
    >
      {/* Nome + WhatsApp — destaque, lado a lado em desktop */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="quiz-nome" className="text-sm font-medium">
            Seu nome
          </Label>
          <Input
            id="quiz-nome"
            autoComplete="name"
            maxLength={120}
            placeholder="Nome do responsável"
            value={answers.nome_responsavel}
            onChange={(e) => patch({ nome_responsavel: e.target.value })}
            className="min-h-12 text-base"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quiz-whatsapp" className="text-sm font-medium">
            <MessageCircle className="mr-1 inline h-3.5 w-3.5 text-[#25D366]" aria-hidden="true" />
            WhatsApp
          </Label>
          <Input
            id="quiz-whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={20}
            placeholder="(00) 00000-0000"
            value={answers.whatsapp}
            onChange={(e) => patch({ whatsapp: maskBrPhone(e.target.value) })}
            className="min-h-12 text-base"
          />
        </div>
      </div>

      {/* E-mail — secundário */}
      <div className="mt-3 space-y-1.5">
        <Label htmlFor="quiz-email" className="text-sm text-muted-foreground">
          E-mail <span className="text-muted-foreground/70">(opcional)</span>
        </Label>
        <Input
          id="quiz-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={180}
          placeholder="voce@empresa.com.br"
          value={answers.email}
          onChange={(e) => patch({ email: e.target.value })}
          className="min-h-11"
        />
      </div>

      {/* Papel na decisão — compacto */}
      <div className="mt-5">
        <p className="mb-2 font-sans text-sm font-medium text-foreground">
          Você decide a compra?
        </p>
        <div role="radiogroup" aria-label="Papel na decisão" className="grid gap-2 sm:grid-cols-3">
          {PAPEL_OPTIONS.map((o) => (
            <QuizOption
              key={o.value}
              id={`papel-${o.value}`}
              label={o.label}
              selected={answers.papel_decisao === o.value}
              onSelect={() => patch({ papel_decisao: o.value as PapelDecisao })}
            />
          ))}
        </div>
      </div>

      {/* Consentimento — pré-marcado com texto claro */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-brand-brown/10 bg-muted/40 p-3">
        <Checkbox
          id="quiz-consent"
          className="mt-0.5"
          checked={answers.consentimento_contato}
          onCheckedChange={(v) => patch({ consentimento_contato: v === true })}
        />
        <Label htmlFor="quiz-consent" className="font-sans text-sm leading-snug text-foreground/80">
          Concordo em receber contato comercial da Arteflan.
        </Label>
      </div>

      <p className="mt-3 flex items-center gap-1.5 font-sans text-[11px] text-muted-foreground">
        <ShieldCheck className="h-3 w-3 text-primary/70" aria-hidden="true" />
        Seus dados são usados somente para atendimento comercial.
      </p>
    </QuizStepShell>
  );
}
