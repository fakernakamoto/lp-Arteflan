import { assetUrl } from "@/lib/asset-url";
import coadorMiniCombo from "@/assets/coador-mini-combo.png";
import coadorPequeno from "@/assets/coador-pequeno-v2.png.asset.json";
import coadorBar from "@/assets/coador-bar.png.asset.json";
import coadorEspecial from "@/assets/coador-especial.png.asset.json";
import coadorMedio from "@/assets/coador-medio.png.asset.json";
import coadorGrande from "@/assets/coador-grande.png.asset.json";
import coadorGG from "@/assets/coador-gg.png.asset.json";

export type LineModel = {
  name: string;
  image: string;
};

export type ProductLine = {
  id: string;
  category: string;
  title: string;
  desc: string;
  tags: string[];
  /** Only the models that actually belong to this line. */
  models: LineModel[];
};

export const productLines: ProductLine[] = [
  {
    id: "individual",
    category: "Linha individual",
    title: "Mini e Pequeno",
    desc: "Preparo individual e cafés especiais, com encaixe em porta-coador.",
    tags: ["250 ml", "Cafés especiais", "Porta-coador"],
    models: [
      { name: "Mini", image: coadorMiniCombo },
      { name: "Pequeno", image: assetUrl(coadorPequeno) },
    ],
  },
  {
    id: "residencial",
    category: "Linha residencial",
    title: "Pequeno e Bar",
    desc: "Café diário em casa e em pequenos estabelecimentos, de 1,5 a 2 litros.",
    tags: ["1,5 a 2 L", "Uso diário", "Cabo revestido"],
    models: [
      { name: "Pequeno", image: assetUrl(coadorPequeno) },
      { name: "Bar", image: assetUrl(coadorBar) },
    ],
  },
  {
    id: "profissional",
    category: "Linha profissional",
    title: "Especial, Médio, Grande e GG",
    desc: "De 3 a 8 litros para cafeterias, restaurantes, hotelaria e refeitórios.",
    tags: ["3 a 8 L", "Alto volume", "Costura reforçada"],
    models: [
      { name: "Especial", image: assetUrl(coadorEspecial) },
      { name: "Médio", image: assetUrl(coadorMedio) },
      { name: "Grande", image: assetUrl(coadorGrande) },
      { name: "GG", image: assetUrl(coadorGG) },
    ],
  },
];

export type Audience = {
  id: string;
  eyebrow: string;
  need: string;
  solution: string;
  benefit: string;
};

export const audiences: Audience[] = [
  {
    id: "revenda",
    eyebrow: "Revenda e distribuição",
    need: "Precisa de produto de giro com fornecimento constante.",
    solution: "Fornecimento direto da indústria, com 7 tamanhos na mesma linha.",
    benefit: "Produto de uso recorrente, com potencial de recompra.",
  },
  {
    id: "supermercados",
    eyebrow: "Supermercados e varejo",
    need: "Busca item de utilidade doméstica com boa apresentação em gôndola.",
    solution: "Apresentação adequada à revenda e variedade de tamanhos.",
    benefit: "Sortimento completo em um único fornecedor.",
  },
  {
    id: "cafeterias",
    eyebrow: "Cafeterias e restaurantes",
    need: "Exige extração limpa e resistência ao uso intenso.",
    solution: "Tecido 100% algodão e costura reforçada.",
    benefit: "Sabor preservado, sem pó na xícara.",
  },
  {
    id: "hotelaria",
    eyebrow: "Hotelaria e operações profissionais",
    need: "Precisa atender grandes volumes com previsibilidade.",
    solution: "Tamanhos Grande e GG, de 5 a 8 litros.",
    benefit: "Menos trocas por serviço, operação mais fluida.",
  },
];

export type ProcessStep = {
  n: string;
  title: string;
  label: string;
  desc: string;
};

export const processSteps: ProcessStep[] = [
  {
    n: "01",
    label: "Seleção",
    title: "Escolha dos produtos",
    desc: "Definimos juntos as linhas e tamanhos adequados à sua operação.",
  },
  {
    n: "02",
    label: "Volume",
    title: "Definição do volume",
    desc: "Pedido mínimo a partir de R$ 500,00 e condições de atacado a partir de R$ 2.000,00.",
  },
  {
    n: "03",
    label: "Proposta",
    title: "Proposta comercial",
    desc: "Enviamos a tabela de distribuição com tamanhos, condições e prazos.",
  },
  {
    n: "04",
    label: "Produção",
    title: "Produção própria",
    desc: "Fabricação em nossa unidade, com conferência de qualidade e embalagem.",
  },
  {
    n: "05",
    label: "Envio",
    title: "Envio",
    desc: "Frete CIF para MS a partir de R$ 700,00 e SP Capital a partir de R$ 3.000,00.",
  },
];
