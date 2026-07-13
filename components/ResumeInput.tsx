"use client";
import "./ResumeInput.css";
import { Tab, Language } from "@/types";
import { translations } from "@/lib/translations";

type ResumeInputProps = {
  value: string;
  onChange: (value: string) => void;
  mode: Tab;
  language: Language;
};
  
export default function ResumeInput({ value, onChange, mode, language }: ResumeInputProps) {
  const { label, meta, placeholder } = translations[language].resumeInput[mode];
  return (
    <div className="ResumeInputContainer">
      <div className="inputLabelRow">
        <label>{label}</label>
        <span className="inputMeta">{meta}</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
