/** Fluxo condicional do quiz: a lista de etapas depende do perfil escolhido. */
import { onlyDigits, validateCNPJ } from "@/lib/quiz/documents";
import { isValidBrPhone, isValidEmail } from "@/lib/phoneMask";
import type { QuizAnswers } from "@/types/quizLead";

export type StepId =
  | "perfil"
  | "documento"
  | "finalidade"
  | "necessidade"
  | "prazo"
  | "local"
  | "contato";

/**
 * A etapa "finalidade" só existe para quem saiu de um perfil PJ sem CNPJ.
 * Depende de `precisa_finalidade` (estável), nunca de `finalidade_compra`
 * (que mudaria o tamanho do fluxo no meio da navegação).
 */
export function buildFlow(a: QuizAnswers): StepId[] {
  const flow: StepId[] = ["perfil"];
  if (!a.tipo_pessoa) return flow;
  flow.push("documento");
  if (a.tipo_pessoa === "PF" && a.precisa_finalidade) flow.push("finalidade");
  flow.push("necessidade", "prazo", "local", "contato");
  return flow;
}

/** Etapas de escolha única — avançam sozinhas, sem botão. */
export const AUTO_ADVANCE: ReadonlySet<StepId> = new Set<StepId>([
  "perfil",
  "finalidade",
  "prazo",
]);

/** Retorna a mensagem de erro da etapa, ou null quando está válida. */
export function validateStep(step: StepId, a: QuizAnswers): string | null {
  switch (step) {
    case "perfil":
      return a.perfil_entrada ? null : "Selecione o perfil da sua operação.";

    case "documento":
      if (a.tipo_pessoa === "PJ") {
        if (onlyDigits(a.cnpj).length !== 14 || !validateCNPJ(a.cnpj)) {
          return "Informe um CNPJ válido.";
        }
        // Empresa confirmada pela API OU nome informado à mão quando a API falhou.
        if (!a.empresa && a.empresa_manual.trim().length < 2) {
          return "Aguarde a consulta do CNPJ ou informe o nome da empresa.";
        }
        return null;
      }
      return a.cpf_valido === true ? null : "Informe um CPF válido.";

    case "finalidade":
      return a.finalidade_compra ? null : "Selecione o objetivo da sua compra.";

    case "necessidade":
      if (!a.produto_interesse) return "Selecione o que você procura.";
      if (!a.pedido_estimado_faixa) return "Selecione a estimativa do primeiro pedido.";
      return null;

    case "prazo":
      return a.prazo_compra ? null : "Selecione quando pretende comprar.";

    case "local":
      return a.endereco ? null : "Confirme a região de entrega.";

    case "contato":
      if (a.nome_responsavel.trim().length < 2) return "Informe o nome do responsável.";
      if (!isValidBrPhone(a.whatsapp)) return "Informe um WhatsApp válido.";
      if (a.email.trim() && !isValidEmail(a.email)) return "Informe um e-mail válido.";
      if (!a.papel_decisao) return "Informe sua participação na decisão de compra.";
      if (!a.consentimento_contato) return "É necessário aceitar o contato comercial.";
      return null;

    default:
      return null;
  }
}

/**
 * Ao trocar de perfil, limpa apenas o que depende dele.
 * UTMs, tracking e contato são preservados.
 */
export function resetDependentes(a: QuizAnswers, novoTipo: "PJ" | "PF"): Partial<QuizAnswers> {
  const base: Partial<QuizAnswers> = {
    entrega_mesma_regiao: null,
    endereco: null,
  };
  if (novoTipo === "PF") {
    return {
      ...base,
      cnpj: "",
      empresa: null,
      empresa_manual: "",
      segmento_empresa: "",
    };
  }
  return { ...base, cpf: "", cpf_valido: null, finalidade_compra: "", precisa_finalidade: false };
}

export const STEP_NAMES: Record<StepId, string> = {
  perfil: "perfil_operacao",
  documento: "documento",
  finalidade: "finalidade_compra",
  necessidade: "produto_e_volume",
  prazo: "prazo_compra",
  local: "localizacao",
  contato: "contato",
};
