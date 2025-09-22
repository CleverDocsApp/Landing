// src/lib/api.ts
const isProdHost = typeof window !== 'undefined' && (
  window.location.host.endsWith('netlify.app') ||
  window.location.host.endsWith('onklinic.com') // ajusta si usas dominio final
);

// En Netlify prod usaremos same-origin (''); en Bolt/local usamos VITE_API_BASE
export const API_BASE = isProdHost ? '' : (import.meta.env.VITE_API_BASE ?? 'https://onkliniclp.netlify.app');

export async function postJSON<T = any>(path: string, body: unknown): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const ct = res.headers.get('content-type') || '';

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${url}: ${text.slice(0,200)}`);
  }

  if (!ct.includes('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error(`Respuesta no-JSON (ct=${ct}) desde ${url}: ${text.slice(0,200)}`);
  }

  return res.json();
}

export async function getJSON<T = any>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const ct = res.headers.get('content-type') || '';

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${url}: ${text.slice(0,200)}`);
  }

  if (!ct.includes('application/json')) {
    const text = await res.text().catch(() => '');
    throw new Error(`Respuesta no-JSON (ct=${ct}) desde ${url}: ${text.slice(0,200)}`);
  }

  return res.json();
}