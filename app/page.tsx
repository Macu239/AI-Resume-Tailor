"use client";
import {
  JobDescriptionInput,
  BulletTailor,
  CoverLetterTailor,
  SummaryTailor,
  TabBar,
  LanguageToggle,
} from "../components";
import { useState } from "react";
import { Tab, Language } from "@/types";
import { translations } from "@/lib/translations";
import "./page.css";

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [tool, setTool] = useState<Tab>("bullet");
  const [language, setLanguage] = useState<Language>("en");

  return (
    <main className="mainContainer">
      <div className="pageHeader">
        <span className="headerDot" />
        <span className="headerBrand">{translations[language].Mainpage.title}</span>
        <LanguageToggle language={language} setLanguage={setLanguage} />
      </div>

      <JobDescriptionInput
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        language={language}
      />
      <TabBar tool={tool} setTool={setTool} language={language} />

      <div style={{ display: tool === "bullet" ? "block" : "none" }}>
        <BulletTailor jobDescription={jobDescription} language={language} />
      </div>
      <div style={{ display: tool === "coverLetter" ? "block" : "none" }}>
        <CoverLetterTailor jobDescription={jobDescription} language={language} />
      </div>
      <div style={{ display: tool === "summary" ? "block" : "none" }}>
        <SummaryTailor jobDescription={jobDescription} language={language} />
      </div>
    </main>
  );
}
