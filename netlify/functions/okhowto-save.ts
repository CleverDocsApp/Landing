import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";

type Video = {
  id?: string;
  vimeoId: string;
  title: string;
  description?: string;
  category?: string;
  duration?: number;
  thumbUrl: string;
  defaultCaptionLanguage?: string;
  captionLanguages?: string[] | string;
  createdAt?: number;
  updatedAt?: number;
};

function slugify(input = ""): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractVimeoId(raw: any): string {
  const candidates = [
    raw?.vimeoId,
    raw?.vimeoID,
    raw?.vimeo,
    raw?.id,
    raw?.url,
    raw?.vimeoUrl,
    raw?.link
  ]
    .map(v => (v ?? "").toString().trim())
    .filter(Boolean);

  for (const c of candidates) {
    if (/^\d+$/.test(c)) return c;
    const m = c.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
    if (m?.[1]) return m[1];
  }
  return "";
}

function normalize(v: any): Video {
  const extracted = extractVimeoId(v);
  const caption = v?.captionLanguages;
  const captionLanguages =
    Array.isArray(caption)
      ? caption.map((s) => String(s).trim()).filter(Boolean)
      : typeof caption === "string"
        ? caption.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

  const out: Video = {
    id: v?.id ? String(v.id).trim() : (extracted || ""),
    vimeoId: extracted,
    title: String(v?.title ?? "").trim(),
    description: String(v?.description ?? "").trim(),
    category: slugify(String(v?.category ?? "")),
    duration: Number(v?.duration ?? 0) || 0,
    thumbUrl: String(v?.thumbUrl ?? "").trim(),
    defaultCaptionLanguage: v?.defaultCaptionLanguage ? String(v?.defaultCaptionLanguage).trim() : undefined,
    captionLanguages,
    createdAt: v?.createdAt ? Number(v?.createdAt) : undefined,
    updatedAt: v?.updatedAt ? Number(v?.updatedAt) : undefined,
  };
  return out;
}

function validate(v: Video): string | null {
  if (!v.vimeoId || !/^\d+$/.test(v.vimeoId)) return "Missing or invalid vimeoId";
  if (!v.title) return "Missing title";
  if (!v.thumbUrl || !/^https?:\/\//i.test(v.thumbUrl)) return "Missing or invalid thumbUrl";
  return null;
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

  try {
    const ns = process.env.BLOBS_NAMESPACE || "okhowto";
    const store = getStore({ name: ns });

    const existing = (await store.get("videos.json", { type: "json" })) as any[] | null;
    let list: Video[] = Array.isArray(existing) ? existing : [];

    const now = Date.now();

    if (Array.isArray(payload)) {
      list = payload.map((p) => {
        const v = normalize(p);
        if (!v.createdAt) v.createdAt = now;
        v.updatedAt = now;
        return v;
      });
      await store.set("videos.json", JSON.stringify(list), { contentType: "application/json; charset=utf-8" });
      return new Response(JSON.stringify({ ok: true, mode: "replaceAll", count: list.length }), { status: 200, headers });
    }

    const item = normalize(payload);
    const errMsg = validate(item);
    if (errMsg) {
      return new Response(JSON.stringify({ code: "VALIDATION_ERROR", message: errMsg }), { status: 422, headers });
    }

    const idx = list.findIndex((x) => String(x.vimeoId) === String(item.vimeoId));
    if (idx >= 0) {
      const prev = list[idx];
      item.createdAt = prev.createdAt ?? now;
      item.updatedAt = now;
      list[idx] = { ...prev, ...item };
    } else {
      item.createdAt = now;
      item.updatedAt = now;
      list.push(item);
    }

    list.sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0));

    await store.set("videos.json", JSON.stringify(list), { contentType: "application/json; charset=utf-8" });

    return new Response(JSON.stringify({ ok: true, mode: "upsert", count: list.length, id: item.vimeoId }), { status: 200, headers });
  } catch (err: any) {
    if (String(err?.name) === "MissingBlobsEnvironmentError") {
      return new Response(JSON.stringify({
        code: "BLOBS_NOT_ENABLED",
        message: "Enable Netlify Blobs for this site, then clear cache & redeploy."
      }), { status: 503, headers });
    }
    console.error("[Save] ERROR:", err);
    return new Response(JSON.stringify({ code: "SAVE_ERROR", message: "Failed to save videos.json" }), { status: 500, headers });
  }
};
