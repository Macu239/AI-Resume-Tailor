import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  tailorBullets,
  refineBullet,
  tailorSummary,
  refineSummary,
  tailorCoverLetter,
  refineCoverLetter,
} from "@/lib/groq";
import { TailorResult } from "@/types";

const mockCreate = vi.hoisted(() => vi.fn());

vi.mock("groq-sdk", () => ({
  default: vi.fn().mockImplementation(function () {
    return {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };
  }),
}));

/** Returns a mock Groq response wrapping the given content string. */
function mockResponse(content: string) {
  return { choices: [{ message: { content } }] };
}

beforeEach(() => {
  mockCreate.mockReset();
});

/** Asserts the system prompt sent to the mocked Groq call is Chinese and never instructs English output. */
function expectMandarinPrompt() {
  const sentPrompt = mockCreate.mock.calls[0][0].messages[0].content;
  expect(sentPrompt).toMatch(/[一-鿿]/);
  expect(sentPrompt).not.toMatch(/英文|English/);
}

/** Asserts the system prompt sent to the mocked Groq call is English and never instructs Chinese output. */
function expectEnglishPrompt() {
  const sentPrompt = mockCreate.mock.calls[0][0].messages[0].content;
  expect(sentPrompt).not.toMatch(/[一-鿿]/);
  expect(sentPrompt).not.toMatch(/繁體中文|中文|Chinese|Mandarin/);
}

describe("tailorBullets", () => {
  it("returns parsed results", async () => {
    const payload = { results: [{ original: "a", rewritten: "b" }] };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await tailorBullets("resume", "job desc");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
    expectEnglishPrompt();
  });

  it("strips markdown code fences from the response", async () => {
    const payload = { results: [] };
    mockCreate.mockResolvedValue(
      mockResponse("```json\n" + JSON.stringify(payload) + "\n```")
    );

    const result = await tailorBullets("resume", "job desc");

    expect(result).toEqual(payload);
  });

  it("sends a Mandarin prompt with no English-language instruction when language is zh", async () => {
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify({ results: [] })));

    await tailorBullets("resume", "job desc", "zh");

    expectMandarinPrompt();
  });
});

describe("refineBullet", () => {
  it("returns refined results", async () => {
    const results: TailorResult[] = [
      { original: "Led a team", rewritten: "Led cross-functional team" },
    ];
    const payload = { results: [] };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await refineBullet(results, "Make more concise");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
    expectEnglishPrompt();
  });

  it("sends a Mandarin prompt with no English-language instruction when language is zh", async () => {
    const results: TailorResult[] = [
      { original: "Led a team", rewritten: "Led cross-functional team" },
    ];
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify({ results: [] })));

    await refineBullet(results, "Make more concise", "zh");

    expectMandarinPrompt();
  });
});

describe("tailorSummary", () => {
  it("returns parsed result", async () => {
    const payload = { result: { original: "I love SWE", rewritten: "Passionate SWE" } };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await tailorSummary("summary text", "job desc");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
    expectEnglishPrompt();
  });

  it("sends a Mandarin prompt with no English-language instruction when language is zh", async () => {
    mockCreate.mockResolvedValue(
      mockResponse(JSON.stringify({ result: { original: "a", rewritten: "b" } }))
    );

    await tailorSummary("summary text", "job desc", "zh");

    expectMandarinPrompt();
  });
});

describe("refineSummary", () => {
  it("returns refined result", async () => {
    const previous: TailorResult = { original: "I love SWE", rewritten: "Passionate SWE" };
    const payload = { result: { original: "I love SWE", rewritten: "Results-driven SWE" } };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await refineSummary(previous, "Sound more professional");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
    expectEnglishPrompt();
  });

  it("sends a Mandarin prompt with no English-language instruction when language is zh", async () => {
    const previous: TailorResult = { original: "I love SWE", rewritten: "Passionate SWE" };
    mockCreate.mockResolvedValue(
      mockResponse(JSON.stringify({ result: { original: "a", rewritten: "b" } }))
    );

    await refineSummary(previous, "Sound more professional", "zh");

    expectMandarinPrompt();
  });
});

describe("tailorCoverLetter", () => {
  it("returns parsed result", async () => {
    const payload = { result: { original: "my resume", rewritten: "cover letter" } };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await tailorCoverLetter("my resume", "job desc");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
    expectEnglishPrompt();
  });

  it("sends a Mandarin prompt with no English-language instruction when language is zh", async () => {
    mockCreate.mockResolvedValue(
      mockResponse(JSON.stringify({ result: { original: "a", rewritten: "b" } }))
    );

    await tailorCoverLetter("my resume", "job desc", "zh");

    expectMandarinPrompt();
  });
});

describe("refineCoverLetter", () => {
  it("returns refined result", async () => {
    const previous: TailorResult = { original: "my resume", rewritten: "cover letter" };
    const payload = { result: { original: "my resume", rewritten: "refined cover letter" } };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await refineCoverLetter(previous, "More formal tone");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
    expectEnglishPrompt();
  });

  it("sends a Mandarin prompt with no English-language instruction when language is zh", async () => {
    const previous: TailorResult = { original: "my resume", rewritten: "cover letter" };
    mockCreate.mockResolvedValue(
      mockResponse(JSON.stringify({ result: { original: "a", rewritten: "b" } }))
    );

    await refineCoverLetter(previous, "More formal tone", "zh");

    expectMandarinPrompt();
  });
});
