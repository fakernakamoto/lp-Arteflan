import { buildArteflanWhatsAppUrl } from "./whatsapp.ts";

export const QUOTE_SEGMENTS = ["Supermercado", "Cafeteria", "Revenda"] as const;
export type QuoteData = { name: string; company: string; segment: string };
export type QuoteErrors = Partial<Record<keyof QuoteData, string>>;

const clean = (value: string) => value.trim().replace(/\s+/g, " ");

export function validateQuote(data: QuoteData): QuoteErrors {
  const errors: QuoteErrors = {};
  if (clean(data.name).length < 2 || data.name.length > 120) {
    errors.name = "Informe seu nome, com 2 a 120 caracteres.";
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
      `Empresa/CNPJ: ${clean(data.company)}`,
      `Segmento: ${data.segment}`,
    ].join("\n"),
  );
}
