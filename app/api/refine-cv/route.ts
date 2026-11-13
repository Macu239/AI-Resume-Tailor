import { RefineSingleRequest } from "@/types";
import { refineCoverLetter, isGroqRateLimit } from "@/lib/groq";
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
    if (isGroqRateLimit(err)) {
      return Response.json({ error: "The AI service is busy, please try again in a minute." }, { status: 429 });
    }
    return Response.json({ error: "Failed to refine CV" }, { status: 500 });
  }
}
