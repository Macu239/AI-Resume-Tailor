import { TailorRequest } from "@/types";
import { tailorCoverLetter } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body: TailorRequest = await request.json();
    const result = await tailorCoverLetter(body.resume, body.jobDescription);
    return Response.json(result);
  } catch (err) {
    console.error("[tailor-cv]", err);
    return Response.json({ error: "Failed to generate CV" }, { status: 500 });
  }
}
