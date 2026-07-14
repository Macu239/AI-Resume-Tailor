import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ResumeInput from "@/components/ResumeInput";
import { Language, Tab } from "@/types";

afterEach(() => cleanup());

describe("Resume input Language: English", () => {
  it("renders the input field", () => {
    render(<ResumeInput value="" onChange={vi.fn()} mode="bullet" language="en" />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("calls the onChange handler when the input value changes", () => {
    const handleChange = vi.fn();
    render(<ResumeInput value="" onChange={handleChange} mode="bullet" language="en" />);
    const input = "I am really good at coding";
    fireEvent.change(screen.getByRole("textbox"), { target: { value: input } });
    expect(handleChange).toHaveBeenCalledWith(input);
  });
});

describe("Resume input Language: Mandarin", () => {
  it("renders the input field", () => {
    render(<ResumeInput value="" onChange={vi.fn()} mode="bullet" language="zh" />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("calls the onChange handler when the input value changes", () => {
    const handleChange = vi.fn();
    render(<ResumeInput value="" onChange={handleChange} mode="bullet" language="zh" />);
    const input = "我真的超會寫程式";
    fireEvent.change(screen.getByRole("textbox"), { target: { value: input } });
    expect(handleChange).toHaveBeenCalledWith(input);
  });
});

const labelCases: [Language, Tab, string][] = [
  ["en", "bullet", "Resume Bullets"],
  ["en", "summary", "Professional Summary"],
  ["en", "coverLetter", "Whole Resume"],
  ["zh", "bullet", "履歷條列"],
  ["zh", "summary", "專業摘要"],
  ["zh", "coverLetter", "完整履歷"],
];

describe("Resume input - label per mode/language", () => {
  it.each(labelCases)("renders the correct label for %s / %s", (language, mode, expectedLabel) => {
    render(<ResumeInput value="" onChange={vi.fn()} mode={mode} language={language} />);
    expect(screen.getByText(expectedLabel)).toBeDefined();
  });
});
