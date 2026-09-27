import { useId, useState, type FormEvent } from "react";
import { MessageCircle } from "lucide-react";
import {
  buildQuoteWhatsAppUrl,
  QUOTE_SEGMENTS,
  validateQuote,
  type QuoteErrors,
} from "@/lib/quote";
import { suppressQuoteOffer } from "@/lib/quote-offer";
import { gaEvent } from "@/lib/analytics";

export function QuoteForm({ source }: { source: string }) {
  const id = useId();
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [whatsappUrl, setWhatsappUrl] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const data = {
      name: String(fields.get("name") ?? ""),
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
    setWhatsappUrl(url);
    suppressQuoteOffer();
    // A redirect is a contact attempt, not confirmation of a sent WhatsApp message.
    gaEvent("quote_whatsapp_redirect", { source, segment: data.segment });
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
        className="whatsapp-cta flex min-h-13 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold"
      >
        <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
        Solicitar Cotação
      </button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Todos os campos são obrigatórios. Ao continuar, o WhatsApp abrirá com seus dados na
        mensagem. Toque em enviar para solicitar a tabela ao comercial.
      </p>
      {whatsappUrl && (
        <p role="status" className="text-sm">
          Se o WhatsApp não abriu,{" "}
          <a href={whatsappUrl} className="font-semibold underline">
            continue sua cotação aqui
          </a>
          .
        </p>
      )}
    </form>
  );
}
