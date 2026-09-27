import { test } from "node:test";
import assert from "node:assert/strict";
import { buildQuoteWhatsAppUrl, validateQuote } from "../src/lib/quote.ts";

const valid = {
  name: " João da Silva ",
  company: " Café & Cia / São Paulo ",
  segment: "Cafeteria",
};
test("rejects whitespace-only required fields and invalid segments", () => {
  const errors = validateQuote({ name: "  ", company: "\n ", segment: "Outro" });
  assert.deepEqual(Object.keys(errors).sort(), ["company", "name", "segment"]);
});
test("accepts company name or CNPJ and the three business segments", () => {
  for (const segment of ["Supermercado", "Cafeteria", "Revenda"]) {
    for (const company of ["Distribuidora São José", "04.814.488/0001-41"]) {
      assert.deepEqual(validateQuote({ ...valid, company, segment }), {});
    }
  }
});
test("bounds input length", () => {
  assert.ok(validateQuote({ ...valid, name: "a".repeat(121) }).name);
  assert.ok(validateQuote({ ...valid, company: "a".repeat(161) }).company);
});
test("sends trimmed, encoded data to the official WhatsApp number", () => {
  const url = new URL(buildQuoteWhatsAppUrl(valid));
  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5567992348962");
  assert.equal([...url.searchParams].length, 1);
  assert.equal(
    url.searchParams.get("text"),
    "Olá, Arteflan! Gostaria de solicitar uma cotação e receber a Tabela de Preços de Atacado.\n\nNome: João da Silva\nEmpresa/CNPJ: Café & Cia / São Paulo\nSegmento: Cafeteria",
  );
});
test("does not build a WhatsApp message with incomplete data", () => {
  assert.throws(() => buildQuoteWhatsAppUrl({ ...valid, name: "" }));
});
