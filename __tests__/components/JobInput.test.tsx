import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import JobDescriptionInput from "@/components/JobInput";
import { Language } from "@/types";

afterEach(() => cleanup());

describe("JobDescriptionInput Language: English", () => {
  it("renders the input field", () => {
    render(<JobDescriptionInput jobDescription="" setJobDescription={vi.fn()} language="en" />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("calls the onChange handler when the input value changes", () => {
    const handleChange = vi.fn();
    render(<JobDescriptionInput jobDescription="" setJobDescription={handleChange} language="en" />);
    const input = "We need a SWE";
    fireEvent.change(screen.getByRole("textbox"), { target: { value: input } });
    expect(handleChange).toHaveBeenCalledWith(input);
  });
});

describe("JobDescriptionInput Language: Mandarin", () => {
  it("renders the input field", () => {
    render(<JobDescriptionInput jobDescription="" setJobDescription={vi.fn()} language="zh" />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("calls the onChange handler when the input value changes", () => {
    const handleChange = vi.fn();
    render(<JobDescriptionInput jobDescription="" setJobDescription={handleChange} language="zh" />);
    const input = "我們需要一位軟體工程師";
    fireEvent.change(screen.getByRole("textbox"), { target: { value: input } });
    expect(handleChange).toHaveBeenCalledWith(input);
  });
});

const labelCases: [Language, string][] = [
  ["en", "Job Description"],
  ["zh", "工作描述"],
];

describe("JobDescriptionInput - label per language", () => {
  it.each(labelCases)("renders the correct label for %s", (language, expectedLabel) => {
    render(<JobDescriptionInput jobDescription="" setJobDescription={vi.fn()} language={language} />);
    expect(screen.getByText(expectedLabel)).toBeDefined();
  });
});
