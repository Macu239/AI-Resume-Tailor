import Groq from "groq-sdk"
// Create a Groq client instance with API key
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

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
          "bullets": [
            { "original": "original bullet", "rewritten": "rewritten bullet" },
          ]
        }
        Only return JSON, no extra text.`
      },
      {
        role: "user",
        content: `Job Description:\n${jobDescription}\n\nResume Bullets:\n${resume}`
      }
    ]
  })

  const content = response.choices[0].message.content ?? ""
  return JSON.parse(content)
}