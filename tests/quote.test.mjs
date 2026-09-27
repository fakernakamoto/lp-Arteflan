import { test } from "node:test";
import assert from "node:assert/strict";
import { buildQuoteWhatsAppUrl, validateQuote } from "../src/lib/quote.ts";

const valid = {
  name: " João da Silva ",
  phone: "(67) 99234-8962",
  company: " Café & Cia / São Paulo ",
  segment: "Cafeteria",
};
test("rejects whitespace-only required fields and invalid segments", () => {
  const errors = validateQuote({ name: "  ", phone: "  ", company: "\n ", segment: "Outro" });
  assert.deepEqual(Object.keys(errors).sort(), ["company", "name", "phone", "segment"]);
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
    "Olá, Arteflan! Gostaria de solicitar uma cotação e receber a Tabela de Preços de Atacado.\n\nNome: João da Silva\nTelefone/WhatsApp: +5567992348962\nEmpresa/CNPJ: Café & Cia / São Paulo\nSegmento: Cafeteria",
  );
});
test("does not build a WhatsApp message with incomplete data", () => {
  assert.throws(() => buildQuoteWhatsAppUrl({ ...valid, name: "" }));
});

test("rejects empty, incomplete, repeated and malformed phone numbers", () => {
  for (const phone of [
    "",
    "  ",
    "123",
    "00000000000",
    "(11) 11111-1111",
    "(00) 99234-8962",
    "abc67992348962",
    "(67) 89234-8962",
  ]) {
    assert.ok(validateQuote({ ...valid, phone }).phone, phone);
    assert.throws(() => buildQuoteWhatsAppUrl({ ...valid, phone }));
  }
});
test("accepts Brazilian phone formats with DDD and optional country code", () => {
  for (const phone of [
    "67992348962",
    "+55 (67) 99234-8962",
    "5567992348962",
    "(11) 3456-7890",
    "(55) 99234-8962",
  ]) {
    assert.deepEqual(validateQuote({ ...valid, phone }), {}, phone);
  }
});
test("rejects names containing only numbers or symbols", () => {
  for (const name of ["123", "!!", "a1"]) assert.ok(validateQuote({ ...valid, name }).name);
});
