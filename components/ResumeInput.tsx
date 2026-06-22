"use client";
import "./ResumeInput.css";
import { useState } from "react";

type ResumeInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ResumeInput({ value, onChange }: ResumeInputProps) {
  return (
    <div className="ResumeInputContainer">
      <label>Paste your resume bullets</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="- Led a team of 5 engineers..."
        rows={10}
      />
    </div>
  );
}
