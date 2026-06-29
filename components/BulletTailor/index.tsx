"use client";
import {
  ResumeInput,
  ResultsPanel,
  SubmitBtn,
  LoadingSpinner,
} from "@/components";
import { TailorResult, TailorProps } from "@/types";
import { useState } from "react";
import "./bullet.css";

export default function BulletTailor({ jobDescription }: TailorProps) {
  const [resume, setResume] = useState("");
  const [results, setResults] = useState<TailorResult[]>([]);
  const [refinement, setRefinement] = useState("");
  const [refining, setRefining] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  async function handleSubmit() {
    setStatus("loading");
    const response = await fetch("/api/tailor-bullet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription }),
    });

    const data = await response.json();
    setResults(data.results ?? []);
    setStatus("done");
  }

  async function handleRefine() {
    setRefining(true);
    const response = await fetch("/api/refine-bullet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results, instruction: refinement }),
    });

    const data = await response.json();
    setResults(data.results ?? []);
    setRefining(false);
  }

  const buttonLabel =
    status === "loading"
      ? "Tailoring..."
      : status === "done" && (results?.length ?? 0) > 0
        ? "Re-tailor"
        : "Tailor bullets";

  return (
    <div>
      <div className="titleText">
        <h1 className="title">Tailor your bullets to the job.</h1>
        <p className="description">
          Paste your resume bullets and the job description. Get back sharper,
          quantified writing aligned to the role.
        </p>
      </div>

      <ResumeInput value={resume} onChange={setResume} mode="bullet" />

      <div className="actionRow">
        <SubmitBtn
          onClick={handleSubmit}
          loading={status === "loading"}
          label={buttonLabel}
        />
        <span className="actionHint">results appear below</span>
      </div>

      {status === "loading" && <LoadingSpinner />}
      {status === "done" && results.length > 0 && (
        <ResultsPanel
          results={results}
          refinement={refinement}
          onRefinementChange={setRefinement}
          onRefine={handleRefine}
          refining={refining}
        />
      )}
    </div>
  );
}
