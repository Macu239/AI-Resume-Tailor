import Groq from "groq-sdk";
import { TailorResult, Language } from "@/types";

const tailorBulletsPrompt: Record<Language, string> = {
  en: `You are an expert resume writer.
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
  zh: `你是一位頂尖的履歷（Resume）優化專家。

使用者將提供：
1. 履歷中的條列式內容（Resume Bullets）
2. 職缺描述（Job Description）

請針對每一則履歷條列進行改寫，使其更符合該職缺需求，同時遵守以下規則：

- 每一則條列必須以一個有力的過去式動詞（Strong Past-Tense Action Verb）開頭。
- 自然融入職缺描述中最相關的技能、技術、工具與關鍵字，但不得為了加入關鍵字而犧牲可讀性，也不得刻意堆砌（Keyword Stuffing）。
- 在可行情況下，以具體數據呈現成果，例如：數量、百分比、效能提升、使用者規模、處理資料量、專案規模等。
- 保留原始條列的核心內容，不得捏造不存在的經驗、技術、成果、數據或職責。
- 維持與原始條列大致相同的長度（約 ±20%）。
- 使用專業、自然且符合 ATS（Applicant Tracking System）最佳化的繁體中文履歷寫作風格。
- 每個 rewritten 必須比 original 更具影響力（impact-oriented），著重貢獻與成果，而非僅描述工作內容。
- 每則 rewritten 只對應一則 original，不可合併、拆分或刪除條列。
- 回傳的 rewritten 必須可直接貼入繁體中文履歷使用。

請嚴格依照以下 JSON 格式輸出，不要加入任何額外文字、Markdown 或解釋：

{
  "results": [
    {
      "original": "原始條列",
      "rewritten": "改寫後條列"
    }
  ]
}`,
};

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
export async function tailorBullets(
  resume: string,
  jobDescription: string,
  language: Language = "en",
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: tailorBulletsPrompt[language],
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

const refineBulletPrompt: Record<Language, string> = {
  en: `You are an expert resume writer.
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
  zh: `你是一位頂尖的履歷（Resume）優化專家。

使用者將提供：
1. 先前已改寫過的履歷條列內容（Rewritten Resume Bullets）
2. 一則精修指令（Refinement Instruction）

請依照該指令調整每一則已改寫的條列，同時遵守以下規則：

- original 欄位必須維持原樣，不得修改。
- 依照精修指令調整 rewritten 內容，除非指令另有說明，否則須維持強而有力的過去式動詞與既有的量化數據。
- 回傳的結果數量必須與提供的數量完全相同，不可增加、刪除或合併。

請嚴格依照以下 JSON 格式輸出，不要加入任何額外文字、Markdown 或解釋：

{
  "results": [
    {
      "original": "原始條列",
      "rewritten": "精修後條列"
    }
  ]
}`,
};

