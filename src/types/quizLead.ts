/** Estado único do quiz de cotação. Separa: respostas, dados de API, qualificação. */

export type TipoPessoa = "PJ" | "PF";

export type SegmentoEmpresa =
  | "distribuidora"
  | "supermercado"
  | "loja_revenda"
  | "cafeteria"
  | "restaurante"
  | "hotel"
  | "outro";

export type FinalidadeCompra =
  | "revenda"
  | "distribuicao"
  | "uso_profissional"
  | "estruturando_negocio"
  | "uso_proprio"
  | "outro";

export type ProdutoInteresse = "coadores" | "flanelas" | "coadores_flanelas" | "avaliando";

export type FaixaPedido =
  | "menos_700"
  | "700_1999"
  | "2000_3999"
  | "4000_mais"
  | "nao_sabe";

export type PrazoCompra =
  | "imediato"
  | "7_dias"
  | "30_dias"
  | "30_60_dias"
  | "mais_60_dias"
  | "pesquisando";

export type PapelDecisao = "responsavel" | "participa" | "outra_pessoa";

export type Classificacao =
  | "SQL"
  | "MQL"
  | "LEAD_POTENCIAL"
  | "BAIXA_PRIORIDADE"
  | "CONSUMIDOR_FINAL";

/** Dados vindos da consulta de CNPJ (nunca digitados pelo usuário). */
export type EmpresaEnriquecida = {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  cnpj_ativo: boolean;
  cnae_codigo: string;
  cnae_descricao: string;
  porte: string;
  natureza_juridica: string;
  cep_empresa: string;
  logradouro_empresa: string;
  numero_empresa: string;
  bairro_empresa: string;
  municipio_empresa: string;
  uf_empresa: string;
};

/** Dados vindos da consulta de CEP. */
export type EnderecoEntrega = {
  cep_entrega: string;
  cidade_entrega: string;
  uf_entrega: string;
  codigo_ibge: string;
};

export type QuizAnswers = {
  // etapa 1 — perfil comercial (deriva tipo_pessoa, segmento e/ou finalidade)
  perfil_entrada: string;
  tipo_pessoa: TipoPessoa | "";
  /** true quando o lead saiu de um perfil PJ por não ter CNPJ — precisa declarar a finalidade. */
  precisa_finalidade: boolean;
  // etapa 2
  cnpj: string;
  cpf: string;
  cpf_valido: boolean | null;
  empresa: EmpresaEnriquecida | null;
  /** Preenchido só quando a API falha e o usuário informa manualmente. */
  empresa_manual: string;
  // etapa 3
  segmento_empresa: SegmentoEmpresa | "";
  finalidade_compra: FinalidadeCompra | "";
  // etapa 4
  produto_interesse: ProdutoInteresse | "";
  pedido_estimado_faixa: FaixaPedido | "";
  // etapa 5
  prazo_compra: PrazoCompra | "";
  // etapa 6
  entrega_mesma_regiao: boolean | null;
  endereco: EnderecoEntrega | null;
  // etapa 7
  nome_responsavel: string;
  whatsapp: string;
  email: string;
  papel_decisao: PapelDecisao | "";
  consentimento_contato: boolean;
};

export const EMPTY_ANSWERS: QuizAnswers = {
  perfil_entrada: "",
  tipo_pessoa: "",
  precisa_finalidade: false,
  cnpj: "",
  cpf: "",
  cpf_valido: null,
  empresa: null,
  empresa_manual: "",
  segmento_empresa: "",
  finalidade_compra: "",
  produto_interesse: "",
  pedido_estimado_faixa: "",
  prazo_compra: "",
  entrega_mesma_regiao: null,
  endereco: null,
  nome_responsavel: "",
  whatsapp: "",
  email: "",
  papel_decisao: "",
  consentimento_contato: false,
};

type Opt<T> = { value: T; label: string; hint?: string };

/**
 * Etapa 1. Pergunta comercial, não cartorial: o perfil DERIVA se é PJ ou PF,
 * e já preenche segmento (PJ) ou finalidade (PF). Ninguém é perguntado
 * "você é pessoa física ou jurídica?".
 */
export type PerfilEntrada = {
  value: string;
  label: string;
  hint?: string;
  tipo_pessoa: TipoPessoa;
  segmento?: SegmentoEmpresa;
  finalidade?: FinalidadeCompra;
};

