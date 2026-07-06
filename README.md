# AI Resume Tailor

## Why this exists

Over the last summer I applied to a large number of jobs. For almost every application I found myself doing the same tedious loop: copy the job description, copy a resume bullet or summary, paste both into a general-purpose GenAI chat, ask it to tailor the wording, copy the result back out, repeat for every bullet, every summary, every cover letter, every job.

It worked, but it was slow and repetitive for something that is fundamentally a narrow, well-defined task. This project is that workflow turned into a purpose-built tool: paste a resume section and a job description once, and get a tailored rewrite back immediately, with the ability to refine the result with a follow-up instruction instead of re-prompting from scratch.

## What it does

- **Bullet tailoring** — rewrite resume bullet points to match a job description while preserving length and quantified achievements.
- **Summary tailoring** — rewrite a professional summary to highlight the most relevant strengths for a specific role.
- **Cover letter generation** — draft a tailored cover letter body from a resume and job description.
- **Refinement** — every tailored result can be refined further with a plain-language instruction (e.g. "make it more concise") without starting over.

## How it's built

- **Framework**: Next.js (App Router, API routes under `app/api/*`)
- **AI provider**: [Groq](https://groq.com) via `groq-sdk`, isolated in `lib/groq.ts`. Groq was chosen for speed and cost during development, but the AI logic is intentionally kept behind a single module — swapping in a different model provider (OpenAI, Anthropic, etc.) means rewriting `lib/groq.ts`, not touching the routes or UI.
- **Rate limiting**: [Upstash Redis](https://upstash.com) + `@upstash/ratelimit` (`lib/ratelimit.ts`), applied to every generation route. This protects the shared API quota from being exhausted by repeated or automated form submissions, since a single spammed request could otherwise burn through the per-minute limit for everyone using the app.
- **Testing**: Vitest + Testing Library (`__tests__/`)

## Project structure

```
app/api/           API routes: tailor-bullet, refine-bullet, tailor-summary,
                    refine-summary, tailor-cv, refine-cv
lib/groq.ts         All prompt construction and model calls
lib/ratelimit.ts     Shared rate limiter and client identification
components/          Tailoring UI: BulletTailor, SummaryTailor, CvTailor,
                    inputs, output panels, tab navigation
types/               Shared request/response types
```

## Getting started

1. Install dependencies:
   ```
   npm install
   ```

2. Create `.env.local` with:
   ```
   GROQ_API_KEY=your-groq-api-key
   UPSTASH_REDIS_REST_URL=your-upstash-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
   ```

3. Run the dev server:
   ```
   npm run dev
   ```

4. Run tests:
   ```
   npm run test
   ```

## Status

This is an actively evolving personal tool built to solve a real problem from this summer's job search, not a general-purpose product. The model provider, prompt design, and rate limits are all expected to change as the tool gets used for real applications.
