import React, { useEffect, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";

const OnKlinicAgentChat: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const existing = window.localStorage.getItem("onklinic-user-id");
    if (existing) {
      setUserId(existing);
    } else {
      const id = `web-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem("onklinic-user-id", id);
      setUserId(id);
    }
  }, []);

  const { control } = useChatKit({
    api: {
      async getClientSecret(currentSecret) {
        try {
          const res = await fetch("/.netlify/functions/chatkit-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });

          if (!res.ok) {
            const text = await res.text();
            console.error("chatkit-session error:", text);
            setError("Error initializing chat. Please try again.");
            throw new Error("ChatKit session failed");
          }

          const data = await res.json();
          if (!data.client_secret) {
            throw new Error("No client_secret in response");
          }

          setReady(true);
          return data.client_secret;
        } catch (e: any) {
          console.error("getClientSecret error:", e);
          setError("Error initializing chat.");
          throw e;
        }
      },
    },
    theme: {
      colorScheme: "dark",
      radius: "xl",
      density: "comfortable",
    },
    startScreen: {
      greeting: "Hi, I'm OnKlinic's assistant for this page.",
      prompts: [
        "How does OnKlinic help with documentation?",
        "Is OnKlinic HIPAA compliant?",
        "How would this fit my current EHR?",
      ],
    },
    composer: {
      placeholder: "Ask how OnKlinic fits your workflow…",
    },
  });

  if (!userId) {
    return (
      <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-sm text-slate-200">
        Initializing chat…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-950/40 border border-red-500/60 p-4 text-sm text-red-100">
        {error}
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="rounded-2xl bg-black/40 border border-white/10 p-4 text-sm text-slate-200">
        Connecting to OnKlinic assistant…
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-black/40 border border-white/10 overflow-hidden">
      <div className="px-4 pt-4 pb-2 text-xs text-slate-300 border-b border-white/10">
        <p className="font-semibold text-teal-300">
          Ask OnKlinic about your workflow
        </p>
        <p>
          This chat is for questions about the product and adoption – not for
          writing clinical notes.
        </p>
      </div>

      <ChatKit control={control} className="h-[420px] w-full" />
    </div>
  );
};

export default OnKlinicAgentChat;
