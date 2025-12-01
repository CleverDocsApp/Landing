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

export type DemoRequest = {
  id: string;
  createdAt: string;
  source: string;
  name: string;
  email: string;
  role: string;
  team_size: number;
  timezone: string;
  preferred_slots: string[];
  notes: string;
  locale?: string;
};

export type ContactFormSubmission = {
  id: string;
  createdAt: string;
  source: string;
  name: string;
  email: string;
  organization?: string;
  role: string;
  interest: string;
  message: string;
  locale?: string;
  pagePath?: string;
  userAgent?: string;
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

export async function saveDemoRequest(request: Omit<DemoRequest, 'id' | 'createdAt' | 'source'>): Promise<DemoRequest> {
  try {
    const ns = process.env.DEMO_REQUESTS_NAMESPACE || "ok_demo_requests";
    const store = getStore({ name: ns });

    // Get existing demos list
    const existingData = await store.get("demos.json", { type: "json" });
    const demosList = Array.isArray(existingData) ? existingData : [];

    // Create new demo request
    const newDemo: DemoRequest = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      source: "landing-chat",
      ...request
    };

    // Add to list
    demosList.push(newDemo);

    // Save back to blob
    await store.setJSON("demos.json", demosList);

    return newDemo;
  } catch (err) {
    console.error("[OkHowToStore] Error saving demo request:", err);
    throw err;
  }
}

export async function getAllDemoRequests(): Promise<DemoRequest[]> {
  try {
    const ns = process.env.DEMO_REQUESTS_NAMESPACE || "ok_demo_requests";
    const store = getStore({ name: ns });
    const data = await store.get("demos.json", { type: "json" });

    if (!data) {
      return [];
    }

    const list = Array.isArray(data) ? data : [];
    list.sort((a: any, b: any) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return list as DemoRequest[];
  } catch (err) {
    console.warn("[OkHowToStore] Blobs error fetching demo requests:", (err as any)?.name || err);
    return [];
  }
}

export async function saveContactFormSubmission(submission: Omit<ContactFormSubmission, 'id' | 'createdAt'>): Promise<ContactFormSubmission> {
  try {
    const ns = process.env.CONTACT_FORMS_NAMESPACE || "ok_contact_forms";
    const store = getStore({ name: ns });

    const existingData = await store.get("contacts.json", { type: "json" });
    const contactsList = Array.isArray(existingData) ? existingData : [];

    const newContact: ContactFormSubmission = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...submission
    };

    contactsList.push(newContact);

    await store.setJSON("contacts.json", contactsList);

    return newContact;
  } catch (err) {
    console.error("[OkHowToStore] Error saving contact form submission:", err);
    throw err;
  }
}

export async function getAllContactFormSubmissions(): Promise<ContactFormSubmission[]> {
  try {
    const ns = process.env.CONTACT_FORMS_NAMESPACE || "ok_contact_forms";
    const store = getStore({ name: ns });
    const data = await store.get("contacts.json", { type: "json" });

    if (!data) {
      return [];
    }

    const list = Array.isArray(data) ? data : [];
    list.sort((a: any, b: any) => {
      const dateA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return list as ContactFormSubmission[];
  } catch (err) {
    console.warn("[OkHowToStore] Blobs error fetching contact form submissions:", (err as any)?.name || err);
    return [];
  }
}
