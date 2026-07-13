"use client";
import {
  ResumeInput,
  ParagraphOutPutPanel,
  SubmitBtn,
  LoadingSpinner,
} from "@/components";
import { TailorProps, TailorResult } from "@/types";
import { translations } from "@/lib/translations";
import { useState } from "react";
import "./Coverletter.css";

export default function CoverLetterTailor({ jobDescription, language }: TailorProps) {
  const [resume, setResume] = useState("");
  const [result, setResult] = useState<TailorResult | null>(null);
  const [refinement, setRefinement] = useState("");
  const [refining, setRefining] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const text = translations[language].coverLetterTailor;

  async function handleSubmit() {
    setStatus("loading");
    const response = await fetch("/api/tailor-cv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription, language }),
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
      body: JSON.stringify({ result, instruction: refinement, language }),
    });

    const data = await response.json();
    setResult(data.result ?? null);
    setRefining(false);
  }

  const buttonLabel =
    status === "loading"
      ? text.loadingLabel
      : status === "done" && result != null
        ? text.doneLabel
        : text.idleLabel;

  return (
    <div>
      <div className="titleText">
        <h1 className="title">{text.title}</h1>
        <p className="description">{text.description}</p>
      </div>

      <ResumeInput value={resume} onChange={setResume} mode="coverLetter" language={language} />

      <div className="actionRow">
        <SubmitBtn
          onClick={handleSubmit}
          loading={status === "loading"}
          label={buttonLabel}
        />
        <span className="actionHint">{text.actionHint}</span>
      </div>

      {status === "loading" && <LoadingSpinner language={language} />}
      {status === "done" && result !== null && (
        <ParagraphOutPutPanel
          result={result}
          refinement={refinement}
          onRefinementChange={setRefinement}
          onRefine={handleRefine}
          refining={refining}
          mode="coverLetter"
          language={language}
        />
      )}
    </div>
  );
}
