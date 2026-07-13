import { TailorResult, Language } from "@/types";
import { translations } from "@/lib/translations";
import { useState, useCallback } from "react";
import "./ParagraphOutPutPanel.css";

type ParagraphOutPutPanelProps = {
  result: TailorResult;
  refinement: string;
  onRefinementChange: (value: string) => void;
  onRefine: () => void;
  refining: boolean;
  mode: "summary" | "coverLetter";
  language: Language;
};

export default function ParagraphOutPutPanel({
  result,
  refinement,
  onRefinementChange,
  onRefine,
  refining,
  mode,
  language,
}: ParagraphOutPutPanelProps) {
  const [copied, setCopied] = useState<boolean | null>(null);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(null), 1300);
  }, []);
  const { title, refinePlaceholder, refineBtn, refiningLabel } = translations[language].paragraphOutput[mode];
  const { colOriginal, colRewritten, refineLabel, copyLabel, copiedLabel } = translations[language].output;
  return (
    <div className="ParagraphOutPutPanelContainer">
      <span className="ParagraphOutPutPanelTitle">{title}</span>
      <div className="columnHeaders">
        <span className="colHeader colOriginal">{colOriginal}</span>
        <span className="colHeader colRewritten">{colRewritten}</span>
      </div>
      <div className="ParagraphOutPutresult">
        <p className="cellOriginal">{result.original}</p>
        <div className="cellRewritten">
          <p>{result.rewritten}</p>
          <button className="copyRowBtn" onClick={() => copy(result.rewritten)}>
            {copied ? copiedLabel : copyLabel}
          </button>
        </div>
      </div>
      <div className="refineSection">
        <span className="refineLabel">{refineLabel}</span>
        <textarea
          className="refineTextarea"
          value={refinement}
          onChange={(e) => onRefinementChange(e.target.value)}
          placeholder={refinePlaceholder}
          rows={2}
          disabled={refining}
        />
        <div className="refineActions">
          <button
            className="refineBtn"
            onClick={onRefine}
            disabled={refining || !refinement.trim()}
          >
            {refining ? refiningLabel : refineBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
