/** Consulta de CEP (ViaCEP), desacoplada dos componentes do quiz. */
import type { EnderecoEntrega } from "@/types/quizLead";
import { onlyDigits } from "./documents";

export type CepErrorCode = "invalido" | "nao_encontrado" | "timeout" | "indisponivel";

export type CepResult =
  | { ok: true; endereco: EnderecoEntrega }
  | { ok: false; code: CepErrorCode };

const TIMEOUT_MS = 8000;
const cache = new Map<string, CepResult>();

export async function lookupCEP(input: string): Promise<CepResult> {
  const cep = onlyDigits(input);
  if (cep.length !== 8) return { ok: false, code: "invalido" };

  const cached = cache.get(cep);
  if (cached) return cached;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let result: CepResult;
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      result = { ok: false, code: "indisponivel" };
    } else {
      const data = (await response.json()) as Record<string, unknown>;
      result = data?.erro
        ? { ok: false, code: "nao_encontrado" }
        : {
            ok: true,
            endereco: {
              cep_entrega: cep,
              cidade_entrega: String(data.localidade ?? "").trim(),
              uf_entrega: String(data.uf ?? "").trim().toUpperCase(),
              codigo_ibge: String(data.ibge ?? "").trim(),
            },
          };
    }
  } catch (error) {
    result = { ok: false, code: (error as Error)?.name === "AbortError" ? "timeout" : "indisponivel" };
  } finally {
    clearTimeout(timer);
  }

  if (result.ok || result.code === "nao_encontrado") cache.set(cep, result);
  return result;
}

export const CEP_ERROR_MESSAGES: Record<CepErrorCode, string> = {
  invalido: "Informe um CEP válido.",
  nao_encontrado: "Não encontramos este CEP. Confira os números informados.",
  timeout: "A consulta demorou demais. Tente novamente.",
  indisponivel: "A consulta de CEP está indisponível agora. Tente novamente.",
};
