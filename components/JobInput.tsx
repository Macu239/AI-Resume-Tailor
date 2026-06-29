import "./JobInput.css";

type JobDescriptionInputProps = {
  jobDescription: string;
  setJobDescription: (value: string) => void;
};

export default function JobDescriptionInput({ jobDescription, setJobDescription }: JobDescriptionInputProps) {
  return (
    <div className="JobInputContainer">
      <div className="inputLabelRow">
        <label>Job Description</label>
        <span className="inputMeta">paste full text</span>
      </div>
      <textarea
        placeholder="Paste the job description..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
    </div>
  );
}
