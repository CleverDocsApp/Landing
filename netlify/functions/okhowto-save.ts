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

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

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

function normalize(v: any, isUpdate: boolean = false): Partial<Video> {
  const extracted = extractVimeoId(v);
  const caption = v?.captionLanguages;
  const captionLanguages =
    Array.isArray(caption)
      ? caption.map((s) => String(s).trim()).filter(Boolean)
      : typeof caption === "string"
        ? caption.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

  const privacyHash = v?.h ? String(v.h).trim() : undefined;

  const out: Partial<Video> = {
    vimeoId: extracted,
    title: String(v?.title ?? "").trim(),
    description: String(v?.description ?? "").trim(),
    category: slugify(String(v?.category ?? "")),
    duration: Number(v?.duration ?? 0) || 0,
    h: privacyHash,
    thumbUrl: String(v?.thumbUrl ?? "").trim(),
    defaultCaptionLanguage: v?.defaultCaptionLanguage ? String(v?.defaultCaptionLanguage).trim() : undefined,
    captionLanguages,
  };

  if (isUpdate && v?.id) {
    out.id = String(v.id).trim();
  }

  return out;
}

function validate(v: Partial<Video>): string | null {
  if (!v.vimeoId || !/^\d+$/.test(v.vimeoId)) return "Missing or invalid vimeoId";
  if (!v.title) return "Missing title";
  if (!v.thumbUrl || !/^https?:\/\//i.test(v.thumbUrl)) return "Missing or invalid thumbUrl";
  return null;
}

async function saveWithRetry(store: any, list: Video[], maxRetries: number = 1): Promise<void> {
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

  try {
    const ns = process.env.BLOBS_NAMESPACE || "okhowto";
    const store = getStore({ name: ns });

    const existing = (await store.get("videos.json", { type: "json" })) as any[] | null;
    let list: Video[] = Array.isArray(existing) ? existing : [];

    const now = new Date().toISOString();

    if (Array.isArray(payload)) {
      return new Response(JSON.stringify({
        code: "BULK_NOT_SUPPORTED",
        message: "Bulk operations not supported. Use individual CREATE or UPDATE."
      }), { status: 400, headers });
    }

    const isUpdate = !!payload.id;
    const itemData = normalize(payload, isUpdate);

    const errMsg = validate(itemData);
    if (errMsg) {
      return new Response(JSON.stringify({ code: "VALIDATION_ERROR", message: errMsg }), { status: 422, headers });
    }

    let savedVideo: Video;

    if (isUpdate) {
      const idx = list.findIndex((x) => x.id === payload.id);
      if (idx < 0) {
        return new Response(JSON.stringify({
          code: "NOT_FOUND",
          message: `Video with id ${payload.id} not found`
        }), { status: 404, headers });
      }

      const existingVideo = list[idx];
      savedVideo = {
        ...existingVideo,
        ...itemData,
        id: existingVideo.id,
        createdAt: existingVideo.createdAt,
        updatedAt: now
      } as Video;

      list[idx] = savedVideo;
    } else {
      const newId = generateUUID();
      savedVideo = {
        ...itemData,
        id: newId,
        createdAt: now,
        updatedAt: now
      } as Video;

      list.push(savedVideo);
    }

    list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    await saveWithRetry(store, list);

    return new Response(JSON.stringify({
      ok: true,
      mode: isUpdate ? "UPDATE" : "CREATE",
      video: savedVideo
    }), { status: 200, headers });
  } catch (err: any) {
    if (String(err?.name) === "MissingBlobsEnvironmentError") {
      return new Response(JSON.stringify({
        code: "BLOBS_NOT_ENABLED",
        message: "Enable Netlify Blobs for this site, then clear cache & redeploy."
      }), { status: 503, headers });
    }
    console.error("[Save] ERROR:", err);
    return new Response(JSON.stringify({
      code: "SAVE_ERROR",
      message: "Failed to save videos.json",
      details: err?.message
    }), { status: 500, headers });
  }
};
