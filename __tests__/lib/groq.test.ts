import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  tailorBullets,
  refineBullet,
  tailorSummary,
  refineSummary,
  tailorCV,
  refineCV,
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

describe("tailorBullets", () => {
  it("returns parsed results", async () => {
    const payload = { results: [{ original: "a", rewritten: "b" }] };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await tailorBullets("resume", "job desc");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
  });

  it("strips markdown code fences from the response", async () => {
    const payload = { results: [] };
    mockCreate.mockResolvedValue(
      mockResponse("```json\n" + JSON.stringify(payload) + "\n```")
    );

    const result = await tailorBullets("resume", "job desc");

    expect(result).toEqual(payload);
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
  });
});

describe("tailorSummary", () => {
  it("returns parsed result", async () => {
    const payload = { result: { original: "I love SWE", rewritten: "Passionate SWE" } };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await tailorSummary("summary text", "job desc");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
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
  });
});

describe("tailorCV", () => {
  it("returns parsed result", async () => {
    const payload = { result: { original: "my resume", rewritten: "cover letter" } };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await tailorCV("my resume", "job desc");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
  });
});

describe("refineCV", () => {
  it("returns refined result", async () => {
    const previous: TailorResult = { original: "my resume", rewritten: "cover letter" };
    const payload = { result: { original: "my resume", rewritten: "refined cover letter" } };
    mockCreate.mockResolvedValue(mockResponse(JSON.stringify(payload)));

    const result = await refineCV(previous, "More formal tone");

    expect(result).toEqual(payload);
    expect(mockCreate).toHaveBeenCalledOnce();
  });
});
