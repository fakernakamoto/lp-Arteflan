import { useId, useRef, useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import {
  buildQuoteWhatsAppUrl,
  QUOTE_SEGMENTS,
  validateQuote,
  type QuoteErrors,
} from "@/lib/quote";
import { suppressQuoteOffer } from "@/lib/quote-offer";
import { gaEvent } from "@/lib/analytics";
import { reportQuoteConversion } from "@/lib/quote-conversion";

export function QuoteForm({ source }: { source: string }) {
  const id = useId();
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const submitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitted.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const data = {
      name: String(fields.get("name") ?? ""),
      phone: String(fields.get("phone") ?? ""),
      company: String(fields.get("company") ?? ""),
      segment: String(fields.get("segment") ?? ""),
    };
    const nextErrors = validateQuote(data);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    const url = buildQuoteWhatsAppUrl(data);
    submitted.current = true;
    setSubmitting(true);
    suppressQuoteOffer();
    // Reserve a tab during the user gesture; navigate only after tracking completes.
    // If popups are blocked, use the current tab after the same tracking delay.
    let whatsappWindow: Window | null = null;
    try {
      whatsappWindow = window.open("about:blank", "_blank");
      if (whatsappWindow) whatsappWindow.opener = null;
    } catch {
      whatsappWindow = null;
    }
    // This conversion means a validated quote form, not a message sent in WhatsApp.
    await reportQuoteConversion();
    try {
      gaEvent("quote_whatsapp_redirect", { source, segment: data.segment });
    } catch {
      // Optional analytics must never prevent the WhatsApp handoff.
    }
    setWhatsappUrl(url);
    setSubmitting(false);
    if (whatsappWindow && !whatsappWindow.closed) {
      try {
        whatsappWindow.location.replace(url);
        return;
      } catch {
        whatsappWindow.close();
      }
    }
    window.location.assign(url);
  }

  const fieldClass =
    "mt-2 min-h-12 w-full rounded-lg border border-input bg-background px-3 py-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-destructive";

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={suppressQuoteOffer}
      noValidate
      data-quote-form
      data-quote-source={source}
      aria-busy={submitting}
      className="space-y-5 text-left"
    >
      <div>
        <label htmlFor={`${id}-name`} className="text-sm font-semibold">
          Nome <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={120}
          placeholder="Seu nome"
          className={fieldClass}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${id}-name-error` : undefined}
        />
        {errors.name && (
          <p id={`${id}-name-error`} className="mt-2 text-sm text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${id}-phone`} className="text-sm font-semibold">
          Telefone/WhatsApp <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${id}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={24}
          placeholder="(67) 99234-8962"
          className={fieldClass}
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? `${id}-phone-error` : `${id}-phone-hint`}
        />
        <p id={`${id}-phone-hint`} className="mt-2 text-xs text-muted-foreground">
          Inclua o DDD. Você pode informar o código +55.
        </p>
        {errors.phone && (
          <p id={`${id}-phone-error`} className="mt-2 text-sm text-destructive" role="alert">
            {errors.phone}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${id}-company`} className="text-sm font-semibold">
          Nome da Empresa/CNPJ <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${id}-company`}
          name="company"
          autoComplete="organization"
          required
          minLength={2}
          maxLength={160}
          placeholder="Razão social, nome fantasia ou CNPJ"
          className={fieldClass}
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? `${id}-company-error` : undefined}
        />
        {errors.company && (
          <p id={`${id}-company-error`} className="mt-2 text-sm text-destructive" role="alert">
            {errors.company}
          </p>
        )}
      </div>
      <div>
        <label htmlFor={`${id}-segment`} className="text-sm font-semibold">
          Segmento <span aria-hidden="true">*</span>
        </label>
        <select
          id={`${id}-segment`}
          name="segment"
          required
          defaultValue=""
          className={fieldClass}
          aria-invalid={!!errors.segment}
          aria-describedby={errors.segment ? `${id}-segment-error` : undefined}
        >
          <option value="" disabled>
            Selecione seu segmento
          </option>
          {QUOTE_SEGMENTS.map((segment) => (
            <option key={segment} value={segment}>
              {segment === "Revenda" ? "Revenda / Distribuidor" : segment}
            </option>
          ))}
        </select>
        {errors.segment && (
          <p id={`${id}-segment-error`} className="mt-2 text-sm text-destructive" role="alert">
            {errors.segment}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={submitting || !!whatsappUrl}
        className="whatsapp-cta flex min-h-13 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        {submitting
          ? "Abrindo WhatsApp…"
          : whatsappUrl
            ? "Cotação encaminhada"
            : "Solicitar Cotação"}
      </button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Todos os campos são obrigatórios. Ao continuar, o WhatsApp abrirá em uma nova aba com seus
        dados na mensagem. Toque em enviar para solicitar a tabela ao comercial.
      </p>
      {whatsappUrl && (
        <p role="status" className="text-sm">
          Se o WhatsApp não abriu,{" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            continue sua cotação aqui
          </a>
          .
        </p>
      )}
    </form>
  );
}
