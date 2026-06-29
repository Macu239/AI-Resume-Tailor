import { TailorResult } from "@/types";
import { refineSummary } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body: { result: TailorResult; instruction: string } =
      await request.json();
    const result = await refineSummary(body.result, body.instruction);
    return Response.json(result);
  } catch (err) {
    console.error("[refine-summary]", err);
    return Response.json({ error: "Failed to refine summary" }, { status: 500 });
  }
}
