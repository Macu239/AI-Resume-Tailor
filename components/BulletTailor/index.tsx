"use client";
import {
  ResumeInput,
  ResultsPanel,
  SubmitBtn,
  LoadingSpinner,
} from "@/components";
import { TailorResult, TailorProps } from "@/types";
import { translations } from "@/lib/translations";
import { useState } from "react";
import "./bullet.css";

export default function BulletTailor({ jobDescription, language }: TailorProps) {
  const [resume, setResume] = useState("");
  const [results, setResults] = useState<TailorResult[]>([]);
  const [refinement, setRefinement] = useState("");
  const [refining, setRefining] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const text = translations[language].bulletTailor;

  async function handleSubmit() {
    setStatus("loading");
    const response = await fetch("/api/tailor-bullet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription, language }),
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
      body: JSON.stringify({ results, instruction: refinement, language }),
    });

    const data = await response.json();
    setResults(data.results ?? []);
    setRefining(false);
  }

  const buttonLabel =
    status === "loading"
      ? text.loadingLabel
      : status === "done" && (results?.length ?? 0) > 0
        ? text.doneLabel
        : text.idleLabel;

  return (
    <div>
      <div className="titleText">
        <h1 className="title">{text.title}</h1>
        <p className="description">{text.description}</p>
      </div>

      <ResumeInput value={resume} onChange={setResume} mode="bullet" language={language} />

      <div className="actionRow">
        <SubmitBtn
          onClick={handleSubmit}
          loading={status === "loading"}
          label={buttonLabel}
        />
        <span className="actionHint">{text.actionHint}</span>
      </div>

      {status === "loading" && <LoadingSpinner language={language} />}
      {status === "done" && results.length > 0 && (
        <ResultsPanel
          results={results}
          refinement={refinement}
          onRefinementChange={setRefinement}
          onRefine={handleRefine}
          refining={refining}
          language={language}
        />
      )}
    </div>
  );
}
