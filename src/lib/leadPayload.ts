import {
  FAIXA_OPTIONS,
  MOMENTO_OPTIONS,
  PERFIL_OPTIONS,
  PRODUTO_OPTIONS,
  type CapiUserData,
  type FaixaPedido,
  type LeadPayload,
  type LeadStatus,
  type MomentoCompra,
  type PerfilEmpresa,
  type ProdutoInteresse,
  type QuizAnswers,
} from "@/types/lead";
import { buildLeadMeta } from "@/lib/leadMeta";

export const LEAD_SCHEMA_VERSION = "quiz_v1";
export const QUIZ_FORM_NAME = "quiz_cotacao_arteflan";

export function newId(prefix = "id"): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  } catch {
    // ignore
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function phoneDigits(raw: string): string {
  return raw.replace(/\D+/g, "");
}

export function phoneE164(raw: string): string {
  const d = phoneDigits(raw);
  if (!d) return "";
  if (d.startsWith("55")) return `+${d}`;
  if (d.length === 10 || d.length === 11) return `+55${d}`;
  return `+${d}`;
}

function labelOf<T extends string>(opts: { value: T; label: string }[], value: string): string {
  return opts.find((o) => o.value === value)?.label ?? "";
}

export const perfilLabel = (v: string) => labelOf(PERFIL_OPTIONS, v);
export const faixaLabel = (v: string) => labelOf(FAIXA_OPTIONS, v);
export const momentoLabel = (v: string) => labelOf(MOMENTO_OPTIONS, v);
export const produtoLabel = (v: string) => labelOf(PRODUTO_OPTIONS, v);

const PERFIL_SCORE: Record<PerfilEmpresa, number> = {
  distribuidor: 30,
  supermercado: 25,
  revenda_atacado: 25,
  hotelaria: 20,
  food_service: 15,
  outra_empresa: 8,
  uso_proprio: 0,
};

const FAIXA_SCORE: Record<FaixaPedido, number> = {
  acima_5000: 30,
  "2000_4999": 25,
  "700_1999": 15,
  avaliando: 5,
  ate_699: 0,
};

const MOMENTO_SCORE: Record<MomentoCompra, number> = {
  imediato: 20,
  ate_30_dias: 15,
  "31_90_dias": 8,
  pesquisa: 3,
};

function produtoScore(produtos: ProdutoInteresse[]): number {
  if (!produtos.length) return 0;
  return produtos.some((p) => p === "linha_completa" || p === "mix_produtos") ? 10 : 5;
}

export function computeLeadScore(a: QuizAnswers): number {
  const perfil = a.perfil_empresa ? PERFIL_SCORE[a.perfil_empresa] : 0;
  const faixa = a.faixa_pedido ? FAIXA_SCORE[a.faixa_pedido] : 0;
  const momento = a.momento_compra ? MOMENTO_SCORE[a.momento_compra] : 0;
  return perfil + faixa + momento + produtoScore(a.produtos_interesse);
}

export function leadStatusFromScore(score: number): LeadStatus {
  if (score >= 60) return "MQL_PRIORITARIO";
  if (score >= 40) return "MQL";
  if (score >= 20) return "LEAD_NUTRICAO";
  return "BAIXA_ADERENCIA";
}

export function disqualificationReason(a: QuizAnswers): string {
  if (a.perfil_empresa === "uso_proprio") return "perfil_uso_proprio";
  if (a.perfil_empresa === "distribuidor" && (a.faixa_pedido === "ate_699" || a.faixa_pedido === "700_1999")) {
    return "abaixo_pedido_minimo_distribuicao";
  }
  if (a.faixa_pedido === "ate_699") return "abaixo_pedido_minimo_revenda";

  return "";
}

/** Contextual guidance shown in the order-range step. Never blocks the user. */
export function minimumOrderHint(a: QuizAnswers): string | null {
  if (a.faixa_pedido === "ate_699") {
    return "Para fornecimento direto da indústria, os pedidos para revenda começam em aproximadamente R$ 700. Podemos ajudar você a montar um mix dentro dessa faixa.";
  }
  if (a.perfil_empresa === "distribuidor" && a.faixa_pedido === "700_1999") {
    return "Para condições de distribuição, os pedidos começam em aproximadamente R$ 2.000. Também é possível montar um mix de produtos para alcançar essa faixa.";
  }
  return null;
}

export function buildLeadPayload(
  a: QuizAnswers,
  ids: { eventId: string; submissionId: string },
  userData: CapiUserData,
): LeadPayload {
  const meta = buildLeadMeta();
  const utms = (meta.utms ?? {}) as Record<string, string>;
  const score = computeLeadScore(a);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return {
    schema_version: LEAD_SCHEMA_VERSION,
    event: "quiz_lead",
    event_id: ids.eventId,
    submission_id: ids.submissionId,
    lead_status: leadStatusFromScore(score),
    lead_score: score,
    disqualification_reason: disqualificationReason(a),

    nome: a.nome.trim(),
    empresa: a.empresa.trim(),
    whatsapp: a.whatsapp,
    whatsapp_digits: phoneDigits(a.whatsapp),
    whatsapp_e164: phoneE164(a.whatsapp),
    email: a.email.trim(),

    perfil_empresa: a.perfil_empresa,
    perfil_empresa_label: perfilLabel(a.perfil_empresa),
    produtos_interesse: a.produtos_interesse,
    produtos_interesse_labels: a.produtos_interesse.map(produtoLabel),
    faixa_pedido: a.faixa_pedido,
    faixa_pedido_label: faixaLabel(a.faixa_pedido),
    momento_compra: a.momento_compra,
    momento_compra_label: momentoLabel(a.momento_compra),

    cidade: a.cidade.trim(),
    estado: a.estado,
    consentimento_contato: a.consentimento_contato,

    utm_source: utms.utm_source ?? "",
    utm_medium: utms.utm_medium ?? "",
    utm_campaign: utms.utm_campaign ?? "",
    utm_content: utms.utm_content ?? "",
    utm_term: utms.utm_term ?? "",
    gclid: utms.gclid ?? "",
    gbraid: utms.gbraid ?? "",
    wbraid: utms.wbraid ?? "",
    fbclid: utms.fbclid ?? "",
    fbp: userData.fbp,
    fbc: userData.fbc,

    page_url: pageUrl,
    landing_path: meta.page_path ?? "",
    first_landing_url: meta.first_landing_url ?? "",
    first_referrer: meta.first_referrer ?? "",
    referrer: meta.referrer ?? "",
    user_agent: meta.user_agent ?? "",
    submitted_at: new Date().toISOString(),
    timezone: meta.timezone ?? "",

    event_name: "Lead",
    event_time: Math.floor(Date.now() / 1000),
    action_source: "website",
    event_source_url: pageUrl,
    user_data: userData,
  };
}

/** WhatsApp message built from the collected answers. */
export function buildWhatsAppText(a: QuizAnswers): string {
  const lines = [
    "Olá! Preenchi o quiz de cotação no site.",
    "",
    `*Nome:* ${a.nome.trim()}`,
    a.empresa.trim() ? `*Empresa:* ${a.empresa.trim()}` : "",
    `*Perfil:* ${perfilLabel(a.perfil_empresa)}`,
    `*Produtos:* ${a.produtos_interesse.map(produtoLabel).join(", ")}`,
    `*Primeiro pedido:* ${faixaLabel(a.faixa_pedido)}`,
    `*Momento:* ${momentoLabel(a.momento_compra)}`,
    `*Cidade:* ${a.cidade.trim()}${a.estado ? ` - ${a.estado}` : ""}`,
  ].filter(Boolean);
  return lines.join("\n");
}
