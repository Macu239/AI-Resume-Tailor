import { TailorRequest } from "@/types";
import { tailorBullets } from "@/lib/groq";
import { getClientIp, ratelimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    const { success } = await ratelimit.limit(getClientIp(request));
    if (!success) {
      return Response.json({ error: "Too many requests, slow down." }, { status: 429 });
    }

    const body: TailorRequest = await request.json();
    const result = await tailorBullets(body.resume, body.jobDescription);
    return Response.json(result);
  } catch (err) {
    console.error("[tailor-bullet]", err);
    return Response.json({ error: "Failed to tailor bullets" }, { status: 500 });
  }
}
