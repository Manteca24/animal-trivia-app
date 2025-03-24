import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageToggler = () => {
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    changeLanguage(language === "en" ? "es" : "en");
  };

  return (
    <div className="language-switcher" onClick={toggleLanguage}>
      <div
        className={`toggle-container ${
          language === "en" ? "english" : "spanish"
        }`}
      >
        <div className="toggle-circle" />
      </div>
      <img
        className={`flag ${language === "en" ? "en-flag" : "es-flag"}`}
        src={language === "en" ? "/uk-flag.png" : "/spain-flag.png"}
        alt={language === "en" ? "English flag" : "Spanish flag"}
      />
    </div>
  );
};

export default LanguageToggler;
