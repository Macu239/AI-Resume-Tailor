"use client";
import { useState, useCallback } from "react";
import { TailorResult, Language } from "@/types";
import { translations } from "@/lib/translations";
import "./BulletOutPutPanel.css";

type ResultsPanelProps = {
  results: TailorResult[];
  refinement: string;
  onRefinementChange: (value: string) => void;
  onRefine: () => void;
  refining: boolean;
  language: Language;
};

export default function ResultsPanel({
  results = [],
  refinement,
  onRefinementChange,
  onRefine,
  refining,
  language,
}: ResultsPanelProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const copyRow = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1300);
  }, []);

  const copyAll = useCallback(() => {
    const text = results.map((r) => r.rewritten).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1300);
  }, [results]);

  const { colOriginal, colRewritten, refineLabel, copyLabel, copiedLabel } = translations[language].output;
  const { title, copyAllLabel, footnote, refinePlaceholder, refineBtn, refiningLabel } =
    translations[language].bulletOutput;

  return (
    <div className="resultsPanelContainer">
      <div className="resultsPanelTopRow">
        <span className="resultsPanelTitle">{title}</span>
        <button className="copyAllBtn" onClick={copyAll}>
          {copiedAll ? copiedLabel : copyAllLabel}
        </button>
      </div>

      <div className="columnHeaders">
        <span className="colHeader colOriginal">{colOriginal}</span>
        <span className="colHeader colRewritten">{colRewritten}</span>
      </div>

      {results.map((bullet, index) => (
        <div
          key={index}
          className="resultRow"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <p className="cellOriginal">{bullet.original}</p>
          <div className="cellRewritten">
            <p>{bullet.rewritten}</p>
            <button
              className="copyRowBtn"
              onClick={() => copyRow(bullet.rewritten, index)}
            >
              {copiedIndex === index ? copiedLabel : copyLabel}
            </button>
          </div>
        </div>
      ))}

      <p className="resultsFootnote">
        {footnote.replace(/\{count\}/g, String(results.length))}
      </p>

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
