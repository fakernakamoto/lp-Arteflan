/**
 * Lead scoring & classificação comercial — Arteflan.
 *
 * Escala: 0–100. Centraliza toda a lógica de qualificação.
 * Nunca importar isso dentro de componentes visuais: apenas no payload builder.
 */
import type { Classificacao, QuizAnswers } from "@/types/quizLead";

export type ScoreResult = {
  lead_score: number;
  classificacao: Classificacao;
  perfil_consumidor_final: boolean;
  motivos_qualificacao: string[];
  motivos_desqualificacao: string[];
};

export const CLASSIFICACAO_LABEL: Record<Classificacao, string> = {
  SQL: "Alta prioridade",
  MQL: "Lead qualificado",
  LEAD_POTENCIAL: "Lead potencial",
  BAIXA_PRIORIDADE: "Baixa prioridade",
  CONSUMIDOR_FINAL: "Consumidor final",
};

// ─── Tabelas de pontuação ──────────────────────────────────────────────────

const SCORE_TIPO: Record<string, number> = { PJ: 10, PF: 0 };

const SCORE_CNPJ_ATIVO = 20;

const SCORE_SEGMENTO: Record<string, number> = {
  distribuidora: 20,
  supermercado: 15,
  loja_revenda: 15,
  cafeteria: 10,
  restaurante: 10,
  hotel: 10,
  outro: 3,
};

const SCORE_FAIXA: Record<string, number> = {
  "4000_mais": 20,
  "2000_3999": 18,
  "700_1999": 12,
  menos_700: 3,
  nao_sabe: 5,
};

const SCORE_PRAZO: Record<string, number> = {
  imediato: 15,
  "7_dias": 15,
  "30_dias": 10,
  "30_60_dias": 5,
  mais_60_dias: 2,
  pesquisando: 0,
};

const SCORE_PAPEL: Record<string, number> = {
  responsavel: 10,
  participa: 7,
  outra_pessoa: 2,
};

// ─── Cálculo ───────────────────────────────────────────────────────────────

export function calculateLeadScore(a: QuizAnswers): ScoreResult {
  const motivos_qualificacao: string[] = [];
  const motivos_desqualificacao: string[] = [];
  let raw = 0;

  // Tipo pessoa
  raw += SCORE_TIPO[a.tipo_pessoa] ?? 0;

  // CNPJ ativo
  if (a.empresa?.cnpj_ativo) {
    raw += SCORE_CNPJ_ATIVO;
    motivos_qualificacao.push("CNPJ ativo");
  }

  // Segmento (PJ) ou finalidade relevante (PF)
  if (a.tipo_pessoa === "PJ") {
    const seg = SCORE_SEGMENTO[a.segmento_empresa] ?? 0;
    raw += seg;
    if (seg >= 15) motivos_qualificacao.push("Segmento prioritário");
  } else if (a.finalidade_compra && a.finalidade_compra !== "uso_proprio") {
    // PF com intenção comercial recebe pontos moderados
    raw += 8;
    motivos_qualificacao.push("PF com intenção comercial");
  }

  // Faixa de pedido
  const faixa = SCORE_FAIXA[a.pedido_estimado_faixa] ?? 0;
  raw += faixa;
  if (faixa >= 18) motivos_qualificacao.push("Pedido acima de R$ 2.000");
  if (a.pedido_estimado_faixa === "menos_700") {
    motivos_desqualificacao.push("Volume abaixo do pedido mínimo");
  }

  // Prazo
  const prazo = SCORE_PRAZO[a.prazo_compra] ?? 0;
  raw += prazo;
  if (prazo >= 15) motivos_qualificacao.push("Compra em até 7 dias");

  // Papel na decisão
  const papel = SCORE_PAPEL[a.papel_decisao] ?? 0;
  raw += papel;
  if (papel >= 10) motivos_qualificacao.push("Decisor");

  // Clamp 0-100
  const lead_score = Math.min(100, Math.max(0, raw));

  // Consumidor final
  const perfil_consumidor_final =
    a.finalidade_compra === "uso_proprio" && a.tipo_pessoa === "PF";

  if (perfil_consumidor_final) {
    motivos_desqualificacao.push("Consumidor final");
  }

  // Classificação
  const classificacao = classifyLead(lead_score, perfil_consumidor_final, a);

  return {
    lead_score,
    classificacao,
    perfil_consumidor_final,
    motivos_qualificacao,
    motivos_desqualificacao,
  };
}

function classifyLead(
  score: number,
  consumidorFinal: boolean,
  a: QuizAnswers,
): Classificacao {
  if (consumidorFinal) return "CONSUMIDOR_FINAL";

  // CNPJ inativo não pode ser SQL automaticamente
  if (a.empresa && !a.empresa.cnpj_ativo && score >= 80) {
    return "MQL";
  }

  if (score >= 80) return "SQL";
  if (score >= 60) return "MQL";
  if (score >= 40) return "LEAD_POTENCIAL";
  return "BAIXA_PRIORIDADE";
}
