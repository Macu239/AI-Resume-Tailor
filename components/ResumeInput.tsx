"use client";
import "./ResumeInput.css";
import { Tab } from "@/types";

type ResumeInputProps = {
  value: string;
  onChange: (value: string) => void;
  mode: Tab;
};

const config: Record<Tab, { label: string; meta: string; placeholder: string }> = {
  bullet: {
    label: "Resume Bullets",
    meta: "one per line",
    placeholder: "- Led a team of 5 engineers...",
  },
  summary: {
    label: "Professional Summary",
    meta: "1-3 sentences",
    placeholder: "Experienced software engineer with 3+ years building...",
  },
  coverLetter: {
    label: "Whole Resume",
    meta: "paste full Resume",
    placeholder: "Paste your full Resume here...",
  },
};

export default function ResumeInput({ value, onChange, mode }: ResumeInputProps) {
  const { label, meta, placeholder } = config[mode];
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
