import type { Handler, HandlerEvent } from '@netlify/functions';
import { validateOrigin, setCorsHeaders, handleCorsPrelight } from './utils/cors';
import { checkRateLimit } from './utils/rateLimit';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 300000;

export const handler: Handler = async (event: HandlerEvent) => {
  const origin = event.headers.origin || null;

  if (event.httpMethod === 'OPTIONS') {
    return handleCorsPrelight(origin);
  }

  if (!validateOrigin(origin)) {
    return {
      statusCode: 403,
      body: 'Forbidden: Invalid origin',
    };
  }

  const ip = event.headers['x-nf-client-connection-ip'] || event.headers['client-ip'] || 'unknown';
  if (!checkRateLimit(ip)) {
    return {
      statusCode: 429,
      headers: setCorsHeaders(origin),
      body: 'Rate limit exceeded. Please try again later.',
    };
  }

  const passphrase = event.headers['x-ok-pass'];
  const expectedPass = process.env.OKH_PASS;

  if (!passphrase || !expectedPass || passphrase !== expectedPass) {
    return {
      statusCode: 401,
      headers: setCorsHeaders(origin),
      body: 'Unauthorized: Invalid passphrase',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: setCorsHeaders(origin),
      body: 'Method not allowed',
    };
  }

  try {
    const contentType = event.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
      return {
        statusCode: 400,
        headers: setCorsHeaders(origin),
        body: 'Invalid content type. Expected multipart/form-data',
      };
    }

    const boundary = contentType.split('boundary=')[1];
    if (!boundary) {
      return {
        statusCode: 400,
        headers: setCorsHeaders(origin),
        body: 'Missing boundary in multipart data',
      };
    }

    const body = event.isBase64Encoded
      ? Buffer.from(event.body || '', 'base64')
      : Buffer.from(event.body || '', 'utf-8');

    const parts = parseMultipartForm(body, boundary);
    const filePart = parts.find((p) => p.name === 'thumb');

    if (!filePart || !filePart.data) {
      return {
        statusCode: 400,
        headers: setCorsHeaders(origin),
        body: 'No file uploaded with name "thumb"',
      };
    }

    if (!ALLOWED_MIME_TYPES.includes(filePart.contentType)) {
      return {
        statusCode: 400,
        headers: setCorsHeaders(origin),
        body: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
      };
    }

    if (filePart.data.length > MAX_FILE_SIZE) {
      return {
        statusCode: 413,
        headers: setCorsHeaders(origin),
        body: `File too large. Maximum size: ${MAX_FILE_SIZE} bytes (300KB)`,
      };
    }

    const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const cloudinaryUploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const cloudinaryFolder = process.env.CLOUDINARY_FOLDER || 'okhowto-thumbs';

    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
      return {
        statusCode: 500,
        headers: setCorsHeaders(origin),
        body: 'Server configuration error: Missing Cloudinary credentials',
      };
    }

    const formData = new FormData();
    const blob = new Blob([filePart.data], { type: filePart.contentType });
    formData.append('file', blob, filePart.filename || 'upload');
    formData.append('upload_preset', cloudinaryUploadPreset);
    formData.append('folder', cloudinaryFolder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;

    const uploadResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Cloudinary upload failed:', errorText);
      return {
        statusCode: 502,
        headers: setCorsHeaders(origin),
        body: 'Failed to upload to Cloudinary',
      };
    }

    const uploadResult = await uploadResponse.json();

    return {
      statusCode: 200,
      headers: {
        ...setCorsHeaders(origin),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: uploadResult.secure_url,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        publicId: uploadResult.public_id,
      }),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers: setCorsHeaders(origin),
      body: 'Internal server error',
    };
  }
};

interface MultipartPart {
  name: string;
  filename?: string;
  contentType: string;
  data: Buffer;
}

function parseMultipartForm(body: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const sections = splitBuffer(body, boundaryBuffer);

  for (const section of sections) {
    if (section.length === 0 || section.toString().trim() === '--') continue;

    const headerEndIndex = section.indexOf('\r\n\r\n');
    if (headerEndIndex === -1) continue;

    const headerSection = section.slice(0, headerEndIndex).toString();
    const dataSection = section.slice(headerEndIndex + 4);

    const nameMatch = headerSection.match(/name="([^"]+)"/);
    const filenameMatch = headerSection.match(/filename="([^"]+)"/);
    const contentTypeMatch = headerSection.match(/Content-Type:\s*(.+)/i);

    if (nameMatch) {
      parts.push({
        name: nameMatch[1],
        filename: filenameMatch ? filenameMatch[1] : undefined,
        contentType: contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream',
        data: dataSection.slice(0, dataSection.length - 2),
      });
    }
  }

  return parts;
}

function splitBuffer(buffer: Buffer, delimiter: Buffer): Buffer[] {
  const parts: Buffer[] = [];
  let start = 0;

  while (start < buffer.length) {
    const index = buffer.indexOf(delimiter, start);
    if (index === -1) {
      parts.push(buffer.slice(start));
      break;
    }
    parts.push(buffer.slice(start, index));
    start = index + delimiter.length;
  }

  return parts;
}
