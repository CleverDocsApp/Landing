export type OkVideo = {
  id: string;
  vimeoId?: string;
  title: string;
  description?: string;
  category?: string;
  duration?: number;
  h?: string;
  thumb?: string;
  thumbUrl?: string;
  createdAt?: number;
  updatedAt?: number;
  [k: string]: any;
};

export function ensureId(v: any): OkVideo {
  const vid = (v?.vimeoId ?? v?.vimeoid ?? '').toString().trim();
  const id =
    (v?.id != null && String(v.id).trim() !== '')
      ? String(v.id).trim()
      : (vid || '');

  const thumb = v?.thumb || v?.thumbUrl || '';
  const h = v?.h ? String(v.h).trim() : undefined;

  return { ...v, id, thumb, h };
}

export function normalizeList(arr: any[]): OkVideo[] {
  return (Array.isArray(arr) ? arr : []).map(ensureId);
}
