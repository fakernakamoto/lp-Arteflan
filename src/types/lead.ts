// Single source of truth for the Arteflan B2B qualification quiz.

export type PerfilEmpresa =
  | "supermercado"
  | "distribuidor"
  | "revenda_atacado"
  | "food_service"
  | "hotelaria"
  | "outra_empresa"
  | "uso_proprio";

export type ProdutoInteresse =
  | "coadores_revenda"
  | "coadores_profissionais"
  | "linha_completa"
  | "flanelas"
  | "mix_produtos"
  | "precisa_orientacao";

export type FaixaPedido =
  | "ate_699"
  | "700_1999"
  | "2000_4999"
  | "acima_5000"
  | "avaliando";

export type MomentoCompra = "imediato" | "ate_30_dias" | "31_90_dias" | "pesquisa";

export type LeadStatus =
  | "MQL_PRIORITARIO"
  | "MQL"
  | "LEAD_NUTRICAO"
  | "BAIXA_ADERENCIA";

export type Option<T extends string> = { value: T; label: string };

export const PERFIL_OPTIONS: Option<PerfilEmpresa>[] = [
  { value: "supermercado", label: "Supermercado ou rede varejista" },
  { value: "distribuidor", label: "Distribuidor" },
  { value: "revenda_atacado", label: "Revenda ou atacado" },
  { value: "food_service", label: "Cafeteria, restaurante ou padaria" },
  { value: "hotelaria", label: "Hotelaria" },
  { value: "outra_empresa", label: "Outro tipo de empresa" },
  { value: "uso_proprio", label: "Compra para uso próprio" },
];

export const PRODUTO_OPTIONS: Option<ProdutoInteresse>[] = [
  { value: "coadores_revenda", label: "Coadores para revenda" },
  { value: "coadores_profissionais", label: "Coadores para uso profissional" },
  { value: "linha_completa", label: "Linha completa de coadores" },
  { value: "flanelas", label: "Flanelas" },
  { value: "mix_produtos", label: "Mix de produtos" },
  { value: "precisa_orientacao", label: "Ainda não sei qual modelo escolher" },
];

export const FAIXA_OPTIONS: Option<FaixaPedido>[] = [
  { value: "ate_699", label: "Até R$ 699" },
  { value: "700_1999", label: "De R$ 700 a R$ 1.999" },
  { value: "2000_4999", label: "De R$ 2.000 a R$ 4.999" },
  { value: "acima_5000", label: "R$ 5.000 ou mais" },
  { value: "avaliando", label: "Ainda estou avaliando" },
];

export const MOMENTO_OPTIONS: Option<MomentoCompra>[] = [
  { value: "imediato", label: "Quero comprar agora" },
  { value: "ate_30_dias", label: "Nos próximos 30 dias" },
  { value: "31_90_dias", label: "Entre 31 e 90 dias" },
  { value: "pesquisa", label: "Estou pesquisando fornecedores" },
];

export const UF_OPTIONS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
] as const;

export type Uf = (typeof UF_OPTIONS)[number];

export type QuizAnswers = {
  perfil_empresa: PerfilEmpresa | "";
  produtos_interesse: ProdutoInteresse[];
  faixa_pedido: FaixaPedido | "";
  momento_compra: MomentoCompra | "";
  cidade: string;
  estado: string;
  empresa: string;
  nome: string;
  whatsapp: string;
  email: string;
  consentimento_contato: boolean;
};

export const EMPTY_ANSWERS: QuizAnswers = {
  perfil_empresa: "",
  produtos_interesse: [],
  faixa_pedido: "",
  momento_compra: "",
  cidade: "",
  estado: "",
  empresa: "",
  nome: "",
  whatsapp: "",
  email: "",
  consentimento_contato: false,
};

export type CapiUserData = {
  em: string;
  ph: string;
  fbc: string;
  fbp: string;
  client_user_agent: string;
};

export type LeadPayload = {
  schema_version: string;
  event: string;
  event_id: string;
  submission_id: string;
  lead_status: LeadStatus;
  lead_score: number;
  disqualification_reason: string;

  nome: string;
  empresa: string;
  whatsapp: string;
  whatsapp_digits: string;
  whatsapp_e164: string;
  email: string;

  perfil_empresa: string;
  perfil_empresa_label: string;
  produtos_interesse: string[];
  produtos_interesse_labels: string[];
  faixa_pedido: string;
  faixa_pedido_label: string;
  momento_compra: string;
  momento_compra_label: string;

  cidade: string;
  estado: string;
  consentimento_contato: boolean;

  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  fbclid: string;
  fbp: string;
  fbc: string;

  page_url: string;
  landing_path: string;
  first_landing_url: string;
  first_referrer: string;
  referrer: string;
  user_agent: string;
  submitted_at: string;
  timezone: string;

  event_name: string;
  event_time: number;
  action_source: string;
  event_source_url: string;
  user_data: CapiUserData;
};
