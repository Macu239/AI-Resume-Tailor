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
  return parseJSON(content);
}

export async function refineBullet(
  results: TailorResult[],
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
  return parseJSON(content);
}

//Summary
export async function tailorSummary(resume: string, jobDescription: string) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
        The user will give you their resume summary and a job description.
        Rewrite the summary to better match the job description using relevant keywords.
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


/**
 * 
 * @param result previous result
 * @param instruction refienment prompt
 * @returns the JSON of original and re-written
 */
export async function refineSummary(
  result: TailorResult,
  instruction: string,
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
        The user will give you a previously rewritten resume summary and a refinement instruction.
        Apply the instruction to improve the summary while keeping the original unchanged.
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


//CV
export async function tailorCV(resume: string, jobDescription: string) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
        The user will give you their resume and a job description.
        Write a Cover letter to better match the job description using relevant keywords from the resume.
        Keep the original unchanged.
        Respond in this exact JSON format:
        {
          "result": { "original": "original resume", "rewritten": "generated Cover letter" }
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

export async function refineCV(result: TailorResult, instruction: string) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `You are an expert resume writer.
        The user will give you a previously generated Cover letter and a refinement instruction.
        Apply the instruction to improve the CV while keeping the original unchanged.
        Respond in this exact JSON format:
        {
          "result": { "original": "original CV", "rewritten": "refined Cover letter" }
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