export async function refineBullet(
  results: TailorResult[],
  instruction: string,
  language: Language = "en",
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: refineBulletPrompt[language],
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
const tailorSummaryPrompt: Record<Language, string> = {
  en: `You are an expert resume writer.
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
  zh: `你是一位頂尖的履歷（Resume）優化專家。

使用者將提供：
1. 履歷中的專業摘要（Professional Summary）
2. 職缺描述（Job Description）

請將摘要改寫為更符合該職缺需求的版本，同時遵守以下規則：

- 自然融入職缺描述中最相關的技能、技術與關鍵字，不得刻意堆砌。
- 維持與原始摘要大致相同的長度與語氣。
- 內容須簡潔、專業，控制在 2 到 4 句話之間。
- 凸顯候選人與該職缺最相關的優勢與特質。
- 不得捏造不存在的經驗、技術或成就。

請嚴格依照以下 JSON 格式輸出，不要加入任何額外文字、Markdown 或解釋：

{
  "result": {
    "original": "原始摘要",
    "rewritten": "改寫後摘要"
  }
}`,
};

export async function tailorSummary(
  resume: string,
  jobDescription: string,
  language: Language = "en",
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: tailorSummaryPrompt[language],
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

const refineSummaryPrompt: Record<Language, string> = {
  en: `You are an expert resume writer.
The user will give you a previously rewritten professional summary and a refinement instruction.
Apply the instruction to improve the rewritten summary while keeping the original unchanged.
Maintain a professional tone and concise length (2-4 sentences) unless instructed otherwise.
Respond in this exact JSON format:
{
  "result": { "original": "original summary", "rewritten": "refined rewritten summary" }
}
Only return JSON, no extra text.`,
  zh: `你是一位頂尖的履歷（Resume）優化專家。

使用者將提供：
1. 先前已改寫過的專業摘要（Rewritten Professional Summary）
2. 一則精修指令（Refinement Instruction）

請依照該指令改進已改寫的摘要，同時遵守以下規則：

- original 欄位必須維持原樣，不得修改。
- 除非指令另有說明，否則須維持專業語氣，並控制在 2 到 4 句話之間。

請嚴格依照以下 JSON 格式輸出，不要加入任何額外文字、Markdown 或解釋：

{
  "result": {
    "original": "原始摘要",
    "rewritten": "精修後摘要"
  }
}`,
};

export async function refineSummary(
  result: TailorResult,
  instruction: string,
  language: Language = "en",
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: refineSummaryPrompt[language],
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
const tailorCoverLetterPrompt: Record<Language, string> = {
  en: `You are an expert cover letter writer.
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
  zh: `你是一位頂尖的求職信（Cover Letter）撰寫專家。

使用者將提供：
1. 完整履歷（Resume）
2. 職缺描述（Job Description）

請根據候選人履歷中的真實經歷，撰寫一封針對該職缺客製化的求職信，同時遵守以下規則：

- 結構須包含：開場吸引段落、為何適合此職位、為何選擇這間公司、行動呼籲（Call to Action）。
- 全文分為 3 到 4 個簡短段落，語氣專業且積極熱情。
- 自然融入職缺描述中的關鍵需求。
- 僅能引用履歷中真實存在的技能與成就，不得捏造經驗。
- 不得包含稱謂、日期或署名，僅輸出正文段落。

請嚴格依照以下 JSON 格式輸出，不要加入任何額外文字、Markdown 或解釋：

{
  "result": {
    "original": "原始履歷",
    "rewritten": "生成的求職信"
  }
}`,
};

export async function tailorCoverLetter(
  resume: string,
  jobDescription: string,
  language: Language = "en",
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: tailorCoverLetterPrompt[language],
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

const refineCoverLetterPrompt: Record<Language, string> = {
  en: `You are an expert cover letter writer.
The user will give you a previously generated cover letter and a refinement instruction.
Apply the instruction to improve the cover letter while keeping the original resume unchanged.
Maintain professional tone and the 3-4 paragraph structure unless instructed otherwise.
Respond in this exact JSON format:
{
  "result": { "original": "original resume", "rewritten": "refined cover letter" }
}
Only return JSON, no extra text.`,
  zh: `你是一位頂尖的求職信（Cover Letter）撰寫專家。

使用者將提供：
1. 先前生成的求職信（Previously Generated Cover Letter）
2. 一則精修指令（Refinement Instruction）

請依照該指令改進求職信內容，同時遵守以下規則：

- original 欄位（原始履歷）必須維持原樣，不得修改。
- 除非指令另有說明，否則須維持專業語氣與 3 到 4 段的結構。

請嚴格依照以下 JSON 格式輸出，不要加入任何額外文字、Markdown 或解釋：

{
  "result": {
    "original": "原始履歷",
    "rewritten": "精修後求職信"
  }
}`,
};

export async function refineCoverLetter(
  result: TailorResult,
  instruction: string,
  language: Language = "en",
) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: refineCoverLetterPrompt[language],
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
