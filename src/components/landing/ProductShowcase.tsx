import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { QuoteLink } from "@/components/navigation/QuoteLink";
import { assetUrl } from "@/lib/asset-url";
import coadorMiniCombo from "@/assets/coador-mini-combo.png";
import coadorPequeno from "@/assets/coador-pequeno-v2.png.asset.json";
import coadorBar from "@/assets/coador-bar.png.asset.json";
import coadorEspecial from "@/assets/coador-especial.png.asset.json";
import coadorMedio from "@/assets/coador-medio.png.asset.json";
import coadorGrande from "@/assets/coador-grande.png.asset.json";
import coadorGG from "@/assets/coador-gg.png.asset.json";

type Model = {
  code: string;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  features: string[];
  image: string;
};

const models: Model[] = [
  {
    code: "MIN",
    name: "Coador Mini",
    tagline: "Linha Individual",
    description:
      "6,5 x 6,5 cm — 250 ml. Máxima praticidade no preparo individual e em cafés especiais",
    highlights: ["250 ml", "Cafés especiais", "Porta-coador"],
    features: [
      "Tecido Premium 100% algodão de gramatura superior",
      "Costura reforçada",
      "Extração equilibrada e zero pó na xícara",
      "Encaixe perfeito em porta-coador",
    ],
    image: coadorMiniCombo,
  },
  {
    code: "PEQ",
    name: "Coador Pequeno",
    tagline: "Linha Residencial",
    description: "10 x 15 cm — 1,5 litro. Padrão ouro para o café do dia a dia",
    highlights: ["1,5 litro", "Uso diário", "Residencial"],
    features: [
      "Tecido Premium 100% algodão de gramatura superior",
      "Estrutura de aço carbono",
      "Cabo ergonômico revestido",
      "Costura reforçada",
    ],
    image: assetUrl(coadorPequeno),
  },
  {
    code: "BAR",
    name: "Coador Bar",
    tagline: "Linha Residencial",
    description:
      "12 x 20 cm — 2 litros. Versátil para preparos maiores em casa ou pequenos estabelecimentos",
    highlights: ["2 litros", "Residencial", "Bares"],
    features: [
      "Tecido Premium 100% algodão de gramatura superior",
      "Estrutura de aço carbono",
      "Cabo ergonômico revestido",
      "Costura reforçada",
    ],
    image: assetUrl(coadorBar),
  },
  {
    code: "ESP",
    name: "Coador Especial",
    tagline: "Linha Profissional",
    description:
      "13 x 25 cm — 3 litros. Entrada da linha profissional, ideal para lanchonetes e pequenos negócios",
    highlights: ["3 litros", "Lanchonetes", "Pequeno comércio"],
    features: [
      "Tecido Premium 100% algodão de gramatura superior",
      "Estrutura de aço carbono",
      "Cabo ergonômico revestido",
      "Costura reforçada",
    ],
    image: assetUrl(coadorEspecial),
  },
  {
    code: "MED",
    name: "Coador Médio",
    tagline: "Linha Profissional",
    description: "16 x 28 cm — 5 litros. Equilíbrio entre volume e praticidade de extração",
    highlights: ["5 litros", "Cafeterias", "Padarias"],
    features: [
      "Tecido Premium 100% algodão de gramatura superior",
      "Estrutura de aço carbono",
      "Cabo ergonômico revestido",
      "Costura reforçada dupla",
    ],
    image: assetUrl(coadorMedio),
  },
  {
    code: "GRD",
    name: "Coador Grande",
    tagline: "Linha Profissional",
    description:
      "20 x 25 cm — mais de 5 litros. Pensado para restaurantes, hotelaria e operações de alto fluxo",
    highlights: ["+ de 5 litros", "Restaurantes", "Hotelaria"],
    features: [
      "Tecido Premium 100% algodão de gramatura superior",
      "Estrutura de aço carbono",
      "Cabo ergonômico revestido",
      "Costura reforçada dupla",
    ],
    image: assetUrl(coadorGrande),
  },
  {
    code: "GG",
    name: "Coador GG",
    tagline: "Linha Profissional",
    description:
      "20 x 30 cm — 8 litros. O maior da linha, para grandes volumes em eventos, indústrias e refeitórios",
    highlights: ["8 litros", "Eventos", "Refeitórios"],
    features: [
      "Tecido Premium 100% algodão de gramatura superior",
      "Estrutura de aço carbono",
      "Cabo ergonômico revestido",
      "Costura reforçada dupla",
    ],
    image: assetUrl(coadorGG),
  },
];

const getZindex = (length: number, index: number, active: number) =>
  index === active ? length : length - Math.abs(index - active);

