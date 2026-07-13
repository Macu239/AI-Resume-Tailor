import { Tab, Language } from "@/types";
import { translations } from "@/lib/translations";
import "./tabBar.css";

type TabBarProps = {
  tool: Tab;
  setTool: (tab: Tab) => void;
  language: Language;
};

export default function TabBar({ tool, setTool, language }: TabBarProps) {
  const { bullet, coverLetter, summary } = translations[language].tabbar;
  return (
    <div className="tabBar" role="tablist">
      <button
        className={tool === "bullet" ? "tab active" : "tab"}
        role="tab"
        aria-selected={tool === "bullet"}
        onClick={() => setTool("bullet")}
      >
        {bullet}
      </button>
      <button
        className={tool === "coverLetter" ? "tab active" : "tab"}
        role="tab"
        aria-selected={tool === "coverLetter"}
        onClick={() => setTool("coverLetter")}
      >
        {coverLetter}
      </button>
      <button
        className={tool === "summary" ? "tab active" : "tab"}
        role="tab"
        aria-selected={tool === "summary"}
        onClick={() => setTool("summary")}
      >
        {summary}
      </button>
    </div>
  );
}
