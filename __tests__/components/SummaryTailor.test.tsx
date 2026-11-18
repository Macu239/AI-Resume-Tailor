import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import SummaryTailor from "@/components/SummaryTailor";
import { Language } from "@/types";

afterEach(() => cleanup());

const textCases: [Language, string, string, string, string][] = [
  [
    "en",
    "Tailor your summary to the job.",
    "Paste your resume summary. Get back sharper, quantified writing aligned to the role.",
    "results appear below",
    "Tailor Summary",
  ],
  [
    "zh",
    "將履歷摘要(Summary)客製化以符合職缺。",
    "貼上您的履歷摘要，獲得更精準、量化且符合職缺需求的內容。",
    "結果將顯示於下方",
    "摘要客製",
  ],
];

describe("SummaryTailor", () => {
  it.each(textCases)(
    "renders text for %s",
    (language, title, description, actionHint, idleLabel) => {
      render(<SummaryTailor jobDescription="" language={language} />);
      expect(screen.getByText(title)).toBeDefined();
      expect(screen.getByText(description)).toBeDefined();
      expect(screen.getByText(actionHint)).toBeDefined();
      expect(screen.getByText(idleLabel)).toBeDefined();
    },
  );

  it("passes mode='summary' to ResumeInput", () => {
    render(<SummaryTailor jobDescription="" language="en" />);
    expect(screen.getByText("Professional Summary")).toBeDefined();
  });
});

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
  localStorage.clear();
});

const fetchCases: [Language, string][] = [
  ["en", "Tailor Summary"],
  ["zh", "摘要客製"],
];

describe("SummaryTailor fetching", () => {
  it.each(fetchCases)(
    "sends the correct request when submitted (%s)",
    async (language, idleLabel) => {
      mockFetch.mockResolvedValue({
        json: async () => ({ result: null }),
      });
      render(<SummaryTailor jobDescription="job desc" language={language} />);

      fireEvent.click(screen.getByText(idleLabel));
      await screen.findByText(idleLabel);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe("/api/tailor-summary");
      const sentBody = JSON.parse(options.body);
      expect(sentBody.jobDescription).toBe("job desc");
      expect(sentBody.language).toBe(language);
    },
  );

  it("reacts to the fetch response by updating the button and showing results", async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ result: { original: "x", rewritten: "y" } }),
    });
    render(<SummaryTailor jobDescription="job desc" language="en" />);

    fireEvent.click(screen.getByText("Tailor Summary"));
    await screen.findByText("Tailoring...");
    await screen.findByText("Re-tailor");
    expect(screen.getByText("y")).toBeDefined();
  });

  const refineCases: [Language, string, string, string, string][] = [
    [
      "en",
      "Tailor Summary",
      "Re-tailor",
      "Make sure to mention Javascript",
      "Refine Summary",
    ],
    [
      "zh",
      "摘要客製",
      "重新客製",
      "務必提及 Javascript",
      "精修摘要",
    ],
  ];

  it.each(refineCases)(
    "sends the correct refine request and updates results (%s)",
    async (language, idleLabel, doneLabel, refinePlaceholder, refineBtnLabel) => {
      mockFetch.mockResolvedValueOnce({
        json: async () => ({ result: { original: "x", rewritten: "y" } }),
      });
      render(<SummaryTailor jobDescription="job desc" language={language} />);

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
      expect(url).toBe("/api/refine-summary");
      const sentBody = JSON.parse(options.body);
      expect(sentBody.instruction).toBe("make it punchier");
      expect(sentBody.language).toBe(language);
      expect(sentBody.result).toEqual({ original: "x", rewritten: "y" });
    },
  );
});

const STORAGE_KEY = "summaryTailor.resume";

describe("SummaryTailor localStorage", () => {
  afterEach(() => vi.restoreAllMocks());

  beforeEach(() => {
    mockFetch.mockResolvedValue({
      json: async () => ({ result: { original: "x", rewritten: "y" } }),
    });
  });

  it("saves the resume when Tailor is clicked", async () => {
    render(<SummaryTailor jobDescription="job desc" language="en" />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "my resume" } });
    fireEvent.click(screen.getByText("Tailor Summary"));
    await screen.findByText("Re-tailor");

    expect(localStorage.getItem(STORAGE_KEY)).toBe("my resume");
  });

  it("loads the saved resume on mount", async () => {
    localStorage.setItem(STORAGE_KEY, "saved resume");
    render(<SummaryTailor jobDescription="job desc" language="en" />);

    expect(await screen.findByDisplayValue("saved resume")).toBeDefined();
  });

  it("sends the loaded resume when submitted", async () => {
    localStorage.setItem(STORAGE_KEY, "saved resume");
    render(<SummaryTailor jobDescription="job desc" language="en" />);
    await screen.findByDisplayValue("saved resume");

    fireEvent.click(screen.getByText("Tailor Summary"));
    await screen.findByText("Re-tailor");

    const sentBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(sentBody.resume).toBe("saved resume");
  });

  it("does not overwrite the saved resume when the input is blank", async () => {
    localStorage.setItem(STORAGE_KEY, "saved resume");
    render(<SummaryTailor jobDescription="job desc" language="en" />);
    await screen.findByDisplayValue("saved resume");

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "   " } });
    fireEvent.click(screen.getByText("Tailor Summary"));
    await screen.findByText("Re-tailor");

    expect(localStorage.getItem(STORAGE_KEY)).toBe("saved resume");
  });

  it("still tailors when saving to localStorage throws", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    render(<SummaryTailor jobDescription="job desc" language="en" />);

    fireEvent.change(screen.getByRole("textbox"), { target: { value: "my resume" } });
    fireEvent.click(screen.getByText("Tailor Summary"));
    await screen.findByText("Re-tailor");

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(screen.getByText("y")).toBeDefined();
  });

  it("renders an empty input when reading localStorage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    render(<SummaryTailor jobDescription="job desc" language="en" />);

    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("");
  });

  it("resets the button to idle when the request fails", async () => {
    mockFetch.mockRejectedValue(new Error("network"));
    render(<SummaryTailor jobDescription="job desc" language="en" />);

    fireEvent.click(screen.getByText("Tailor Summary"));
    await screen.findByText("Tailoring...");

    expect(await screen.findByText("Tailor Summary")).toBeDefined();
  });
});
