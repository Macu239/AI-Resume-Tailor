import { TailorResult } from "@/types";
import { refineBullet } from "@/lib/groq";
import { getClientIp, ratelimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    const { success } = await ratelimit.limit(getClientIp(request));
    if (!success) {
      return Response.json({ error: "Too many requests, slow down." }, { status: 429 });
    }

    const body: { results: TailorResult[]; instruction: string } =
      await request.json();
    const result = await refineBullet(body.results, body.instruction);
    return Response.json(result);
  } catch (err) {
    console.error("[refine-bullet]", err);
    return Response.json({ error: "Failed to refine bullets" }, { status: 500 });
  }
}
