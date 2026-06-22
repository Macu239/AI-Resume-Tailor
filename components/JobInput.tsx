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
      <label>Paste the job description</label>
      <textarea
        placeholder="Paste the job description..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
      />
    </div>
  );
}
