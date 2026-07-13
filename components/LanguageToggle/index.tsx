import { Language } from "@/types";
import "./languageToggle.css";

type LanguageToggleProps = {
    language: Language;
    setLanguage: (language: Language) => void;
}


export default function LanguageToggle({language,setLanguage}:LanguageToggleProps){
    return(
        <div className="LanguageBtnContainer" data-active={language}>
            <button
                className={language === "en" ? "LanguageBtn active" : "LanguageBtn"}
                aria-pressed={language === "en"}
                onClick={() => setLanguage("en")}
            >
                EN
            </button>
            <button
                className={language === "zh" ? "LanguageBtn active" : "LanguageBtn"}
                aria-pressed={language === "zh"}
                onClick={() => setLanguage("zh")}
            >
                中文
            </button>
        </div>
    )
}
