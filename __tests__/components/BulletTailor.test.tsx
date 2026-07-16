import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import BulletTailor from "@/components/BulletTailor";
import { Language } from "@/types";

afterEach(() => cleanup());

const textCases: [Language, string, string, string, string][] = [
  [
    "en",
    "Bullet Points Tailor",
    "Paste your resume bullets and the job description. Get back sharper,quantified writing aligned to the role.",
    "results appear below",
    "Tailor bullets",
  ],
  [
    "zh",
    "履歷條列客製",
    "貼上您的履歷條列與職缺描述，即可獲得更精準、量化且符合職缺需求的內容。",
    "結果將顯示於下方",
    "條列客製",
  ],
];

describe("BulletTailor", () => {
  it.each(textCases)(
    "renders text for %s",
    (language, title, description, actionHint, idleLabel) => {
      render(<BulletTailor jobDescription="" language={language} />);
      expect(screen.getByText(title)).toBeDefined();
      expect(screen.getByText(description)).toBeDefined();
      expect(screen.getByText(actionHint)).toBeDefined();
      expect(screen.getByText(idleLabel)).toBeDefined();
    },
  );

  it("passes mode='bullet' to ResumeInput", () => {
    render(<BulletTailor jobDescription="" language="en" />);
    expect(screen.getByText("Resume Bullets")).toBeDefined();
  });
});

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

const fetchCases: [Language, string][] = [
  ["en", "Tailor bullets"],
  ["zh", "條列客製"],
];

describe("BulletTailor fetching", () => {
  it.each(fetchCases)(
    "sends the correct request when submitted (%s)",
    async (language, idleLabel) => {
      mockFetch.mockResolvedValue({
        json: async () => ({ results: [] }),
      });
      render(<BulletTailor jobDescription="job desc" language={language} />);

      fireEvent.click(screen.getByText(idleLabel));
      await screen.findByText(idleLabel);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("/api/tailor-bullet");
      const sentBody = JSON.parse(options.body);
      expect(sentBody.jobDescription).toBe("job desc");
      expect(sentBody.language).toBe(language);
    },
  );

  it("reacts to the fetch response by updating the button and showing results", async () => {
    const mockResponse = { results: [{ original: "x", rewritten: "y" }] };
    mockFetch.mockResolvedValue({
      json: async () => mockResponse,
    });
    render(<BulletTailor jobDescription="job desc" language="en" />);

    const submitButton = screen.getByText("Tailor bullets");
    fireEvent.click(submitButton);
    await screen.findByText("Tailoring...");
    await screen.findByText("Re-tailor");
    expect(screen.getByText("y")).toBeDefined();
  });

  const refineCases: [Language, string, string, string, string][] = [
    [
      "en",
      "Tailor bullets",
      "Re-tailor",
      "Shorter, more precise on Python, emphasize leadership...",
      "Refine bullets",
    ],
    [
      "zh",
      "條列客製",
      "重新客製",
      "更簡短、更精確地描述 Python 經驗，並強調領導能力...",
      "精修條列",
    ],
  ];

  it.each(refineCases)(
    "sends the correct refine request and updates results (%s)",
    async (language, idleLabel, doneLabel, refinePlaceholder, refineBtnLabel) => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ results: [{ original: "x", rewritten: "y" }] }),
      });
      render(<BulletTailor jobDescription="job desc" language={language} />);

      fireEvent.click(screen.getByText(idleLabel));
      await screen.findByText(doneLabel);

      mockFetch.mockResolvedValueOnce({
        json: async () => ({ results: [{ original: "x", rewritten: "y refined" }] }),
      });

      const refineInput = screen.getByPlaceholderText(refinePlaceholder);
      fireEvent.change(refineInput, { target: { value: "make it punchier" } });
      fireEvent.click(screen.getByText(refineBtnLabel));

      await screen.findByText("y refined");

      const [url, options] = mockFetch.mock.calls[1];
      expect(url).toBe("/api/refine-bullet");
      const sentBody = JSON.parse(options.body);
      expect(sentBody.instruction).toBe("make it punchier");
      expect(sentBody.language).toBe(language);
      expect(sentBody.results).toEqual([{ original: "x", rewritten: "y" }]);
    },
  );
});
