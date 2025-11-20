import type { Context } from "@netlify/functions";
import { corsHeaders, preflight } from "./utils/cors";
import { getAllOkHowToVideos } from "../lib/okhowtoStore";

export default async (req: Request, _ctx: Context) => {
  const pf = preflight(req);
  if (pf) return pf;

  const origin = req.headers.get("Origin");
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...corsHeaders(origin)
  };

  const videos = await getAllOkHowToVideos();
  return new Response(JSON.stringify(videos), { status: 200, headers });
};
