import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import JobDescriptionInput from "@/components/JobInput";

describe("JobDescriptionInput", () => {
  afterEach(() => cleanup());

  it("renders the input field", () => {
    render(<JobDescriptionInput jobDescription="" setJobDescription={vi.fn()} />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("renders the label", () => {
    render(<JobDescriptionInput jobDescription="" setJobDescription={vi.fn()} />);
    expect(screen.getByText("Job Description")).toBeDefined();
  });

  it("calls the onChange handler when the input value changes", () => {
    const handleChange = vi.fn();
    render(<JobDescriptionInput jobDescription="" setJobDescription={handleChange} />);
    const input = "We need a SWE";
    fireEvent.change(screen.getByRole("textbox"), { target: { value: input } });
    expect(handleChange).toHaveBeenCalledWith(input);
  });
});
