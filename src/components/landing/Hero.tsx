import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Coffee, Factory, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fbTrack } from "@/lib/fbpixel";
import { gaEvent } from "@/lib/analytics";
import { QuoteLink } from "@/components/navigation/QuoteLink";
import { SectionEyebrow } from "./SectionEyebrow";
import { FeatureLabel } from "./FeatureLabel";
import { ScrollIndicator } from "@/components/ui/scroll-indicator";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import heroVideo from "@/assets/hero-coador.mp4";
import heroPoster from "@/assets/hero-coador-poster.jpg";

const labels = [
  { icon: Award, label: "Desde 1990" },
  { icon: Factory, label: "Fabricação própria" },
  { icon: Coffee, label: "Tecido 100% algodão" },
  { icon: ShieldCheck, label: "Atendimento B2B" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  // Video is the hero itself: no idle deferral, no artificial delay.
  // Reduced motion → keep the poster frame and never loop.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion) {
      v.pause();
      setVideoReady(false);
      return;
    }
    v.play().catch(() => {});

    // Pause when the hero leaves the viewport → frees CPU/GPU while scrolling.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reducedMotion]);


  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-brand-dark md:min-h-[100svh]"
    >
      {/* Background video (decorative) + static poster fallback */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <img
          src={heroPoster}
          alt=""
          aria-hidden="true"
          className="hero-media absolute inset-0 h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
        {!reducedMotion && (
          <video
            ref={videoRef}
            src={heroVideo}
            poster={heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            className={`hero-media absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              videoReady ? "opacity-100" : "opacity-0"
            }`}
            onCanPlay={() => setVideoReady(true)}
            onPlaying={() => setVideoReady(true)}
            onError={() => setVideoReady(false)}
          />
        )}

        {/* Warm brown contrast overlays — stronger behind the copy */}
        <div className="absolute inset-0 hero-overlay-mobile md:hero-overlay-desktop" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-dark/90 to-transparent" />
        <div className="absolute inset-0 hero-vignette" />
      </div>

      <div className="container-page relative w-full pb-20 pt-24 md:pb-28 md:pt-[calc(86px+3.5rem)]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex max-w-[680px] flex-col items-start text-left lg:max-w-[720px]"
        >
          <motion.div variants={item}>
            <SectionEyebrow className="text-[0.68rem] text-brand-gold md:text-[0.72rem]">
              Coadores de tecido
            </SectionEyebrow>
          </motion.div>

          <motion.h1 variants={item} className="type-hero mt-5 text-white">
            Coadores de tecido premium{" "}
            <em className="font-normal italic text-brand-gold">direto da fábrica</em>{" "}
            para o seu negócio
          </motion.h1>

          <motion.p variants={item} className="type-body mt-5 max-w-[58ch] text-white/85">
            Há mais de 30 anos, a Arteflan fabrica coadores de tecido 100% algodão
            para supermercados, revendas, distribuidores e operações profissionais
            em todo o Brasil.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <QuoteLink
              source="hero_orcamento"
              className="group inline-flex min-h-[52px] items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow-card transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
            >
              Solicitar orçamento
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </QuoteLink>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-[52px] rounded-xl border-white/30 bg-white/10 px-8 text-white backdrop-blur-sm transition-colors duration-200 hover:border-white/45 hover:bg-white/20 hover:text-white"
            >
              <a
                href="#produtos"
                onClick={() => {
                  fbTrack("ViewContent", { source: "hero_produtos" });
                  gaEvent("click_cta", {
                    source: "hero_produtos",
                    destination: "produtos",
                  });
                }}
              >
                Conhecer os produtos
              </a>
            </Button>
          </motion.div>

          <motion.ul variants={item} className="mt-8 flex flex-wrap gap-2">
            {labels.map(({ icon: Icon, label }) => (
              <li key={label} className="max-w-full">
                <FeatureLabel
                  icon={Icon}
                  tone="dark"
                  className="border-white/25 bg-white/10 backdrop-blur-sm"
                >
                  {label}
                </FeatureLabel>
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <ScrollIndicator
          tone="dark"
          className="absolute bottom-7 left-0 hidden [@media(min-height:720px)]:flex"
          label="Role para conhecer"
        />
      </div>
    </section>
  );
}
