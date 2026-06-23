"use client";
import {
  ResumeInput,
  JobDescriptionInput,
  ResultsPanel,
  SubmitBtn,
  LoadingSpinner,
} from "../components";
import { BulletResult } from "@/types";
import { useState } from "react";
import "./page.css";

export default function Home() {
  const [resume, setResume] = useState("");
  const [results, setResults] = useState<BulletResult[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [refinement, setRefinement] = useState("");
  const [refining, setRefining] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("done");
  const mockResults: BulletResult[] = [
    {
      original: "Worked on a web app using React and helped fix bugs",
      rewritten:
        "Shipped 12+ user-facing features for a React web app serving 5,000+ monthly users, cutting reported bugs by 40%.",
    },
    {
      original: "Did a group project where we built a database for a class",
      rewritten:
        "Designed a normalized PostgreSQL schema for a 4-person project, reducing average query latency by 60%.",
    },
    {
      original: "Interned at a startup and wrote some Python scripts",
      rewritten:
        "Automated ETL pipeline tasks in Python during a summer internship, saving the team ~10 engineering hours per week.",
    },
  ];

  async function handleSubmit() {
    setStatus("loading");
    const response = await fetch("/api/tailor", {
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
    const response = await fetch("/api/refine", {
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
    <main className="mainContainer">
      <div className="pageHeader">
        <span className="headerDot" />
        <span className="headerBrand">Resume Tailor</span>
      </div>

      <div className="titleText">
        <h1 className="title">Tailor your bullets to the job.</h1>
        <p className="description">
          Paste your resume bullets and the job description. Get back sharper,
          quantified writing aligned to the role.
        </p>
      </div>

      <div className="inputContainer">
        <ResumeInput value={resume} onChange={setResume} />
        <JobDescriptionInput
          value={jobDescription}
          onChange={setJobDescription}
        />
      </div>

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
    </main>
  );
}
