import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import CoverLetterTailor from "@/components/coverLetterTailor";
import { Language } from "@/types";

afterEach(() => cleanup());

const textCases: [Language, string, string, string, string][] = [
  [
    "en",
    "Cover Letter Tailor",
    "Paste your cover letter and the job description. Get back a more targeted, compelling letter aligned to the role.",
    "results appear below",
    "Generate Cover Letter",
  ],
  [
    "zh",
    "求職信客製",
    "貼上您的履歷與職缺描述，即可獲得更貼近職缺需求、更具說服力的求職信。",
    "結果將顯示於下方",
    "生成求職信",
  ],
];

describe("CoverLetterTailor", () => {
  it.each(textCases)(
    "renders text for %s",
    (language, title, description, actionHint, idleLabel) => {
      render(<CoverLetterTailor jobDescription="" language={language} />);
      expect(screen.getByText(title)).toBeDefined();
      expect(screen.getByText(description)).toBeDefined();
      expect(screen.getByText(actionHint)).toBeDefined();
      expect(screen.getByText(idleLabel)).toBeDefined();
    },
  );

  it("passes mode='coverLetter' to ResumeInput", () => {
    render(<CoverLetterTailor jobDescription="" language="en" />);
    expect(screen.getByText("Whole Resume")).toBeDefined();
  });
});

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

const fetchCases: [Language, string][] = [
  ["en", "Generate Cover Letter"],
  ["zh", "生成求職信"],
];

describe("CoverLetterTailor fetching", () => {
  it.each(fetchCases)(
    "sends the correct request when submitted (%s)",
    async (language, idleLabel) => {
      mockFetch.mockResolvedValue({
        json: async () => ({ result: null }),
      });
      render(<CoverLetterTailor jobDescription="job desc" language={language} />);

      fireEvent.click(screen.getByText(idleLabel));
      await screen.findByText(idleLabel);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("/api/tailor-cv");
      const sentBody = JSON.parse(options.body);
      expect(sentBody.jobDescription).toBe("job desc");
      expect(sentBody.language).toBe(language);
    },
  );

  it("reacts to the fetch response by updating the button and showing results", async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ result: { original: "x", rewritten: "y" } }),
    });
    render(<CoverLetterTailor jobDescription="job desc" language="en" />);

    fireEvent.click(screen.getByText("Generate Cover Letter"));
    await screen.findByText("Generating...");
    await screen.findByText("Regenerate");
    expect(screen.getByText("y")).toBeDefined();
  });

  const refineCases: [Language, string, string, string, string][] = [
    [
      "en",
      "Generate Cover Letter",
      "Regenerate",
      "Highlight the GPA calculator",
      "Refine Cover Letter",
    ],
    [
      "zh",
      "生成求職信",
      "重新生成",
      "強調 GPA 計算機專案",
      "精修求職信",
    ],
  ];

  it.each(refineCases)(
    "sends the correct refine request and updates results (%s)",
    async (language, idleLabel, doneLabel, refinePlaceholder, refineBtnLabel) => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ result: { original: "x", rewritten: "y" } }),
      });
      render(<CoverLetterTailor jobDescription="job desc" language={language} />);

      fireEvent.click(screen.getByText(idleLabel));
      await screen.findByText(doneLabel);

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ result: { original: "x", rewritten: "y refined" } }),
      });

      const refineInput = screen.getByPlaceholderText(refinePlaceholder);
      fireEvent.change(refineInput, { target: { value: "make it punchier" } });
      fireEvent.click(screen.getByText(refineBtnLabel));

      await screen.findByText("y refined");

      const [url, options] = mockFetch.mock.calls[1];
      expect(url).toBe("/api/refine-cv");
      const sentBody = JSON.parse(options.body);
      expect(sentBody.instruction).toBe("make it punchier");
      expect(sentBody.language).toBe(language);
      expect(sentBody.result).toEqual({ original: "x", rewritten: "y" });
    },
  );
});

