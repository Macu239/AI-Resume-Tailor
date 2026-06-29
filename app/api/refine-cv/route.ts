import { TailorResult } from "@/types";
import { refineCoverLetter } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body: { result: TailorResult; instruction: string } =
      await request.json();
    const result = await refineCoverLetter(body.result, body.instruction);
    return Response.json(result);
  } catch (err) {
    console.error("[refine-cv]", err);
    return Response.json({ error: "Failed to refine CV" }, { status: 500 });
  }
}
