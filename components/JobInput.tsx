import "./JobInput.css";
import { useState } from "react";

export default function JobDescriptionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="JobInputContainer">
      <div className="inputLabelRow">
        <label>Job description</label>
        <span className="inputMeta">paste full text</span>
      </div>
      <textarea
        placeholder="Paste the job description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
