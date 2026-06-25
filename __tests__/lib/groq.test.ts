import { describe, it, expect, vi, beforeEach } from "vitest";
import { tailorResume, refineBullet } from "@/lib/groq";
import { BulletResult } from "@/types";

const mockCreate = vi.hoisted(() => vi.fn())

 vi.mock("groq-sdk", () => ({
    default: vi.fn().mockImplementation(function() {
      return {
        chat: {
          completions: {
            create: mockCreate,
          },
        },
      }
    }),
  }));

describe("tailorResume", () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it("should call the Groq client with the correct parameters", async () => {
    const resume = "Sample resume bullets";
    const jobDescription = "Sample job description";
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({
              results: [],
            }),
          },
        },
      ],
    });

    const result = await tailorResume(resume, jobDescription);

    expect(result).toEqual({
      results: [],
    });
    expect(mockCreate).toHaveBeenCalledOnce();
  });
});

describe("refineBullet", () => {
  beforeEach(() => {
    mockCreate.mockReset();
  });

  it("returns refined results from the API", async () => {
    const results: BulletResult[] = [
      { original: "Led a team", rewritten: "Led cross-functional team" },
    ];
    const instruction = "Make the bullets more concise and impactful.";
    mockCreate.mockResolvedValue({
      choices: [
        {
          message: {
            content: JSON.stringify({ results: [] }),
          },
        },
      ],
    });

    const result = await refineBullet(results, instruction);

    expect(result).toEqual({
      results: [],
    });
    expect(mockCreate).toHaveBeenCalledOnce();
  });
});
