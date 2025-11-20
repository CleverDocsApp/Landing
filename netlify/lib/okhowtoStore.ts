import { getStore } from "@netlify/blobs";

export type Video = {
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

export async function getAllOkHowToVideos(): Promise<Video[]> {
  try {
    const ns = process.env.BLOBS_NAMESPACE || "okhowto";
    const store = getStore({ name: ns });
    const data = await store.get("videos.json", { type: "json" });

    if (!data) {
      return [];
    }

    const list = Array.isArray(data) ? data : [];
    list.sort((a: any, b: any) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return list as Video[];
  } catch (err) {
    console.warn("[OkHowToStore] Blobs error:", (err as any)?.name || err);
    return [];
  }
}
