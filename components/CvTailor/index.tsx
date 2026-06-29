"use client";
import {
  ResumeInput,
  ParagraphOutPutPanel,
  SubmitBtn,
  LoadingSpinner,
} from "@/components";
import { TailorProps, TailorResult } from "@/types";
import { useState } from "react";
import "./Cv.css";

export default function CoverLetterTailor({ jobDescription }: TailorProps) {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState<TailorResult | null>(null);
  const [refinement, setRefinement] = useState("");
  const [refining, setRefining] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubmit() {
    setStatus("loading");
    const response = await fetch("/api/tailor-cv", {
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
    const response = await fetch("/api/refine-cv", {
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
      ? "Generating..."
      : status === "done" && result != null
        ? "Regenerate"
        : "Generate Cover Letter";

  return (
    <div>
      <div className="titleText">
        <h1 className="title">Write a cover letter for the job.</h1>
        <p className="description">
          Paste your resume and the job description. Get back a tailored cover
          letter that draws from your real experience.
        </p>
      </div>

      <ResumeInput value={resume} onChange={setResume} mode="coverLetter" />

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
          mode="coverLetter"
        />
      )}
    </div>
  );
}
