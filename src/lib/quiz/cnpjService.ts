/**
 * Consulta de CNPJ.
 *
 * Desacoplado de propósito: os componentes do quiz só conhecem `lookupCNPJ` e
 * o tipo de retorno. Trocar a BrasilAPI por outro fornecedor é mexer só aqui.
 */
import type { EmpresaEnriquecida } from "@/types/quizLead";
import { onlyDigits, validateCNPJ } from "./documents";

export type CnpjErrorCode = "invalido" | "nao_encontrado" | "timeout" | "indisponivel";

export type CnpjResult =
  | { ok: true; empresa: EmpresaEnriquecida }
  | { ok: false; code: CnpjErrorCode };

const ENDPOINT = "https://brasilapi.com.br/api/cnpj/v1";
const TIMEOUT_MS = 9000;

/** Cache de sessão: voltar e avançar não refaz a consulta. */
const cache = new Map<string, CnpjResult>();

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "";
}

function mapResponse(raw: Record<string, unknown>, cnpj: string): EmpresaEnriquecida {
  const situacao = str(raw.descricao_situacao_cadastral) || str(raw.situacao_cadastral);
  return {
    cnpj,
    razao_social: str(raw.razao_social),
    nome_fantasia: str(raw.nome_fantasia),
    situacao_cadastral: situacao,
    cnpj_ativo: situacao.toUpperCase().includes("ATIVA"),
    cnae_codigo: str(raw.cnae_fiscal),
    cnae_descricao: str(raw.cnae_fiscal_descricao),
    porte: str(raw.porte),
    natureza_juridica: str(raw.natureza_juridica),
    cep_empresa: onlyDigits(str(raw.cep)),
    logradouro_empresa: str(raw.logradouro),
    numero_empresa: str(raw.numero),
    bairro_empresa: str(raw.bairro),
    municipio_empresa: str(raw.municipio),
    uf_empresa: str(raw.uf).toUpperCase(),
  };
}

export async function lookupCNPJ(input: string): Promise<CnpjResult> {
  const cnpj = onlyDigits(input);

  if (!validateCNPJ(cnpj)) return { ok: false, code: "invalido" };
  const cached = cache.get(cnpj);
  if (cached) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let result: CnpjResult;
  try {
    const response = await fetch(`${ENDPOINT}/${cnpj}`, { signal: controller.signal });

    if (response.status === 404) {
      result = { ok: false, code: "nao_encontrado" };
    } else if (!response.ok) {
      result = { ok: false, code: "indisponivel" };
    } else {
      const data = (await response.json()) as Record<string, unknown>;
      result = data && typeof data === "object" && str(data.cnpj || data.razao_social)
        ? { ok: true, empresa: mapResponse(data, cnpj) }
        : { ok: false, code: "indisponivel" };
    }
  } catch (error) {
    result = { ok: false, code: (error as Error)?.name === "AbortError" ? "timeout" : "indisponivel" };
  } finally {
    clearTimeout(timer);
  }

  // Só resultados estáveis entram no cache — falha de rede deve poder ser repetida.
  if (result.ok || result.code === "nao_encontrado") cache.set(cnpj, result);
  return result;
}

export const CNPJ_ERROR_MESSAGES: Record<CnpjErrorCode, string> = {
  invalido: "Informe um CNPJ válido.",
  nao_encontrado: "Não encontramos este CNPJ. Confira os dados informados.",
  timeout: "A consulta demorou demais. Tente novamente ou siga sem os dados da empresa.",
  indisponivel: "A consulta está indisponível agora. Você pode seguir sem ela.",
};
