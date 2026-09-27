import { SectionHeading } from "./SectionHeading";
import paulistao from "@/assets/clients/paulistao.png";
import compreBem from "@/assets/clients/compre-bem.png";
import tudoAlgoMais from "@/assets/clients/tudo-algo-mais.png";
import gauchao from "@/assets/clients/gauchao.png";
import cliente5 from "@/assets/clients/cliente-5.png";
import salatigas from "@/assets/clients/salatigas.png";
import palacio from "@/assets/clients/palacio.png";
import frigo from "@/assets/clients/frigo.png";
import trento from "@/assets/clients/trento.png";
import gLogo from "@/assets/clients/g-logo.png";
import ordini from "@/assets/clients/ordini.png";
import clarear from "@/assets/clients/clarear.png";
import cvale from "@/assets/clients/cvale.png";
import gmais from "@/assets/clients/gmais.png";

const logos: { name: string; src?: string; scale?: string }[] = [
  { name: "Paulistão Atacadista", src: paulistao, scale: "scale-[1.8]" },
  { name: "Compre Bem Supermercados", src: compreBem, scale: "scale-[2.6]" },
  { name: "Tudo & Algo + Utilidades", src: tudoAlgoMais },
  { name: "Gauchão Supermercados", src: gauchao },
  { name: "Cliente 5", src: cliente5 },
  { name: "Salatigás Atacado", src: salatigas },
  { name: "Palácio Utilidades", src: palacio },
  { name: "Frigo", src: frigo, scale: "scale-[1.8]" },
  { name: "Supermercado Trento", src: trento },
  { name: "Lojas G", src: gLogo, scale: "scale-[2.6]" },
  { name: "Ordini", src: ordini },
  { name: "Clarear", src: clarear },
  { name: "C.Vale", src: cvale },
  { name: "Grupo GMais", src: gmais },
];

export function Clients() {
  const loop = [...logos, ...logos];

  return (
    <section className="section-y-tight relative overflow-hidden bg-muted/50">
      <div className="container-page">
        <SectionHeading
          eyebrow="Clientes"
          title="Marcas que já compram da Arteflan"
          description="Supermercados, atacadistas e redes de utilidades que revendem nossos coadores."
        />


        <div className="relative mt-8">
          {/* Fades laterais nas cores da marca */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-muted to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-muted to-transparent" />

          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee gap-6">
              {loop.map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="glass-card flex h-32 w-56 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-gold/30 px-8 shadow-elegant transition-transform hover:-translate-y-1"
                >
                  {logo.src ? (
                    <img
                      src={logo.src}
                      alt={logo.name}
                      className={`max-h-24 w-auto object-contain ${logo.scale ?? ""}`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                      {logo.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
