export type TailorRequest = {
  resume: string;
  jobDescription: string;
};

export type TailorResult = {
  original: string;
  rewritten: string;
};

export type RefineRequest = {
  results: TailorResult[];
  instruction: string;
};

export type TailorProps = {
  jobDescription: string;
};

export type Tab = "bullet" | "cv" | "summary";
