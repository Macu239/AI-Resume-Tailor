import Groq from "groq-sdk";
import { TailorResult } from "@/types";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/** Strips markdown code fences before parsing model JSON output. */
function parseJSON(content: string) {
  const cleaned = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  return JSON.parse(cleaned);
}

//Bullets
export async function tailorBullets(resume: string, jobDescription: string) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
The user will give you their resume bullets and a job description.
Rewrite each bullet to be tailored to the role:
- Start every bullet with a strong past-tense action verb
- Naturally integrate the most relevant keywords from the job description — do not keyword-stuff
- Quantify achievements wherever possible (numbers, percentages, scale, impact)
- Preserve the approximate length of each original bullet
- Return exactly the same number of bullets as provided
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
  return parseJSON(content);
}

export async function refineBullet(
  results: TailorResult[],
  instruction: string,
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
The user will give you previously rewritten resume bullets and a refinement instruction.
Apply the instruction to every rewritten bullet while keeping the originals unchanged.
Maintain strong action verbs and any quantified metrics unless the instruction says otherwise.
Return exactly the same number of results as provided.
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
  return parseJSON(content);
}

//Summary
export async function tailorSummary(resume: string, jobDescription: string) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
The user will give you their professional summary and a job description.
Rewrite the summary to be tailored to the role:
- Naturally integrate the most relevant keywords from the job description
- Match the approximate length and tone of the original
- Keep it concise and professional (2-4 sentences)
- Highlight the candidate's most relevant strengths for this specific role
Respond in this exact JSON format:
{
  "result": { "original": "original summary", "rewritten": "rewritten summary" }
}
Only return JSON, no extra text.`,
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nResume Summary:\n${resume}`,
      },
    ],
  });

  const content = response.choices[0].message.content ?? "";
  return parseJSON(content);
}

export async function refineSummary(result: TailorResult, instruction: string) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
The user will give you a previously rewritten professional summary and a refinement instruction.
Apply the instruction to improve the rewritten summary while keeping the original unchanged.
Maintain a professional tone and concise length (2-4 sentences) unless instructed otherwise.
Respond in this exact JSON format:
{
  "result": { "original": "original summary", "rewritten": "refined rewritten summary" }
}
Only return JSON, no extra text.`,
      },
      {
        role: "user",
        content: `Previous Result:\n${JSON.stringify(result)}\n\nInstruction:\n${instruction}`,
      },
    ],
  });

  const content = response.choices[0].message.content ?? "";
  return parseJSON(content);
}

//Cover Letter
export async function tailorCoverLetter(
  resume: string,
  jobDescription: string,
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert cover letter writer.
The user will give you their resume and a job description.
Write a tailored cover letter using the candidate's experience from the resume:
- Structure: opening hook, why you fit the role, why this company, call to action
- 3-4 short paragraphs, professional and enthusiastic tone
- Naturally integrate key requirements from the job description
- Draw specific skills and achievements from the resume — do not invent experience
- Do not include salutation, date, or sign-off — body paragraphs only
Respond in this exact JSON format:
{
  "result": { "original": "original resume", "rewritten": "generated cover letter" }
}
Only return JSON, no extra text.`,
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nResume:\n${resume}`,
      },
    ],
  });

  const content = response.choices[0].message.content ?? "";
  return parseJSON(content);
}

export async function refineCoverLetter(
  result: TailorResult,
  instruction: string,
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert cover letter writer.
The user will give you a previously generated cover letter and a refinement instruction.
Apply the instruction to improve the cover letter while keeping the original resume unchanged.
Maintain professional tone and the 3-4 paragraph structure unless instructed otherwise.
Respond in this exact JSON format:
{
  "result": { "original": "original resume", "rewritten": "refined cover letter" }
}
Only return JSON, no extra text.`,
      },
      {
        role: "user",
        content: `Previous Result:\n${JSON.stringify(result)}\n\nInstruction:\n${instruction}`,
      },
    ],
  });

  const content = response.choices[0].message.content ?? "";
  return parseJSON(content);
}
