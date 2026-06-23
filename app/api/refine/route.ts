import { refineResult } from "@/types";
import { refineBullet } from "@/lib/groq";

export async function POST(request: Request) {
  const body: refineResult = await request.json();
  const result = await refineBullet(body.results, body.instruction);
  return Response.json(result);
}
