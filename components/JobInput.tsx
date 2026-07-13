import { Language } from "@/types";
import { translations } from "@/lib/translations";
import "./JobInput.css";

type JobDescriptionInputProps = {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  language?: Language;
};

export default function JobDescriptionInput({
  jobDescription,
  setJobDescription,
  language = "en",
}: JobDescriptionInputProps) {
  const { label, meta, placeholder } = translations[language].jobDescriptionInput;
  return (
    <div className="JobInputContainer">
      <div className="inputLabelRow">
        <label>{label}</label>
        <span className="inputMeta">{meta}</span>
      </div>
      <textarea
        placeholder={placeholder}
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />
    </div>
  );
}
