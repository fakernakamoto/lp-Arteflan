/**
 * ContactQuiz — container do fluxo de cotação da Arteflan.
 *
 * Fluxo condicional PJ/PF com scoring inteligente.
 * Preserva: visual, tracking, persistência, webhook, WhatsApp.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { QuizProgress } from "./quiz/QuizProgress";
import { QuizNavigation } from "./quiz/QuizNavigation";
import { QuizLoadingState } from "./quiz/QuizLoadingState";
import { QuizSuccessState } from "./quiz/QuizSuccessState";
import { QuizStepTransition } from "./quiz/QuizStepTransition";

import { PerfilStep } from "./quiz/steps/PerfilStep";
import { DocumentoStep } from "./quiz/steps/DocumentoStep";
import { FinalidadeStep } from "./quiz/steps/FinalidadeStep";
import { NecessidadeStep } from "./quiz/steps/NecessidadeStep";
import { PrazoStep } from "./quiz/steps/PrazoStep";
import { LocalizacaoStep } from "./quiz/steps/LocalizacaoStep";
import { ContatoStep } from "./quiz/steps/ContatoStep";

import {
  buildFlow,
  validateStep,
  resetDependentes,
  AUTO_ADVANCE,
  STEP_NAMES,
  type StepId,
} from "./quiz/quizFlow";

import {
  EMPTY_ANSWERS,
  perfilByValue,
  type FinalidadeCompra,
  type PrazoCompra,
  type QuizAnswers,
} from "@/types/quizLead";

import { buildLeadPayload, buildWhatsAppText, QUIZ_FORM_NAME, newId } from "@/lib/quiz/leadPayload";
import { buildCapiUserData, fbEventId, fbInitWithUserData, fbTrack, hashUserData } from "@/lib/fbpixel";
import { adsConversion, gaEvent } from "@/lib/analytics";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { buildArteflanWhatsAppUrl } from "@/lib/whatsapp";

const DRAFT_KEY = "arteflan_quiz_draft_v2";

type Draft = { stepIdx: number; answers: QuizAnswers; ts: string };

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    if (!d?.answers || typeof d.stepIdx !== "number") return null;
    return { ...d, answers: { ...EMPTY_ANSWERS, ...d.answers } };
  } catch {
    return null;
  }
}

type ContactQuizProps = { standalone?: boolean };

export function ContactQuiz({ standalone = false }: ContactQuizProps) {
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitting, setSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showStepTransition, setShowStepTransition] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [waUrl, setWaUrl] = useState("");
  const [hydrated, setHydrated] = useState(false);

  const submittingRef = useRef(false);
  const startedRef = useRef(false);
  const viewedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const reduced = usePrefersReducedMotion();

  const addTimer = useCallback((t: ReturnType<typeof setTimeout>) => {
    timersRef.current.push(t);
  }, []);

  useEffect(() => () => { timersRef.current.forEach(clearTimeout); }, []);

  // ─── Fluxo dinâmico ───────────────────────────────────────────────────────
  const flow = useMemo(() => buildFlow(answers), [answers]);
  const currentStep: StepId = flow[stepIdx] ?? "perfil";
  const totalSteps = flow.length;
  const isLast = stepIdx === totalSteps - 1;

  // ─── Hydration / Draft ────────────────────────────────────────────────────
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setAnswers(draft.answers);
      const restoredFlow = buildFlow(draft.answers);
      setStepIdx(Math.min(draft.stepIdx, restoredFlow.length - 1));
      startedRef.current = true;
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || success) return;
    try {
      const d: Draft = { stepIdx, answers, ts: new Date().toISOString() };
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(d));
    } catch { /* quota */ }
  }, [stepIdx, answers, hydrated, success]);

  // ─── Tracking ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = cardRef.current;
    if (!el || viewedRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !viewedRef.current) {
          viewedRef.current = true;
          gaEvent("quiz_view", { form_name: QUIZ_FORM_NAME });
          obs.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    gaEvent("quiz_step_view", {
      form_name: QUIZ_FORM_NAME,
      step_number: stepIdx + 1,
      step_name: STEP_NAMES[currentStep],
    });
  }, [stepIdx, hydrated, currentStep]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const markStarted = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    gaEvent("quiz_start", { form_name: QUIZ_FORM_NAME });
  }, []);

  const patch = useCallback((p: Partial<QuizAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...p }));
    setError(null);
  }, []);

  const scrollToCard = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  // ─── Navegação ────────────────────────────────────────────────────────────
  const goNext = useCallback(
    (fromAuto = false) => {
      const a = answersRef.current;
      const latestFlow = buildFlow(a);
      const step = latestFlow[stepIdx] ?? "perfil";
      const err = validateStep(step, a);
      if (err) {
        setError(err);
        gaEvent("quiz_validation_error", {
          form_name: QUIZ_FORM_NAME,
          step_number: stepIdx + 1,
          step_name: STEP_NAMES[step],
        });
        return;
      }
      gaEvent("quiz_step_complete", {
        form_name: QUIZ_FORM_NAME,
        step_number: stepIdx + 1,
        step_name: STEP_NAMES[step],
      });
      setError(null);
      setDirection(1);
      setStepIdx((i) => Math.min(i + 1, latestFlow.length - 1));
      if (!fromAuto) scrollToCard();
      else addTimer(setTimeout(scrollToCard, 60));
    },
    [stepIdx, scrollToCard, addTimer],
  );

  const goBack = useCallback(() => {
    setError(null);
    setDirection(-1);
    setStepIdx((i) => Math.max(0, i - 1));
    gaEvent("quiz_back", { form_name: QUIZ_FORM_NAME, step_number: stepIdx + 1 });
    scrollToCard();
  }, [stepIdx, scrollToCard]);

  // Ref estável para auto-advance timers
  const goNextRef = useRef(() => goNext(true));
  useEffect(() => { goNextRef.current = () => goNext(true); }, [goNext]);

  const autoAdvance = useCallback(
    (p: Partial<QuizAnswers>) => {
      markStarted();
      patch(p);
      setShowStepTransition(true);
      addTimer(setTimeout(() => {
        setShowStepTransition(false);
        goNextRef.current();
      }, 750));
    },
    [markStarted, patch, addTimer],
  );

  // ─── Submit ───────────────────────────────────────────────────────────────
  const trackConversionsOnce = useCallback(
    (submissionId: string, eventId: string, hashed: { em?: string; ph?: string }) => {
      const key = `arteflan_conversion_tracked_${submissionId}`;
      try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch { /* */ }
      try {
        fbInitWithUserData(hashed);
        fbTrack("Lead", { source: "contact_quiz" }, { eventID: eventId });
      } catch { /* */ }
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "generate_lead", form_name: QUIZ_FORM_NAME, page_location: window.location.href, event_id: submissionId });
        gaEvent("generate_lead", { form_name: QUIZ_FORM_NAME, value: 1, currency: "BRL", event_id: submissionId });
        adsConversion({ value: 1, currency: "BRL", transaction_id: eventId });
      } catch { /* */ }
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    const a = answersRef.current;
    const err = validateStep("contato", a);
    if (err) {
      setError(err);
      gaEvent("quiz_validation_error", { form_name: QUIZ_FORM_NAME, step_number: totalSteps, step_name: "contato" });
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitFailed(false);
    setError(null);
    gaEvent("quiz_submit_attempt", { form_name: QUIZ_FORM_NAME });

    const loaderTimer = setTimeout(() => setShowLoader(true), 150);
    addTimer(loaderTimer);

    const eventId = fbEventId();
    const submissionId = newId("sub");
    const hashed = await hashUserData(a.email, a.whatsapp).catch(() => ({}) as { em?: string; ph?: string });
    const payload = buildLeadPayload(a, { submissionId, eventId });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("lead_submission_failed");
    } catch {
      clearTimeout(loaderTimer);
      setShowLoader(false);
      setSubmitting(false);
      submittingRef.current = false;
      setSubmitFailed(true);
      gaEvent("quiz_submit_error", { form_name: QUIZ_FORM_NAME });
      return;
    }

    clearTimeout(loaderTimer);
    trackConversionsOnce(submissionId, eventId, hashed);
    try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* */ }

    const url = buildArteflanWhatsAppUrl(buildWhatsAppText(a));
    setWaUrl(url);
    setSuccess(true);
    setShowLoader(false);
    setSubmitting(false);
    submittingRef.current = false;
    addTimer(setTimeout(() => window.location.assign(url), 4500));
  }, [totalSteps, addTimer, trackConversionsOnce]);

  // ─── Step handlers ────────────────────────────────────────────────────────
  const handlePerfilSelect = useCallback((value: string) => {
    const perfil = perfilByValue(value);
    if (!perfil) return;
    const reset = resetDependentes(answers, perfil.tipo_pessoa);
    const updates: Partial<QuizAnswers> = {
      ...reset,
      perfil_entrada: value,
      tipo_pessoa: perfil.tipo_pessoa,
      precisa_finalidade: false,
    };
    if (perfil.segmento) updates.segmento_empresa = perfil.segmento;
    if (perfil.finalidade) updates.finalidade_compra = perfil.finalidade;
    autoAdvance(updates);
  }, [answers, autoAdvance]);

  const handleSemCnpj = useCallback(() => {
    patch({
      tipo_pessoa: "PF",
      precisa_finalidade: true,
      cnpj: "",
      empresa: null,
      empresa_manual: "",
      segmento_empresa: "",
    });
  }, [patch]);

  const handleFinalidadeSelect = useCallback((value: FinalidadeCompra) => {
    autoAdvance({ finalidade_compra: value });
  }, [autoAdvance]);

  const handlePrazoSelect = useCallback((value: PrazoCompra) => {
    autoAdvance({ prazo_compra: value });
  }, [autoAdvance]);

  const handleConfirmRegiao = useCallback(() => {
    // Confirmar região auto-avança
    addTimer(setTimeout(() => goNextRef.current(), 300));
  }, [addTimer]);

  // ─── Render step ──────────────────────────────────────────────────────────
  const renderStep = () => {
    try {
      switch (currentStep) {
        case "perfil":
          return <PerfilStep answers={answers} onSelect={handlePerfilSelect} />;
        case "documento":
          return <DocumentoStep answers={answers} patch={patch} onSemCnpj={handleSemCnpj} />;
        case "finalidade":
          return <FinalidadeStep answers={answers} onSelect={handleFinalidadeSelect} />;
        case "necessidade":
          return <NecessidadeStep answers={answers} patch={patch} />;
        case "prazo":
          return <PrazoStep answers={answers} onSelect={handlePrazoSelect} />;
        case "local":
          return <LocalizacaoStep answers={answers} patch={patch} onConfirmRegiao={handleConfirmRegiao} />;
        case "contato":
          return <ContatoStep answers={answers} patch={patch} />;
        default:
          return <PerfilStep answers={answers} onSelect={handlePerfilSelect} />;
      }
    } catch {
      return (
        <div className="py-8 text-center">
          <p className="text-sm text-muted-foreground">Erro ao carregar etapa. Tente voltar.</p>
        </div>
      );
    }
  };

  // ─── Motion ───────────────────────────────────────────────────────────────
  const motionProps = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: direction === 1 ? 16 : -16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: direction === 1 ? -12 : 12 },
      };

  // Determine if "Continuar" button should show
  const showContinue = !AUTO_ADVANCE.has(currentStep) || isLast;

  // ─── Card JSX ─────────────────────────────────────────────────────────────
  const quizCard = (
    <div
      ref={cardRef}
      className="glass-card relative mx-auto w-full max-w-[820px] overflow-hidden rounded-[1.75rem] border border-brand-brown/12 p-5 shadow-soft sm:p-7 md:p-9"
    >
      {showLoader && !success && <QuizLoadingState />}

      {success ? (
        <QuizSuccessState waUrl={waUrl} />
      ) : (
        <>
          <QuizProgress step={stepIdx + 1} total={totalSteps} />

          <AnimatePresence mode="wait">
            {showStepTransition && <QuizStepTransition visible />}
          </AnimatePresence>

          <motion.div
            layout={!reduced}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-6"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep + stepIdx}
                {...motionProps}
                transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
                aria-current="step"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {error && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 p-3 font-sans text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </p>
          )}

          {submitFailed && (
            <div role="alert" className="mt-4 rounded-xl border border-destructive/30 bg-destructive/8 p-4 font-sans text-sm text-foreground">
              <p>Não conseguimos enviar sua solicitação agora. Seus dados continuam preenchidos. Tente novamente.</p>
              <Button type="button" className="mt-3 min-h-11" onClick={handleSubmit}>
                Tentar novamente
              </Button>
            </div>
          )}

          <QuizNavigation
            canGoBack={stepIdx > 0}
            isLast={isLast}
            submitting={submitting}
            showContinue={showContinue}
            onBack={goBack}
            onNext={isLast ? handleSubmit : () => goNext()}
          />
        </>
      )}
    </div>
  );

  if (standalone) return quizCard;

  return (
    <section id="quiz-cotacao" className="section-y scroll-mt-20 bg-muted/50 md:scroll-mt-24">
      <div className="container-page">
        <div className="mt-10">{quizCard}</div>
      </div>
    </section>
  );
}
