"use client";
import {
  ResumeInput,
  PargraphOutPutPannel,
  SubmitBtn,
  LoadingSpinner,
} from "@/components";
import { TailorProps, TailorResult } from "@/types";
import { useState } from "react";
import "./Cv.css";

export default function CvTrailor({ jobDescription }: TailorProps) {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState<TailorResult | null>(null);
  const [refinement, setRefinement] = useState("");
  const [refining, setRefining] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("done");
  const mockResult: TailorResult = {
    original: "I want a job",
    rewritten: "I love your company and i am a good employee.",
  };
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
      ? "Tailoring..."
      : status === "done" && result != null
        ? "Re-tailor"
        : "Generate CV";
  return (
    <div>
      <div className="titleText">
        <h1 className="title">Making your CV to fit the job</h1>
        <p className="description">
          Paste your resume bullets and the job description. Get back CV to send with the Resume.
        </p>
      </div>

      <ResumeInput value={resume} onChange={setResume} mode="cv" />

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
        <PargraphOutPutPannel
          result={result}
          refinement={refinement}
          onRefinementChange={setRefinement}
          onRefine={handleRefine}
          refining={refining}
          mode="cv"
        />
      )}
    </div>
  );
}
