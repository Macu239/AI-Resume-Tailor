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
      <div className="inputLabelRow">
        <label>Resume bullets</label>
        <span className="inputMeta">one per line</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="- Led a team of 5 engineers..."
      />
    </div>
  );
}
