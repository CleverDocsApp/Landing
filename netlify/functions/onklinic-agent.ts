import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";
import { runWorkflow } from "../../src/agents/onklinicAgent";

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders(origin)
  };

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
    const { message } = body;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid message format" }),
        { status: 400, headers }
      );
    }

    console.log("[onklinic-agent] Processing message:", message.substring(0, 100));

    // Call the agent workflow
    const result = await runWorkflow({ input_as_text: message });

    console.log("[onklinic-agent] Agent response received");

    // Return the reply
    return new Response(
      JSON.stringify({ reply: result.output_text }),
      { status: 200, headers }
    );

  } catch (err) {
    console.error("[onklinic-agent] Error:", err);

    return new Response(
      JSON.stringify({
        error: "Failed to process your request. Please try again.",
        details: err instanceof Error ? err.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};
