import { TailorRequest } from "@/types";
import { tailorSummary } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body: TailorRequest = await request.json();
    const result = await tailorSummary(body.resume, body.jobDescription);
    return Response.json(result);
  } catch (err) {
    console.error("[tailor-summary]", err);
    return Response.json({ error: "Failed to tailor summary" }, { status: 500 });
  }
}