export const PERFIL_ENTRADA_OPTIONS: PerfilEntrada[] = [
  { value: "distribuidora", label: "Distribuidora ou atacadista", tipo_pessoa: "PJ", segmento: "distribuidora" },
  { value: "supermercado", label: "Supermercado ou mercearia", tipo_pessoa: "PJ", segmento: "supermercado" },
  { value: "loja_revenda", label: "Loja ou revenda", tipo_pessoa: "PJ", segmento: "loja_revenda" },
  { value: "cafeteria", label: "Cafeteria", tipo_pessoa: "PJ", segmento: "cafeteria" },
  { value: "restaurante", label: "Restaurante ou food service", tipo_pessoa: "PJ", segmento: "restaurante" },
  { value: "hotel", label: "Hotel ou pousada", tipo_pessoa: "PJ", segmento: "hotel" },
  { value: "outra_empresa", label: "Outro tipo de empresa", tipo_pessoa: "PJ", segmento: "outro" },
  {
    value: "estruturando",
    label: "Estou montando meu negócio",
    hint: "Ainda sem CNPJ",
    tipo_pessoa: "PF",
    finalidade: "estruturando_negocio",
  },
  {
    value: "uso_proprio",
    label: "Compra para uso próprio",
    tipo_pessoa: "PF",
    finalidade: "uso_proprio",
  },
];

export function perfilByValue(value: string): PerfilEntrada | undefined {
  return PERFIL_ENTRADA_OPTIONS.find((p) => p.value === value);
}

export const SEGMENTO_OPTIONS: Opt<SegmentoEmpresa>[] = [
  { value: "distribuidora", label: "Distribuidora ou atacadista" },
  { value: "supermercado", label: "Supermercado ou mercearia" },
  { value: "loja_revenda", label: "Loja ou revenda" },
  { value: "cafeteria", label: "Cafeteria" },
  { value: "restaurante", label: "Restaurante ou food service" },
  { value: "hotel", label: "Hotel ou pousada" },
  { value: "outro", label: "Outro tipo de empresa" },
];

export const FINALIDADE_OPTIONS: Opt<FinalidadeCompra>[] = [
  { value: "revenda", label: "Revenda" },
  { value: "distribuicao", label: "Distribuição" },
  { value: "uso_profissional", label: "Uso profissional" },
  { value: "estruturando_negocio", label: "Estou estruturando um negócio" },
  { value: "uso_proprio", label: "Uso próprio ou consumo pessoal" },
  { value: "outro", label: "Outro" },
];

export const PRODUTO_OPTIONS: Opt<ProdutoInteresse>[] = [
  { value: "coadores", label: "Coadores de café" },
  { value: "flanelas", label: "Flanelas" },
  { value: "coadores_flanelas", label: "Coadores e flanelas" },
  { value: "avaliando", label: "Ainda estou avaliando" },
];

export const FAIXA_OPTIONS: Opt<FaixaPedido>[] = [
  { value: "menos_700", label: "Menos de R$ 700" },
  { value: "700_1999", label: "De R$ 700 a R$ 1.999" },
  { value: "2000_3999", label: "De R$ 2.000 a R$ 3.999" },
  { value: "4000_mais", label: "R$ 4.000 ou mais" },
  { value: "nao_sabe", label: "Ainda não sei" },
];

export const PRAZO_OPTIONS: Opt<PrazoCompra>[] = [
  { value: "imediato", label: "O quanto antes" },
  { value: "7_dias", label: "Nos próximos 7 dias" },
  { value: "30_dias", label: "Nos próximos 30 dias" },
  { value: "30_60_dias", label: "Entre 30 e 60 dias" },
  { value: "mais_60_dias", label: "Mais de 60 dias" },
  { value: "pesquisando", label: "Estou apenas pesquisando" },
];

export const PAPEL_OPTIONS: Opt<PapelDecisao>[] = [
  { value: "responsavel", label: "Sim, sou responsável pela compra" },
  { value: "participa", label: "Sim, participo da decisão" },
  { value: "outra_pessoa", label: "Não, outra pessoa decide" },
];

/** Rótulos legíveis, usados no WhatsApp e no payload do CRM. */
export function labelOf<T extends string>(opts: Opt<T>[], value: T | ""): string {
  return opts.find((o) => o.value === value)?.label ?? "";
}
