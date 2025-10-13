import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const headers = { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) };

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ code: "METHOD_NOT_ALLOWED", message: "Use POST" }), { status: 405, headers });
  }

  const pass = req.headers.get("x-ok-pass") ?? "";
  if (!process.env.OKH_PASS || pass !== process.env.OKH_PASS) {
    return new Response(JSON.stringify({ code: "UNAUTHORIZED", message: "Invalid passphrase" }), { status: 401, headers });
  }

  try {
    const ns = process.env.BLOBS_NAMESPACE || "okhowto";
    const store = getStore({ name: ns });
    const body = await req.json();
    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: "Expected JSON array of videos" }), { status: 400, headers });
    }
    await store.set("videos.json", JSON.stringify(body), {
      contentType: "application/json; charset=utf-8",
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (err: any) {
    if (String(err?.name) === "MissingBlobsEnvironmentError") {
      return new Response(JSON.stringify({
        code: "BLOBS_NOT_ENABLED",
        message: "Enable Netlify Blobs for this site, then clear cache & redeploy."
      }), { status: 503, headers });
    }
    return new Response(JSON.stringify({ code: "SAVE_ERROR", message: "Failed to save videos.json" }), { status: 500, headers });
  }
};
