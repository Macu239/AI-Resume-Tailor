import "./ResultsPanel.css";

type ResultsPanelProps = {
  results: { original: string; rewritten: string }[];
};

export default function ResultsPanel({ results }: ResultsPanelProps) {
  return (
    <div className="resultsPanelContainer">
      <div className="resultsPanelTitle">
        <h2>Tailored bullets</h2>
        <h3 className="subTitle">
          <p>Original</p>
          <p>Rewritten</p>
        </h3>
        
      </div>
      {results.map((bullet, index) => (
        <div key={index} className="resultRows">
          <p>
            <strong></strong> {bullet.original}
          </p>
          <p>
            <strong></strong> {bullet.rewritten}
          </p>
        </div>
      ))}
    </div>
  );
}
