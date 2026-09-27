import type { ReactNode } from "react";

/** Cabeçalho padrão de cada etapa — mantém ritmo visual entre as telas. */
export function QuizStepShell({
  question,
  helper,
  children,
}: {
  question: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="font-display text-lg leading-snug text-foreground sm:text-xl md:text-2xl">
        {question}
      </h3>
      {helper && (
        <p className="mt-1 font-sans text-sm text-muted-foreground">{helper}</p>
      )}
      <div className="mt-4 md:mt-5">{children}</div>
    </div>
  );
}

/** Mensagem de erro sob um campo. */
export function FieldError({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-2 font-sans text-sm text-destructive">
      {children}
    </p>
  );
}
