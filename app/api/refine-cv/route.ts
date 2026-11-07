import { RefineSingleRequest } from "@/types";
import { refineCoverLetter } from "@/lib/groq";
import { isRateLimited } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    if (await isRateLimited(request)) {
      return Response.json({ error: "Too many requests, slow down." }, { status: 429 });
    }

    const body: RefineSingleRequest = await request.json();
    const result = await refineCoverLetter(body.result, body.instruction, body.language);
    return Response.json(result);
  } catch (err) {
    console.error("[refine-cv]", err);
    return Response.json({ error: "Failed to refine CV" }, { status: 500 });
  }
}
