import Groq from "groq-sdk";
import { BulletResult } from "@/types";
// Create a Groq client instance with API key
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function tailorResume(resume: string, jobDescription: string) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
        The user will give you their resume bullets and a job description.
        Rewrite each bullet point to better match the job description using relevant keywords.
        Respond in this exact JSON format:
        {
          "results": [
            { "original": "original bullet", "rewritten": "rewritten bullet" }
          ]
        }
        Only return JSON, no extra text.`,
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nResume Bullets:\n${resume}`,
      },
    ],
  });

  const content = response.choices[0].message.content ?? "";
  return JSON.parse(content);
}

export async function refineBullet(
  results: BulletResult[],
  instruction: string,
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
        The user will give you previously rewritten resume bullets and a refinement instruction.
        Apply the instruction to improve each rewritten bullet while keeping the originals unchanged.
        Respond in this exact JSON format:
        {
          "results": [
            { "original": "original bullet", "rewritten": "refined rewritten bullet" }
          ]
        }
        Only return JSON, no extra text.`,
      },
      {
        role: "user",
        content: `Previous Results:\n${JSON.stringify(results)}\n\nInstruction:\n${instruction}`,
      },
    ],
  });

  const content = response.choices[0].message.content ?? "";
  return JSON.parse(content);
}
