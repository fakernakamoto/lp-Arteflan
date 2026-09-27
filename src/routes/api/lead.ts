import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Schema v2.0 do lead — valida campos críticos, aceita campos extras via passthrough.
 * Isso permite evoluir o payload do quiz sem ter que atualizar o server a cada campo novo.
 */
const leadSchema = z
  .object({
    // Identidade do evento
    schema_version: z.string(),
    form_name: z.string(),
    lead_id: z.string().min(1),
    event_id: z.string().min(1),
    created_at: z.string(),

    // Identificação do lead
    tipo_pessoa: z.enum(["PJ", "PF", ""]),
    nome_responsavel: z.string().min(2).max(120),
    whatsapp: z.string().min(8).max(30),
    whatsapp_digits: z.string().min(10).max(15),
    whatsapp_e164: z.string().max(20),
    email: z.string().max(180),
    consentimento_contato: z.literal(true),

    // Qualificação calculada
    lead_score: z.number().min(0).max(100),
    classificacao: z.string().max(40),

    // Tracking (todos opcionais com max length)
    utm_source: z.string().max(200).optional().default(""),
    utm_medium: z.string().max(200).optional().default(""),
    utm_campaign: z.string().max(200).optional().default(""),
    utm_content: z.string().max(200).optional().default(""),
    utm_term: z.string().max(200).optional().default(""),
    gclid: z.string().max(400).optional().default(""),
    gbraid: z.string().max(400).optional().default(""),
    wbraid: z.string().max(400).optional().default(""),
    fbclid: z.string().max(400).optional().default(""),
    fbp: z.string().max(200).optional().default(""),
    fbc: z.string().max(400).optional().default(""),
    page_url: z.string().max(1000).optional().default(""),
    referrer: z.string().max(1000).optional().default(""),
    user_agent: z.string().max(500).optional().default(""),
    submitted_at: z.string().max(40).optional().default(""),
    timezone: z.string().max(80).optional().default(""),
  })
  .passthrough(); // Aceita campos adicionais (empresa, CNPJ, scoring detalhado, etc.)

export const Route = createFileRoute("/api/lead")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
        }

        const parsed = leadSchema.safeParse(body);
        if (!parsed.success) {
          const fields = parsed.error.issues.map((i) => i.path.join("."));
          console.warn("lead validation failed", { fields });
          return Response.json({ ok: false, error: "invalid_payload" }, { status: 422 });
        }

        const webhookUrl = process.env["MAKE_ARTEFLAN_WEBHOOK_URL"]?.trim();
        if (!webhookUrl) {
          console.error("lead webhook is not configured");
          return Response.json({ ok: false, error: "server_not_configured" }, { status: 500 });
        }

        let upstream: Response;
        try {
          upstream = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
          });
        } catch {
          console.error("lead webhook request failed", {
            submission_id: parsed.data.lead_id,
          });
          return Response.json({ ok: false, error: "upstream_unreachable" }, { status: 502 });
        }

        if (!upstream.ok) {
          console.error("lead webhook non-2xx", {
            status: upstream.status,
            submission_id: parsed.data.lead_id,
          });
          return Response.json({ ok: false, error: "upstream_error" }, { status: 502 });
        }

        return Response.json({
          ok: true,
          event_id: parsed.data.event_id,
          lead_id: parsed.data.lead_id,
        });
      },
    },
  },
});
