export type TailorRequest = {
  resume: string;
  jobDescription: string;
  language: Language;
};

export type TailorResult = {
  original: string;
  rewritten: string;
};

export type RefineRequest = {
  results: TailorResult[];
  instruction: string;
  language: Language;
};

export type RefineSingleRequest = {
  result: TailorResult;
  instruction: string;
  language: Language;
};

export type TailorProps = {
  jobDescription: string;
  language: Language;
};

export type Tab = "bullet" | "coverLetter" | "summary";

export type Language = "en" | "zh"
