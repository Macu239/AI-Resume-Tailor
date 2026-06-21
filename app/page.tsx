"use client"
import Image from "next/image";
import {ResumeInput} from "../components"
import { BulletResult } from "@/types";
import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("")
  const [results, setResults] = useState<BulletResult[]>([])
  const [jobDescription, setJobDescription] = useState("")
const [loading, setLoading] = useState(false)

async function handleSubmit() {
  setLoading(true)
  const reponse = await fetch("/api/tailor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      resume,
      jobDescription
    })
  })

  const data = await reponse.json()
  console.log(data)
  setResults(data.bullets)
  
  setLoading(false)
}

  return (
    <main className="mainContainer">
      <h1>Tailor your resume with AI</h1>
      <textarea
      placeholder="Paste your resume bullets..."
      value={resume}
      onChange={(e) => setResume(e.target.value)}
      rows={10}
    />

    <textarea
      placeholder="Paste the job description..."
      value={jobDescription}
      onChange={(e) => setJobDescription(e.target.value)}
      rows={10}
    />

    <button onClick={handleSubmit} disabled={loading}>
      {loading ? "Tailoring..." : "Tailor Resume"}
    </button>

    {results.map((bullet, index) => (
      <div key={index}>
        <p><strong>Original:</strong> {bullet.original}</p>
        <p><strong>Rewritten:</strong> {bullet.rewritten}</p>
      </div>
    ))}
    </main>
  );
}
