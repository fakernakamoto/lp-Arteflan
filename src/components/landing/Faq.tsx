import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "./SectionHeading";


const items = [
  {
    q: "Quais os diferenciais?",
    a: "A Arteflan entrega a união perfeita entre tradição e tecnologia. Nossos coadores são fabricados com tecido premium 100% algodão de gramatura estruturada, garantindo uma extração limpa, zero pó na xícara e a preservação total do sabor do café. Com 7 opções de tamanhos, costura reforçada para altíssima durabilidade e fornecimento direto da indústria, asseguramos o padrão de excelência que seu cliente exige e a rentabilidade que seu negócio precisa.",
  },
  {
    q: "Qual o pedido mínimo?",
    a: "A partir de R$ 500,00. Para condições especiais de atacado, pedidos a partir de R$ 2.000,00.",
  },
  {
    q: "Vocês entregam em todo o Brasil?",
    a: "Sim. Frete CIF (pago pela Arteflan) para MS a partir de R$ 700,00 e para SP Capital a partir de R$ 3.000,00. Demais regiões consultar.",
  },
  {
    q: "Quais tamanhos de coadores estão disponíveis?",
    a: "Trabalhamos com 7 tamanhos: Mini (6,5x6,5), Pequeno (10x15), Bar (12x20), Especial (13x25), Médio (16x28), Grande (20x25) e GG (20x30).",
  },
  {
    q: "Atendem pessoa física?",
    a: "Nosso foco é distribuição e revenda (B2B), mas atendemos demandas específicas a partir do pedido mínimo.",
  },
  {
    q: "O coador altera o sabor do café?",
    a: "Não. O tecido 100% algodão de qualidade superior Arteflan não passa pó e preserva o sabor autêntico do café.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section-y bg-background">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="Dúvidas frequentes" title="Perguntas frequentes" />

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {items.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="glass-card rounded-xl border-b-0 px-5 transition-colors duration-200"
            >
              <AccordionTrigger className="py-4 text-left text-[0.95rem] font-semibold text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

