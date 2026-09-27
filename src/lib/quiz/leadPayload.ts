/** Monta o objeto final do lead enviado ao webhook. */
import { buildLeadMeta } from "@/lib/leadMeta";
import { getAttribution } from "@/lib/utm";
import { onlyDigits } from "./documents";
import { calculateLeadScore, CLASSIFICACAO_LABEL } from "./leadScoring";
import {
  FAIXA_OPTIONS,
  FINALIDADE_OPTIONS,
  PAPEL_OPTIONS,
  PRAZO_OPTIONS,
  PRODUTO_OPTIONS,
  SEGMENTO_OPTIONS,
  labelOf,
  type QuizAnswers,
} from "@/types/quizLead";

export const QUIZ_FORM_NAME = "quiz_cotacao_arteflan";

export function newId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

function e164(whatsapp: string): string {
  const d = onlyDigits(whatsapp);
  return d ? `+55${d}` : "";
}

/** Nunca envia undefined: ausência vira string vazia ou null, de forma consistente. */
export function buildLeadPayload(
  a: QuizAnswers,
  ids: { submissionId: string; eventId: string },
) {
  const q = calculateLeadScore(a);
  const meta = buildLeadMeta();
  const attrib = getAttribution();
  const empresa = a.empresa;

  return {
    schema_version: "2.0",
    form_name: QUIZ_FORM_NAME,
    lead_id: ids.submissionId,
    event_id: ids.eventId,
    created_at: new Date().toISOString(),

    // identificação
    tipo_pessoa: a.tipo_pessoa || "",
    perfil_entrada: a.perfil_entrada || "",
    cpf: a.tipo_pessoa === "PF" ? onlyDigits(a.cpf) : null,
    cpf_valido: a.tipo_pessoa === "PF" ? a.cpf_valido ?? false : null,

    // empresa (enriquecida via Receita)
    cnpj: empresa?.cnpj ?? (a.tipo_pessoa === "PJ" ? onlyDigits(a.cnpj) : ""),
    cnpj_ativo: empresa ? empresa.cnpj_ativo : null,
    razao_social: empresa?.razao_social ?? "",
    nome_fantasia: empresa?.nome_fantasia ?? a.empresa_manual ?? "",
    situacao_cadastral: empresa?.situacao_cadastral ?? "",
    porte: empresa?.porte ?? "",
    natureza_juridica: empresa?.natureza_juridica ?? "",
    cnae_codigo: empresa?.cnae_codigo ?? "",
    cnae_descricao: empresa?.cnae_descricao ?? "",
    cep_empresa: empresa?.cep_empresa ?? "",
    municipio_empresa: empresa?.municipio_empresa ?? "",
    uf_empresa: empresa?.uf_empresa ?? "",

    // qualificação declarada
    segmento_empresa: a.segmento_empresa || "",
    segmento_empresa_label: labelOf(SEGMENTO_OPTIONS, a.segmento_empresa),
    finalidade_compra: a.finalidade_compra || "",
    finalidade_compra_label: labelOf(FINALIDADE_OPTIONS, a.finalidade_compra),
    produto_interesse: a.produto_interesse || "",
    produto_interesse_label: labelOf(PRODUTO_OPTIONS, a.produto_interesse),
    pedido_estimado_faixa: a.pedido_estimado_faixa || "",
    pedido_estimado_label: labelOf(FAIXA_OPTIONS, a.pedido_estimado_faixa),
    prazo_compra: a.prazo_compra || "",
    prazo_compra_label: labelOf(PRAZO_OPTIONS, a.prazo_compra),
    papel_decisao: a.papel_decisao || "",
    papel_decisao_label: labelOf(PAPEL_OPTIONS, a.papel_decisao),

    // entrega
    cep_entrega: a.endereco?.cep_entrega ?? "",
    cidade_entrega: a.endereco?.cidade_entrega ?? "",
    uf_entrega: a.endereco?.uf_entrega ?? "",
    codigo_ibge: a.endereco?.codigo_ibge ?? "",

    // contato
    nome_responsavel: a.nome_responsavel.trim(),
    whatsapp: a.whatsapp.trim(),
    whatsapp_digits: onlyDigits(a.whatsapp),
    whatsapp_e164: e164(a.whatsapp),
    email: a.email.trim(),
    consentimento_contato: a.consentimento_contato,

    // qualificação calculada
    lead_score: q.lead_score,
    classificacao: q.classificacao,
    classificacao_label: CLASSIFICACAO_LABEL[q.classificacao],
    perfil_consumidor_final: q.perfil_consumidor_final,
    motivos_qualificacao: q.motivos_qualificacao,
    motivos_desqualificacao: q.motivos_desqualificacao,

    // tracking
    utm_source: attrib.utm_source ?? "",
    utm_medium: attrib.utm_medium ?? "",
    utm_campaign: attrib.utm_campaign ?? "",
    utm_content: attrib.utm_content ?? "",
    utm_term: attrib.utm_term ?? "",
    gclid: attrib.gclid ?? "",
    gbraid: attrib.gbraid ?? "",
    wbraid: attrib.wbraid ?? "",
    fbclid: attrib.fbclid ?? "",
    fbp: meta.fbp ?? "",
    fbc: meta.fbc ?? "",
    page_url: meta.page_url,
    referrer: meta.referrer,
    user_agent: meta.user_agent,
    timezone: meta.timezone,
    submitted_at: new Date().toISOString(),
  };
}

export type LeadPayload = ReturnType<typeof buildLeadPayload>;

/** Mensagem que o lead leva pronta ao abrir o WhatsApp. */
export function buildWhatsAppText(a: QuizAnswers): string {
  const empresa = a.empresa?.nome_fantasia || a.empresa?.razao_social || a.empresa_manual;
  const local = a.endereco
    ? `${a.endereco.cidade_entrega} — ${a.endereco.uf_entrega}`
    : "";

  const linhas = [
    "Olá! Acabei de solicitar uma cotação no site da Arteflan.",
    "",
    `Nome: ${a.nome_responsavel.trim()}`,
    empresa ? `Empresa: ${empresa}` : "",
    local ? `Região: ${local}` : "",
    a.produto_interesse ? `Interesse: ${labelOf(PRODUTO_OPTIONS, a.produto_interesse)}` : "",
    a.pedido_estimado_faixa
      ? `Primeiro pedido: ${labelOf(FAIXA_OPTIONS, a.pedido_estimado_faixa)}`
      : "",
    a.prazo_compra ? `Prazo: ${labelOf(PRAZO_OPTIONS, a.prazo_compra)}` : "",
  ];

  return linhas.filter(Boolean).join("\n");
}
