import { Language, Tab } from "@/types";

type Translations = {
    Mainpage: { title: string };
    jobDescriptionInput: {
        label: string;
        meta: string;
        placeholder: string;
    };
    resumeInput: Record<Tab, {
        label: string;
        meta: string;
        placeholder: string;
    }>;
    tabbar: Record<Tab, string>;
    submitButton: {
        label: string;
    };
    bulletTailor: {
        title: string;
        description: string;
        actionHint: string;
        idleLabel: string;
        loadingLabel: string;
        doneLabel: string;
    };
    coverLetterTailor: {
        title: string;
        description: string;
        actionHint: string;
        idleLabel: string;
        loadingLabel: string;
        doneLabel: string;
    };
    summaryTailor: {
        title: string;
        description: string;
        actionHint: string;
        idleLabel: string;
        loadingLabel: string;
        doneLabel: string;
    };
    output: {
        colOriginal: string;
        colRewritten: string;
        refineLabel: string;
        copyLabel: string;
        copiedLabel: string;
    };
    paragraphOutput: Record<"summary" | "coverLetter", {
        title: string;
        refinePlaceholder: string;
        refineBtn: string;
        refiningLabel: string;
    }>;
    bulletOutput: {
        title: string;
        copyAllLabel: string;
        footnote: string;
        refinePlaceholder: string;
        refineBtn: string;
        refiningLabel: string;
    };
    loadingSpinner: {
        steps: [string, string, string];
    };
}


export const translations: Record<Language, Translations> = {
  en: {
    Mainpage: { title: "Resume Tailor" },
    jobDescriptionInput: {
      label: "Job Description",
      meta: "paste full text",
      placeholder: "Paste the job description...",
    },
    resumeInput: {
      bullet: {
        label: "Resume Bullets",
        meta: "one per line",
        placeholder: "- Led a team of 5 engineers...",
      },
      summary: {
        label: "Professional Summary",
        meta: "1-3 sentences",
        placeholder: "Experienced software engineer with 3+ years building...",
      },
      coverLetter: {
        label: "Whole Resume",
        meta: "paste full Resume",
        placeholder: "Paste your full Resume here...",
      },
    },
    tabbar: {
      bullet: "Bullet Points",
      coverLetter: "Cover Letter",
      summary: "Summary",
    },
    submitButton: {
      label: "Submit",
    },
    bulletTailor: {
      title: "Bullet Points Tailor",
      description:
        "Paste your resume bullets and the job description. Get back sharper,quantified writing aligned to the role.",
      actionHint: "results appear below",
      idleLabel: "Tailor bullets",
      loadingLabel: "Tailoring...",
      doneLabel: "Re-tailor",
    },
    coverLetterTailor: {
      title: "Cover Letter Tailor",
      description:
        "Paste your cover letter and the job description. Get back a more targeted, compelling letter aligned to the role.",
      actionHint: "results appear below",
      idleLabel: "Generate Cover Letter",
      loadingLabel: "Generating...",
      doneLabel: "Regenerate",
    },
    summaryTailor: {
      title: "Tailor your summary to the job.",
      description:
        "Paste your resume summary. Get back sharper, quantified writing aligned to the role.",
      actionHint: "results appear below",
      idleLabel: "Tailor Summary",
      loadingLabel: "Tailoring...",
      doneLabel: "Re-tailor",
    },
    output: {
      colOriginal: "Original",
      colRewritten: "Rewritten",
      refineLabel: "Refine",
      copyLabel: "copy",
      copiedLabel: "copied",
    },
    paragraphOutput: {
      summary: {
        title: "Tailored Summary:",
        refinePlaceholder: "Make sure to mention Javascript",
        refineBtn: "Refine Summary",
        refiningLabel: "Refining...",
      },
      coverLetter: {
        title: "Tailored Cover Letter:",
        refinePlaceholder: "Highlight the GPA calculator",
        refineBtn: "Refine Cover Letter",
        refiningLabel: "Refining...",
      },
    },
    bulletOutput: {
      title: "Tailored bullets",
      copyAllLabel: "copy all",
      footnote: "{count} of {count} rewritten",
      refinePlaceholder: "Shorter, more precise on Python, emphasize leadership...",
      refineBtn: "Refine bullets",
      refiningLabel: "Refining...",
    },
    loadingSpinner: {
      steps: [
        "Reading the job description",
        "Matching keywords and skills",
        "Rewriting your bullets",
      ],
    },
  },
  zh: {
    Mainpage: { title: "履歷修改器" },
    jobDescriptionInput: {
      label: "工作描述",
      meta: "貼上完整文本",
      placeholder: "貼上工作描述...",
    },
    resumeInput: {
      bullet: {
        label: "履歷條列",
        meta: "一行一則",
        placeholder: "- 帶領 5 位工程師組成的團隊...",
      },
      summary: {
        label: "專業摘要",
        meta: "1 至 3 句話",
        placeholder: "擁有 3 年以上經驗，專注於打造...的軟體工程師",
      },
      coverLetter: {
        label: "完整履歷",
        meta: "貼上完整履歷",
        placeholder: "在此貼上您的完整履歷...",
      },
    },
    tabbar: {
      bullet: "重點整理",
      coverLetter: "求職信",
      summary: "自我介紹",
    },
    submitButton: {
      label: "送出",
    },
    bulletTailor: {
      title: "履歷條列客製",
      description: "貼上您的履歷條列與職缺描述，即可獲得更精準、量化且符合職缺需求的內容。",
      actionHint: "結果將顯示於下方",
      idleLabel: "條列客製",
      loadingLabel: "客製中...",
      doneLabel: "重新客製",
    },
    coverLetterTailor: {
      title: "求職信客製",
      description: "貼上您的履歷與職缺描述，即可獲得更貼近職缺需求、更具說服力的求職信。",
      actionHint: "結果將顯示於下方",
      idleLabel: "生成求職信",
      loadingLabel: "生成中...",
      doneLabel: "重新生成",
    },
    summaryTailor: {
      title: "將履歷摘要(Summary)客製化以符合職缺。",
      description: "貼上您的履歷摘要，獲得更精準、量化且符合職缺需求的內容。",
      actionHint: "結果將顯示於下方",
      idleLabel: "摘要客製",
      loadingLabel: "客製中...",
      doneLabel: "重新客製",
    },
    output: {
      colOriginal: "原始內容",
      colRewritten: "改寫後",
      refineLabel: "精修",
      copyLabel: "複製",
      copiedLabel: "已複製",
    },
    paragraphOutput: {
      summary: {
        title: "客製化摘要：",
        refinePlaceholder: "務必提及 Javascript",
        refineBtn: "精修摘要",
        refiningLabel: "精修中...",
      },
      coverLetter: {
        title: "客製化求職信：",
        refinePlaceholder: "強調 GPA 計算機專案",
        refineBtn: "精修求職信",
        refiningLabel: "精修中...",
      },
    },
    bulletOutput: {
      title: "客製化條列",
      copyAllLabel: "全部複製",
      footnote: "已完成 {count} / {count} 則",
      refinePlaceholder: "更簡短、更精確地描述 Python 經驗，並強調領導能力...",
      refineBtn: "精修條列",
      refiningLabel: "精修中...",
    },
    loadingSpinner: {
      steps: [
        "正在閱讀職缺描述",
        "比對關鍵字與技能",
        "改寫您的條列內容",
      ],
    },
  },
};