export function ProductShowcase() {
  const [active, setActive] = useState(1);
  const progress = useRef(100 / (models.length - 1));
  const didDrag = useRef(false);
  const startX = useRef(0);
  const isDown = useRef(false);
  const [dragging, setDragging] = useState(false);
  const current = models[active];
  const total = models.length;

  const applyProgress = (value: number) => {
    progress.current = Math.max(0, Math.min(value, 100));
    setActive(Math.floor((progress.current / 100) * (total - 1)));
  };

  const goTo = (index: number) => {
    applyProgress((index / (total - 1)) * 100);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    didDrag.current = false;
    isDown.current = true;
    setDragging(true);
    startX.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDown.current) return;
    if (!didDrag.current && Math.abs(e.clientX - startX.current) < 6) return;
    didDrag.current = true;
    applyProgress(progress.current + (e.clientX - startX.current) * -0.35);
    startX.current = e.clientX;
  };

  const endDrag = () => {
    isDown.current = false;
    setDragging(false);
  };

  const onWheel = (e: React.WheelEvent) => {
    // só reage a scroll horizontal (trackpad) para não roubar o scroll da página
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    applyProgress(progress.current + e.deltaX * 0.15);
  };

  return (
    <section id="portfolio" className="section-y bg-muted/50">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-2xl text-left"
        >
          <span className="type-label inline-flex items-center gap-2 text-primary">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            Tamanhos e aplicações
          </span>
          <h2 className="type-h2 mt-4 text-balance text-foreground">
            Escolha o tamanho pela aplicação
          </h2>
          <p className="type-body measure-wide mt-4 text-muted-foreground">
            Sete tamanhos cobrindo do preparo individual ao alto volume. Arraste o carrossel ou
            clique em um modelo para ver os detalhes.
          </p>
        </motion.div>

        <div className="mt-8 grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Carousel card */}
          <div className="glass-card min-w-0 rounded-3xl border border-border p-3 sm:p-4 shadow-elegant md:p-6">
            <div
              className={`pc-stage rounded-2xl ${dragging ? "is-down" : ""}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onPointerCancel={endDrag}
              onWheel={onWheel}
            >
              {models.map((m, i) => {
                const zIndex = getZindex(total, i, active);
                return (
                  <button
                    type="button"
                    key={m.code}
                    onClick={() => {
                      if (!didDrag.current) goTo(i);
                    }}
                    tabIndex={i === active ? 0 : -1}
                    aria-label={m.name}
                    aria-pressed={i === active}
                    className="pc-item"
                    style={
                      {
                        "--zIndex": zIndex,
                        "--active": (i - active) / total,
                        "--opacity": (zIndex / total) * 3 - 2,
                      } as React.CSSProperties
                    }
                  >
                    <span className="pc-item-box block bg-gradient-to-br from-brand-hero to-brand-brown">
                      <img
                        src={m.image}
                        alt={`${m.name} Arteflan em tecido 100% algodão — ${m.tagline.toLowerCase()}, ${m.highlights[0]}`}
                        decoding="async"
                        width={380}
                        height={500}
                        draggable={false}
                        loading="lazy"
                        className="h-full w-full object-contain p-4"
                      />
                      <span className="absolute left-4 top-2 z-[2] font-display text-4xl leading-none text-white/85 md:text-5xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="absolute bottom-4 left-4 z-[2] text-left">
                        <span className="block font-display text-lg text-white md:text-xl">
                          {m.name}
                        </span>
                        <span className="block text-[11px] uppercase tracking-[0.2em] text-brand-gold">
                          {m.tagline}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {models.map((m, i) => (
                <button
                  key={m.code}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Ver ${m.name}`}
                  aria-pressed={i === active}
                  aria-controls="detalhes-modelo"
                  className={`min-h-11 min-w-11 rounded-full px-3 py-2 text-[11px] font-bold transition-colors ${
                    i === active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-brand-gold/20"
                  }`}
                >
                  {m.code}
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Arraste para navegar entre os modelos
            </p>
          </div>

          {/* Detail card */}
          <article
            id="detalhes-modelo"
            aria-live="polite"
            aria-atomic="true"
            className="glass-card min-w-0 rounded-3xl border border-border p-5 shadow-elegant md:p-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Modelo
                </span>
                <h3 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">
                  {current.name}
                </h3>
                <p className="mt-3 text-muted-foreground">{current.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {current.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
                    >
                      <Check className="h-3 w-3" />
                      {h}
                    </span>
                  ))}
                </div>

                <div className="mt-6 h-px w-full bg-border" />

                <div className="mt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Características principais
                  </p>
                  <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {current.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold">
                          <Check className="h-3 w-3" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </article>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <QuoteLink
            source="showcase_tabela_precos"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Receber Tabela de Preços
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </QuoteLink>
          <QuoteLink
            source="showcase_falar_consultor"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-input bg-background px-8 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Falar com um Consultor
          </QuoteLink>
        </div>
      </div>
    </section>
  );
}
