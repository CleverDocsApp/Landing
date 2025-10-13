import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";

type Video = {
  id: string;
  vimeoId: string;
  title: string;
  description?: string;
  category?: string;
  duration?: number;
  h?: string;
  thumbUrl: string;
  defaultCaptionLanguage?: string;
  captionLanguages?: string[] | string;
  createdAt: string;
  updatedAt: string;
};

async function deleteWithRetry(store: any, list: Video[], maxRetries: number = 1): Promise<void> {
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const metadata = await store.getMetadata("videos.json");
      const etag = metadata?.etag;

      await store.set("videos.json", JSON.stringify(list), {
        contentType: "application/json; charset=utf-8",
        metadata: etag ? { etag } : undefined
      });

      return;
    } catch (err: any) {
      if (err?.status === 412 && attempt < maxRetries) {
        attempt++;
        const freshData = await store.get("videos.json", { type: "json" });
        list = Array.isArray(freshData) ? freshData : list;
        continue;
      }
      throw err;
    }
  }
}

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

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ code: "BAD_JSON", message: "Invalid JSON body" }), { status: 400, headers });
  }

  if (!payload.id) {
    return new Response(JSON.stringify({ code: "MISSING_ID", message: "Video ID is required" }), { status: 400, headers });
  }

  try {
    const ns = process.env.BLOBS_NAMESPACE || "okhowto";
    const store = getStore({ name: ns });

    const existing = (await store.get("videos.json", { type: "json" })) as any[] | null;
    let list: Video[] = Array.isArray(existing) ? existing : [];

    const idx = list.findIndex((x) => x.id === payload.id);
    if (idx < 0) {
      return new Response(JSON.stringify({
        code: "NOT_FOUND",
        message: `Video with id ${payload.id} not found`
      }), { status: 404, headers });
    }

    const deletedVideo = list[idx];
    list.splice(idx, 1);

    await deleteWithRetry(store, list);

    return new Response(JSON.stringify({
      ok: true,
      message: "Video deleted successfully",
      deletedVideo
    }), { status: 200, headers });
  } catch (err: any) {
    if (String(err?.name) === "MissingBlobsEnvironmentError") {
      return new Response(JSON.stringify({
        code: "BLOBS_NOT_ENABLED",
        message: "Enable Netlify Blobs for this site, then clear cache & redeploy."
      }), { status: 503, headers });
    }
    console.error("[Delete] ERROR:", err);
    return new Response(JSON.stringify({
      code: "DELETE_ERROR",
      message: "Failed to delete video",
      details: err?.message
    }), { status: 500, headers });
  }
};
