import { TailorRequest } from "@/types";
import { tailorCoverLetter } from "@/lib/groq";
import { isRateLimited } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    if (await isRateLimited(request)) {
      return Response.json({ error: "Too many requests, slow down." }, { status: 429 });
    }

    const body: TailorRequest = await request.json();
    const result = await tailorCoverLetter(body.resume, body.jobDescription, body.language);
    return Response.json(result);
  } catch (err) {
    console.error("[tailor-cv]", err);
    return Response.json({ error: "Failed to generate CV" }, { status: 500 });
  }
}
