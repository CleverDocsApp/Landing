import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...corsHeaders(origin)
  };

  try {
    const ns = process.env.BLOBS_NAMESPACE || "okhowto";
    const store = getStore({ name: ns });
    const data = await store.get("videos.json", { type: "json" });

    if (!data) {
      return new Response(JSON.stringify([]), { status: 200, headers });
    }

    const list = Array.isArray(data) ? data : [];
    list.sort((a: any, b: any) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return new Response(JSON.stringify(list), { status: 200, headers });
  } catch (err) {
    console.warn("[Feed] Blobs error:", (err as any)?.name || err);
    return new Response(JSON.stringify([]), { status: 200, headers });
  }
};
