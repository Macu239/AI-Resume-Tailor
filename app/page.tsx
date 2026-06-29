"use client";
import {
  JobDescriptionInput,
  BulletTailor,
  CvTailor,
  SummaryTailor,
  TabBar,
} from "../components";
import { useState } from "react";
import { Tab } from "@/types";
import "./page.css";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [tool, setTool] = useState<Tab>("bullet");

  return (
    <main className="mainContainer">
      <div className="pageHeader">
        <span className="headerDot" />
        <span className="headerBrand">Resume Tailor</span>
      </div>

      <JobDescriptionInput
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
      />
      <TabBar tool={tool} setTool={setTool} />

      <div style={{ display: tool === "bullet" ? "block" : "none" }}>
        <BulletTailor jobDescription={jobDescription} />
      </div>
      <div style={{ display: tool === "cv" ? "block" : "none" }}>
        <CvTailor jobDescription={jobDescription} />
      </div>
      <div style={{ display: tool === "summary" ? "block" : "none" }}>
        <SummaryTailor jobDescription={jobDescription} />
      </div>
    </main>
  );
}
