// src/components/LanguageSwitcher.js
import React from "react";
import { useParams } from "react-router-dom";
import useLanguageSwitch from "../../hooks/useLanguageSwitch";
import { LANGUAGES } from "../../utils/constants/localizedStrings";

const LanguageSwitcher = () => {
  const { switchLanguage } = useLanguageSwitch();
  const { lang } = useParams();

  const handleLanguageSwitch = () => {
    switchLanguage(lang, window.location.pathname);
  };

  return (
    <li className="nav-item">
      <a className="nav-link" onClick={handleLanguageSwitch} href="#">
        {lang === LANGUAGES.AR
          ? LANGUAGES.EN.toUpperCase()
          : LANGUAGES.AR.toUpperCase()}
      </a>
    </li>
  );
};

export default LanguageSwitcher;
