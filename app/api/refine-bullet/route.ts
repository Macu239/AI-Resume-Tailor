import { TailorResult } from "@/types";
import { refineBullet } from "@/lib/groq";

export async function POST(request: Request) {
  try {
    const body: { results: TailorResult[]; instruction: string } =
      await request.json();
    const result = await refineBullet(body.results, body.instruction);
    return Response.json(result);
  } catch (err) {
    console.error("[refine-bullet]", err);
    return Response.json({ error: "Failed to refine bullets" }, { status: 500 });
  }
}
