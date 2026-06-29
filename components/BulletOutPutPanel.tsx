"use client";
import { useState, useCallback } from "react";
import { TailorResult } from "@/types";
import "./BulletOutPutPanel.css";

type ResultsPanelProps = {
  results: TailorResult[];
  refinement: string;
  onRefinementChange: (value: string) => void;
  onRefine: () => void;
  refining: boolean;
};

export default function ResultsPanel({
  results = [],
  refinement,
  onRefinementChange,
  onRefine,
  refining,
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

  return (
    <div className="resultsPanelContainer">
      <div className="resultsPanelTopRow">
        <span className="resultsPanelTitle">Tailored bullets</span>
        <button className="copyAllBtn" onClick={copyAll}>
          {copiedAll ? "copied" : "copy all"}
        </button>
      </div>

      <div className="columnHeaders">
        <span className="colHeader colOriginal">Original</span>
        <span className="colHeader colRewritten">Rewritten</span>
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
              {copiedIndex === index ? "copied" : "copy"}
            </button>
          </div>
        </div>
      ))}

      <p className="resultsFootnote">
        {results.length} of {results.length} rewritten
      </p>

      <div className="refineSection">
        <span className="refineLabel">Refine</span>
        <textarea
          className="refineTextarea"
          value={refinement}
          onChange={(e) => onRefinementChange(e.target.value)}
          placeholder="Shorter, more precise on Python, emphasize leadership..."
          rows={2}
          disabled={refining}
        />
        <div className="refineActions">
          <button
            className="refineBtn"
            onClick={onRefine}
            disabled={refining || !refinement.trim()}
          >
            {refining ? "Refining..." : "Refine bullets"}
          </button>
        </div>
      </div>
    </div>
  );
}
