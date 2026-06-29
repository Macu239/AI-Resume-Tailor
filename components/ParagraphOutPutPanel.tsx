import { TailorResult, Tab } from "@/types";
import { useState, useCallback } from "react";
import "./ParagraphOutPutPanel.css";

type ParagraphOutPutPanelProps = {
  result: TailorResult;
  refinement: string;
  onRefinementChange: (value: string) => void;
  onRefine: () => void;
  refining: boolean;
  mode: Tab;
};

const config: Record<Tab, { title: string; refinePlaceHolder: string; refineBtn: string }> = {
  bullet: {
    title: "",
    refinePlaceHolder: "",
    refineBtn: "",
  },
  summary: {
    title: "Tailored Summary:",
    refinePlaceHolder: "Make sure to mention Javascript",
    refineBtn: "Refine Summary",
  },
  coverLetter: {
    title: "Tailored Cover Letter:",
    refinePlaceHolder: "Highlight the GPA calculator",
    refineBtn: "Refine Cover Letter",
  },
};

export default function ParagraphOutPutPanel({
  result,
  refinement,
  onRefinementChange,
  onRefine,
  refining,
  mode,
}: ParagraphOutPutPanelProps) {
  const [copied, setCopied] = useState<boolean | null>(null);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(null), 1300);
  }, []);
  const { title, refinePlaceHolder, refineBtn } = config[mode];
  return (
    <div className="ParagraphOutPutPanelContainer">
      <span className="ParagraphOutPutPanelTitle">{title}</span>
      <div className="columnHeaders">
        <span className="colHeader colOriginal">Original</span>
        <span className="colHeader colRewritten">Rewritten</span>
      </div>
      <div className="ParagraphOutPutresult">
        <p className="cellOriginal">{result.original}</p>
        <div className="cellRewritten">
          <p>{result.rewritten}</p>
          <button className="copyRowBtn" onClick={() => copy(result.rewritten)}>
            {copied ? "copied" : "copy"}
          </button>
        </div>
      </div>
      <div className="refineSection">
        <span className="refineLabel">Refine</span>
        <textarea
          className="refineTextarea"
          value={refinement}
          onChange={(e) => onRefinementChange(e.target.value)}
          placeholder={refinePlaceHolder}
          rows={2}
          disabled={refining}
        />
        <div className="refineActions">
          <button
            className="refineBtn"
            onClick={onRefine}
            disabled={refining || !refinement.trim()}
          >
            {refining ? "Refining..." : refineBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
