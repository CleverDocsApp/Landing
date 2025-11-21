import type { Context } from "@netlify/functions";
import type { AgentInputItem } from "@openai/agents";
import { corsHeaders, preflight } from "./utils/cors";
import { runWorkflow } from "../../src/agents/onklinicAgent";

type ChatMessage = { role: "user" | "assistant"; content: string };

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
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "No messages provided" }),
        { status: 400, headers }
      );
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

    return new Response(
      JSON.stringify({
        error: "Failed to process your request. Please try again.",
        details: err instanceof Error ? err.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};
