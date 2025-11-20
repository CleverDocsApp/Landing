import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";
import { getAllDemoRequests } from "../lib/okhowtoStore";

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders(origin)
  };

  try {
    // Only allow GET requests
    if (req.method !== "GET") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers }
      );
    }

    // Get demo requests from blob storage
    const demosList = await getAllDemoRequests();

    return new Response(
      JSON.stringify({
        demos: demosList,
        count: demosList.length
      }),
      { status: 200, headers }
    );

  } catch (err) {
    console.error("[demo-requests] Error:", err);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch demo requests",
        details: err instanceof Error ? err.message : "Unknown error"
      }),
      { status: 500, headers }
    );
  }
};
