import { buildArteflanWhatsAppUrl } from "./whatsapp.ts";

export const QUOTE_SEGMENTS = ["Supermercado", "Cafeteria", "Revenda"] as const;
export type QuoteData = { name: string; phone: string; company: string; segment: string };
export type QuoteErrors = Partial<Record<keyof QuoteData, string>>;

const clean = (value: string) => value.trim().replace(/\s+/g, " ");

// Validate format only; ownership of a telephone would require an OTP flow.
function normalizePhone(raw: string): string | null {
  if (raw.length > 24 || !/^\+?[\d\s().-]+$/.test(raw.trim())) return null;
  let digits = raw.replace(/\D/g, "");
  if ((digits.length === 12 || digits.length === 13) && digits.startsWith("55")) {
    digits = digits.slice(2);
  }
  const ddd = Number(digits.slice(0, 2));
  const validDdds = [
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43,
    44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
    79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
  ];
  const subscriber = digits.slice(2);
  if (
    !validDdds.includes(ddd) ||
    !/^(?:[2-5]\d{7}|9\d{8})$/.test(subscriber) ||
    /^(\d)\1+$/.test(subscriber)
  )
    return null;
  return `+55${digits}`;
}

export function validateQuote(data: QuoteData): QuoteErrors {
  const errors: QuoteErrors = {};
  if (
    clean(data.name).length < 2 ||
    data.name.length > 120 ||
    !/^[\p{L}\p{M}][\p{L}\p{M} .’'-]+$/u.test(clean(data.name))
  ) {
    errors.name = "Informe seu nome, com 2 a 120 caracteres.";
  }
  if (!normalizePhone(data.phone)) {
    errors.phone = "Informe um telefone válido com DDD, por exemplo (67) 99234-8962.";
  }
  if (clean(data.company).length < 2 || data.company.length > 160) {
    errors.company = "Informe o nome da empresa ou CNPJ, com 2 a 160 caracteres.";
  }
  if (!QUOTE_SEGMENTS.some((segment) => segment === data.segment)) {
    errors.segment = "Selecione o segmento da sua empresa.";
  }
  return errors;
}

export function buildQuoteWhatsAppUrl(data: QuoteData): string {
  if (Object.keys(validateQuote(data)).length) throw new Error("Preencha os dados da cotação.");
  return buildArteflanWhatsAppUrl(
    [
      "Olá, Arteflan! Gostaria de solicitar uma cotação e receber a Tabela de Preços de Atacado.",
      "",
      `Nome: ${clean(data.name)}`,
      `Telefone/WhatsApp: ${normalizePhone(data.phone)}`,
      `Empresa/CNPJ: ${clean(data.company)}`,
      `Segmento: ${data.segment}`,
    ].join("\n"),
  );
}
