import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ResumeInput from "@/components/ResumeInput";

describe("Resume input", () => {
  afterEach(() => cleanup());

  it("renders the input field", () => {
    render(<ResumeInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("renders the label", () => {
    render(<ResumeInput value="" onChange={vi.fn()} />);
    expect(screen.getByText("Resume Bullets")).toBeDefined();
  });

  it("calls the onChange handler when the input value changes", () => {
    const handleChange = vi.fn();
    render(<ResumeInput value="" onChange={handleChange} />);
    const input = "I am really good at coding";
    fireEvent.change(screen.getByRole("textbox"), { target: { value: input } });
    expect(handleChange).toHaveBeenCalledWith(input);
  });
});
