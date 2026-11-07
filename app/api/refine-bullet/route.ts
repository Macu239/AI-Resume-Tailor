import { RefineRequest } from "@/types";
import { refineBullet } from "@/lib/groq";
import { isRateLimited } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    if (await isRateLimited(request)) {
      return Response.json({ error: "Too many requests, slow down." }, { status: 429 });
    }

    const body: RefineRequest = await request.json();
    const result = await refineBullet(body.results, body.instruction, body.language);
    return Response.json(result);
  } catch (err) {
    console.error("[refine-bullet]", err);
    return Response.json({ error: "Failed to refine bullets" }, { status: 500 });
  }
}
