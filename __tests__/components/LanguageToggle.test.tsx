import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import LanguageToggle from "@/components/LanguageToggle";

describe("LanguageToggle", () => {
  afterEach(() => cleanup());

  it("renders both language buttons", () => {
    render(<LanguageToggle language="en" setLanguage={vi.fn()} />);
    expect(screen.getByText("EN")).toBeDefined();
    expect(screen.getByText("中文")).toBeDefined();
  });

  it("marks 中文 as pressed when language is zh", () => {
    render(<LanguageToggle language="zh" setLanguage={vi.fn()} />);
    expect(screen.getByText("EN").getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByText("中文").getAttribute("aria-pressed")).toBe("true");
  });

  it("marks EN as pressed when language is en", () => {
    render(<LanguageToggle language="en" setLanguage={vi.fn()} />);
    expect(screen.getByText("EN").getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("中文").getAttribute("aria-pressed")).toBe("false");
  });

  it("calls setLanguage with zh when the Chinese button is clicked", () => {
    const setLanguage = vi.fn();
    render(<LanguageToggle language="en" setLanguage={setLanguage} />);
    fireEvent.click(screen.getByText("中文"));
    expect(setLanguage).toHaveBeenCalledWith("zh");
  });

  it("calls setLanguage with en when the English button is clicked", () => {
    const setLanguage = vi.fn();
    render(<LanguageToggle language="zh" setLanguage={setLanguage} />);
    fireEvent.click(screen.getByText("EN"));
    expect(setLanguage).toHaveBeenCalledWith("en");
  });
});
