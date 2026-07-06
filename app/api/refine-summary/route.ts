import { TailorResult } from "@/types";
import { refineSummary } from "@/lib/groq";
import { getClientIp, ratelimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    const { success } = await ratelimit.limit(getClientIp(request));
    if (!success) {
      return Response.json({ error: "Too many requests, slow down." }, { status: 429 });
    }

    const body: { result: TailorResult; instruction: string } =
      await request.json();
    const result = await refineSummary(body.result, body.instruction);
    return Response.json(result);
  } catch (err) {
    console.error("[refine-summary]", err);
    return Response.json({ error: "Failed to refine summary" }, { status: 500 });
  }
}
