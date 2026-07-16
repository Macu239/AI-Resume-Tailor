import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import TabBar from "@/components/TabBar";
import { Tab, Language } from "@/types";
afterEach(() => cleanup());

describe("TabBar", () => {
  it("renders all tabs", () => {
    render(<TabBar tool="bullet" setTool={vi.fn()} language="en" />);
    expect(screen.getByText("Bullet Points")).toBeDefined();
    expect(screen.getByText("Summary")).toBeDefined();
    expect(screen.getByText("Cover Letter")).toBeDefined();
  });
  it("marks bullet as pressed when tool is bullet", () => {
    render(<TabBar tool="bullet" setTool={vi.fn()} language="en" />);
    expect(
      screen.getByText("Bullet Points").getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByText("Summary").getAttribute("aria-selected")).toBe(
      "false",
    );
    expect(screen.getByText("Cover Letter").getAttribute("aria-selected")).toBe(
      "false",
    );
  });

  it("marks summary as pressed when tool is summary", () => {
    render(<TabBar tool="summary" setTool={vi.fn()} language="en" />);
    expect(
      screen.getByText("Bullet Points").getAttribute("aria-selected"),
    ).toBe("false");
    expect(screen.getByText("Summary").getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getByText("Cover Letter").getAttribute("aria-selected")).toBe(
      "false",
    );
  });

  it("marks cover letter as pressed when tool is coverLetter", () => {
    render(<TabBar tool="coverLetter" setTool={vi.fn()} language="en" />);
    expect(
      screen.getByText("Bullet Points").getAttribute("aria-selected"),
    ).toBe("false");
    expect(screen.getByText("Summary").getAttribute("aria-selected")).toBe(
      "false",
    );
    expect(screen.getByText("Cover Letter").getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("calls the onChange handler when the clicked", () => {
    const setTool = vi.fn();
    render(<TabBar tool="bullet" setTool={setTool} language="en" />);
    fireEvent.click(screen.getByText("Bullet Points"));
    expect(setTool).toHaveBeenCalledWith("bullet");
  });
});

const labelCases: [Language, Tab, string][] = [
  ["en", "bullet", "Bullet Points"],
  ["en", "summary", "Summary"],
  ["en", "coverLetter", "Cover Letter"],
  ["zh", "bullet", "重點整理"],
  ["zh", "summary", "自我介紹"],
  ["zh", "coverLetter", "求職信"],
];

describe("Tab Bar - label per mode/language", () => {
  it.each(labelCases)(
    "renders the correct label for %s / %s",
    (language, mode, expectedLabel) => {
      render(<TabBar tool={mode} setTool={vi.fn()} language={language} />);
      expect(screen.getByText(expectedLabel)).toBeDefined();
    },
  );
});
