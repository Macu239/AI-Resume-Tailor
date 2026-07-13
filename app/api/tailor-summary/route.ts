import { TailorRequest } from "@/types";
import { tailorSummary } from "@/lib/groq";
import { getClientIp, ratelimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    const { success } = await ratelimit.limit(getClientIp(request));
    if (!success) {
      return Response.json({ error: "Too many requests, slow down." }, { status: 429 });
    }

    const body: TailorRequest = await request.json();
    const result = await tailorSummary(body.resume, body.jobDescription, body.language);
    return Response.json(result);
  } catch (err) {
    console.error("[tailor-summary]", err);
    return Response.json({ error: "Failed to tailor summary" }, { status: 500 });
  }
}
