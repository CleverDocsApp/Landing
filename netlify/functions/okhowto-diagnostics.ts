import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import { corsHeaders, preflight, isAllowedOrigin } from "./utils/cors";

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const headers = { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) };

  const result: any = {
    ok: true,
    env: {
      BLOBS_NAMESPACE: !!process.env.BLOBS_NAMESPACE,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_UPLOAD_PRESET: !!process.env.CLOUDINARY_UPLOAD_PRESET,
      CLOUDINARY_FOLDER: !!process.env.CLOUDINARY_FOLDER,
      OKH_PASS: !!process.env.OKH_PASS && (process.env.OKH_PASS!.length >= 8),
      ALLOWED_ORIGINS_count: (process.env.ALLOWED_ORIGINS || "").split(",").map(s=>s.trim()).filter(Boolean).length
    },
    cors: {
      origin: origin ?? null,
      mode: origin ? "cors" : "same-origin",
      allowed: isAllowedOrigin(origin)
    },
    blobs: {
      namespace: process.env.BLOBS_NAMESPACE || "okhowto",
      videosKeyExists: false
    },
    notes: "No secret values are returned."
  };

  try {
    const store = getStore({ name: result.blobs.namespace });
    const data = await store.get("videos.json", { type: "json" });
    result.blobs.videosKeyExists = !!data;
  } catch (err: any) {
    result.blobs.error = String(err?.name || err);
  }

  return new Response(JSON.stringify(result), { status: 200, headers });
};
