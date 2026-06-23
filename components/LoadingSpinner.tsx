"use client";
import { useState, useEffect } from "react";
import "./LoadingSpinner.css";

const steps = [
  "Reading the job description",
  "Matching keywords and skills",
  "Rewriting your bullets",
];

const skeletonRows = [
  { left: "90%", left2: "52%", right: "100%", right2: "68%" },
  { left: "85%", left2: "60%", right: "95%",  right2: "55%" },
  { left: "92%", left2: "48%", right: "88%",  right2: "72%" },
];

export default function LoadingSpinner() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 540);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loadingContainer">
      <div className="statusRow">
        <div className="pulseDot" />
        <span className="statusText">{steps[stepIndex]}</span>
      </div>

      <div className="skeletonRows">
        {skeletonRows.map((row, i) => (
          <div key={i} className="skeletonRow" style={{ animationDelay: `${i * 120}ms` }}>
            <div className="skeletonCell">
              <div className="skeletonBar" style={{ width: row.left }} />
              <div className="skeletonBar" style={{ width: row.left2 }} />
            </div>
            <div className="skeletonCell">
              <div className="skeletonBar" style={{ width: row.right }} />
              <div className="skeletonBar" style={{ width: row.right2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
