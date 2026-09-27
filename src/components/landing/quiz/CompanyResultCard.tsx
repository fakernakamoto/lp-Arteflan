import { AlertTriangle, Building2, Check, MapPin } from "lucide-react";
import type { EmpresaEnriquecida } from "@/types/quizLead";

/** Confirmação visual do enriquecimento por CNPJ. O usuário nunca redigita o nome. */
export function CompanyResultCard({ empresa }: { empresa: EmpresaEnriquecida }) {
  const nome = empresa.nome_fantasia || empresa.razao_social || "Empresa localizada";
  const local = [empresa.municipio_empresa, empresa.uf_empresa].filter(Boolean).join(" — ");

  return (
    <div className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <p className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-primary">
        <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
        Empresa encontrada
      </p>
      <p className="mt-2 flex items-start gap-2 font-display text-base leading-snug text-foreground">
        <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" aria-hidden="true" />
        <span>{nome}</span>
      </p>
      {local && (
        <p className="mt-1.5 flex items-center gap-2 font-sans text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
          {local}
        </p>
      )}
      {!empresa.cnpj_ativo && (
        <p className="mt-3 flex items-start gap-2 rounded-lg border border-brand-gold/40 bg-brand-gold/10 p-2.5 font-sans text-xs text-foreground">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden="true" />
          <span>
            A Receita indica situação <strong>{empresa.situacao_cadastral || "não ativa"}</strong>.
            Você pode continuar normalmente — nosso time confirma na conversa.
          </span>
        </p>
      )}
    </div>
  );
}
