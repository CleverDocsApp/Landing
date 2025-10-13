import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 300000;

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const headers = { ...corsHeaders(origin) };

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ code: "METHOD_NOT_ALLOWED" }), {
      status: 405,
      headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
    });
  }

  const pass = req.headers.get("x-ok-pass") ?? "";
  if (!process.env.OKH_PASS || pass !== process.env.OKH_PASS) {
    return new Response(JSON.stringify({ code: "UNAUTHORIZED", message: "Invalid passphrase" }), {
      status: 401,
      headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
    });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: "Expected multipart/form-data" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
      });
    }

    const formData = await req.formData();
    const fileEntry = formData.get("thumb");

    if (!fileEntry || !(fileEntry instanceof File)) {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: "No file uploaded with name 'thumb'" }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
      });
    }

    if (!ALLOWED_MIME_TYPES.includes(fileEntry.type)) {
      return new Response(JSON.stringify({ code: "BAD_REQUEST", message: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}` }), {
        status: 400,
        headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
      });
    }

    if (fileEntry.size > MAX_FILE_SIZE) {
      return new Response(JSON.stringify({ code: "FILE_TOO_LARGE", message: `File too large. Maximum size: ${MAX_FILE_SIZE} bytes (300KB)` }), {
        status: 413,
        headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
      });
    }

    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryFolder = process.env.CLOUDINARY_FOLDER;

    if (!cloudinaryCloudName || !cloudinaryUploadPreset || !cloudinaryFolder) {
      const missing = [];
      if (!cloudinaryCloudName) missing.push('CLOUDINARY_CLOUD_NAME');
      if (!cloudinaryUploadPreset) missing.push('CLOUDINARY_UPLOAD_PRESET');
      if (!cloudinaryFolder) missing.push('CLOUDINARY_FOLDER');
      return new Response(JSON.stringify({
        code: "CONFIG_ERROR",
        message: `Missing configuration: ${missing.join(', ')}`
      }), {
        status: 500,
        headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
      });
    }

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', fileEntry);
    cloudinaryFormData.append('upload_preset', cloudinaryUploadPreset);
    cloudinaryFormData.append('folder', cloudinaryFolder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
    const uploadResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[Upload] Cloudinary error:', uploadResponse.status, errorText);
      return new Response(JSON.stringify({
        code: "UPLOAD_FAILED",
        message: `Cloudinary upload failed: ${uploadResponse.status}`
      }), {
        status: 502,
        headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
      });
    }

    const uploadResult = await uploadResponse.json();
    return new Response(JSON.stringify({
      url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      publicId: uploadResult.public_id,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
    });
  } catch (error: any) {
    console.error('[Upload] Error:', error);
    return new Response(JSON.stringify({
      code: "INTERNAL_ERROR",
      message: error?.message || "Upload failed"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
    });
  }
};
