import type { Context } from "@netlify/functions";
import type { AgentInputItem } from "@openai/agents";
import { corsHeaders, preflight } from "./utils/cors";
import { runWorkflow } from "../../src/agents/onklinicAgent";

type ChatMessage = { role: "user" | "assistant"; content: string };

function detectLanguageFromText(text: string): "es" | "en" {
  const lowered = text.toLowerCase();

  const spanishHints = [" qué ", " que ", " cómo", " como", "hola", "gracias", "documentación", "clínica", "nota", "paciente", "equipo", "semana", "horas"];
  if (spanishHints.some(h => lowered.includes(h) || lowered.startsWith(h.trim()))) {
    return "es";
  }

  return "en";
}

const coffeeRateLimitMessagesEs = [
  "Creo que todavía no he tomado suficiente café para tantas preguntas a la vez. Intenta de nuevo en unos segundos; tu información sigue a salvo.",
  "Wow, esto es más tráfico que una sala de espera un lunes sin café. Dame un respiro de unos segundos y vuelve a intentar; no se perdió nada de lo que escribiste.",
  "Mi motor interno de café llegó al límite por un momento. Tu mensaje está guardado, solo vuelve a intentarlo en unos segundos.",
  "Necesito un sorbo más de café antes de seguir con tantas solicitudes. Nada se ha perdido; prueba de nuevo en un momento.",
  "Parece que me llegaron preguntas más rápido que la cafetera. Tu info está segura, inténtalo de nuevo en unos segundos."
];

const coffeeRateLimitMessagesEn = [
  "I think I haven't had enough coffee for this many questions at once. Try again in a few seconds — none of your information was lost.",
  "Wow, that's more traffic than a Monday waiting room with no coffee. Give me a brief moment and try again; everything you wrote is still safe.",
  "My internal coffee engine just hit its limit for a second. Your message is saved — just try again in a few moments.",
  "I need one more sip of coffee before handling this many requests. Nothing was lost; please try again shortly.",
  "It looks like questions arrived faster than the coffee machine. Your info is safe; try again in a few seconds."
];

function getRandomCoffeeMessage(lang: "es" | "en"): string {
  const pool = lang === "es" ? coffeeRateLimitMessagesEs : coffeeRateLimitMessagesEn;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders(origin)
  };

  let lastUserLanguage: "es" | "en" = "es";

  try {
    // Validate OPENAI_API_KEY is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error("[onklinic-agent] OPENAI_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "Agent service is not configured properly" }),
        { status: 500, headers }
      );
    }

    // Parse request body
    const body = await req.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers }
      );
    }

    // Detect language from last user message
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage && typeof lastUserMessage.content === "string") {
      lastUserLanguage = detectLanguageFromText(lastUserMessage.content);
    }

    console.log("[onklinic-agent] Processing conversation with", messages.length, "messages");

    // Map to agent format
    const agentMessages: AgentInputItem[] = messages.map((m) => {
      const contentType =
        m.role === "assistant"
          ? "output_text"
          : "input_text";

      return {
        role: m.role,
        content: [
          {
            type: contentType,
            text: m.content,
          },
        ],
      };
    });

    // Call the agent workflow with full conversation history
    const result = await runWorkflow({ messages: agentMessages });

    console.log("[onklinic-agent] Agent response received");

    // Return the reply
    return new Response(
      JSON.stringify({ reply: result.output_text }),
      { status: 200, headers }
    );

  } catch (err) {
    console.error("[onklinic-agent] Error:", err);

    // Check for rate limit error
    const isRateLimitError =
      (err && typeof err === "object" && "code" in err && err.code === "rate_limit_exceeded") ||
      (err && typeof err === "object" && "status" in err && err.status === 429);

    if (isRateLimitError) {
      const reply = getRandomCoffeeMessage(lastUserLanguage);

      return new Response(
        JSON.stringify({ reply }),
        { status: 429, headers }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process your request. Please try again.",
        details: err instanceof Error ? err.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};
