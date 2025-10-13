import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";

const MAX_BYTES = 300 * 1024;

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const baseHeaders = { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) };

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ code: "METHOD_NOT_ALLOWED", message: "Use POST" }), {
      status: 405, headers: baseHeaders
    });
  }

  const pass = req.headers.get("x-ok-pass") ?? "";
  if (!process.env.OKH_PASS || pass !== process.env.OKH_PASS) {
    return new Response(JSON.stringify({ code: "UNAUTHORIZED", message: "Invalid passphrase" }), {
      status: 401, headers: baseHeaders
    });
  }

  try {
    const form = await req.formData();
    const blob = form.get("thumb");

    if (!blob || typeof blob === "string") {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: "Expected multipart field 'thumb' with a file" }), {
        status: 400, headers: baseHeaders
      });
    }

    const size = (blob as Blob).size ?? 0;
    if (size > MAX_BYTES) {
      return new Response(JSON.stringify({ code: "PAYLOAD_TOO_LARGE", message: "Thumbnail must be ≤ 300KB" }), {
        status: 413, headers: baseHeaders
      });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const folder = process.env.CLOUDINARY_FOLDER || "";

    if (!cloudName || !uploadPreset) {
      return new Response(JSON.stringify({
        code: "CONFIG_MISSING",
        message: "Missing CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET"
      }), { status: 500, headers: baseHeaders });
    }

    const up = new FormData();
    up.append("file", blob as Blob, "thumb");
    up.append("upload_preset", uploadPreset);
    if (folder) up.append("folder", folder);

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
      method: "POST",
      body: up
    });

    const data = await cloudRes.json();

    if (!cloudRes.ok) {
      const msg = data?.error?.message || "Upload failed";
      return new Response(JSON.stringify({ code: "CLOUDINARY_ERROR", message: msg }), {
        status: 502, headers: baseHeaders
      });
    }

    const { secure_url, width, height, format, bytes } = data;
    return new Response(JSON.stringify({
      ok: true,
      url: secure_url,
      width, height, format, bytes
    }), { status: 200, headers: baseHeaders });

  } catch (err: any) {
    return new Response(JSON.stringify({
      code: "INTERNAL_ERROR",
      message: String(err?.message || err)
    }), { status: 500, headers: baseHeaders });
  }
};
