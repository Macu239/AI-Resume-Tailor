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
      <h1>Tailor your resume with AI</h1>
      <ResumeInput value={resume} onChange={setResume} />
      <JobDescriptionInput
        value={jobDescription}
        onChange={setJobDescription}
      />
      <SubmitBtn onClick={handleSubmit} loading={loading} />
      <ResultsPanel results={results} />
    </main>
  );
}
