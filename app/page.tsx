"use client";
import Image from "next/image";
import {
  ResumeInput,
  JobDescriptionInput,
  ResultsPanel,
  SubmitBtn,
} from "../components";
import { BulletResult } from "@/types";
import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [results, setResults] = useState<BulletResult[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const reponse = await fetch("/api/tailor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resume,
        jobDescription,
      }),
    });

    const data = await reponse.json();
    console.log(data);
    setResults(data.bullets);

    setLoading(false);
  }

  return (
    <main className="mainContainer">
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

      <SubmitBtn onClick={handleSubmit} loading={loading} />
      <ResultsPanel results={mockResults} />
    </main>
  );
}
