"use client";
import {
  ResumeInput,
  ParagraphOutPutPanel,
  SubmitBtn,
  LoadingSpinner,
} from "@/components";
import { TailorProps, TailorResult } from "@/types";
import { useState } from "react";
import "./Summary.css";

export default function SummaryTailor({ jobDescription }: TailorProps) {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState<TailorResult | null>(null);
  const [refinement, setRefinement] = useState("");
  const [refining, setRefining] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubmit() {
    setStatus("loading");
    const response = await fetch("/api/tailor-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription }),
    });

    const data = await response.json();
    setResult(data.result ?? null);
    setStatus("done");
  }

  async function handleRefine() {
    setRefining(true);
    const response = await fetch("/api/refine-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result, instruction: refinement }),
    });

    const data = await response.json();
    setResult(data.result ?? null);
    setRefining(false);
  }

  const buttonLabel =
    status === "loading"
      ? "Tailoring..."
      : status === "done" && result != null
        ? "Re-tailor"
        : "Tailor Summary";

  return (
    <div>
      <div className="titleText">
        <h1 className="title">Tailor your summary to the job.</h1>
        <p className="description">
          Paste your resume summary. Get back sharper, quantified writing
          aligned to the role.
        </p>
      </div>

      <ResumeInput value={resume} onChange={setResume} mode="summary" />

      <div className="actionRow">
        <SubmitBtn
          onClick={handleSubmit}
          loading={status === "loading"}
          label={buttonLabel}
        />
        <span className="actionHint">results appear below</span>
      </div>
      
      {status === "loading" && <LoadingSpinner />}
      {status === "done" && result !== null && (
        <ParagraphOutPutPanel
          result={result}
          refinement={refinement}
          onRefinementChange={setRefinement}
          onRefine={handleRefine}
          refining={refining}
          mode="summary"
        />
      )}
    </div>
  );
}
