import { TailorRequest } from "@/types";
import { tailorBullets } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body: TailorRequest = await request.json();
    const result = await tailorBullets(body.resume, body.jobDescription);
    return Response.json(result);
  } catch (err) {
    console.error("[tailor-bullet]", err);
    return Response.json({ error: "Failed to tailor bullets" }, { status: 500 });
  }
}
