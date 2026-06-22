import "./ResultsPanel.css";

type ResultsPanelProps = {
  results: { original: string; rewritten: string }[];
};

export default function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="ResultsPanelContainer">
      {results.map((bullet, index) => (
        <div key={index}>
          <p>
            <strong>Original:</strong> {bullet.original}
          </p>
          <p>
            <strong>Rewritten:</strong> {bullet.rewritten}
          </p>
        </div>
      ))}
    </div>
  );
}
