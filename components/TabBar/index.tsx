import { Tab } from "@/types";
import "./tabBar.css";

type TabBarProps = {
  tool: Tab;
  setTool: (tab: Tab) => void;
};

export default function TabBar({ tool, setTool }: TabBarProps) {
  return (
    <div className="tabBar" role="tablist">
      <button
        className={tool === "bullet" ? "tab active" : "tab"}
        role="tab"
        aria-selected={tool === "bullet"}
        onClick={() => setTool("bullet")}
      >
        Bullet Tailor
      </button>
      <button
        className={tool === "coverLetter" ? "tab active" : "tab"}
        role="tab"
        aria-selected={tool === "coverLetter"}
        onClick={() => setTool("coverLetter")}
      >
        Cover Letter
      </button>
      <button
        className={tool === "summary" ? "tab active" : "tab"}
        role="tab"
        aria-selected={tool === "summary"}
        onClick={() => setTool("summary")}
      >
        Summary Tailor
      </button>
    </div>
  );
}
