import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLanguage } from "../redux/features/languageSlice.js";
import { strings, LANGUAGES } from "../utils/constants/localizedStrings.js";

const LanguageSwitcher = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lang } = useParams();

  const switchLanguage = () => {
    const newLanguage = lang === LANGUAGES.AR ? LANGUAGES.EN : LANGUAGES.AR;
    strings.setLanguage(newLanguage);
    dispatch(setLanguage(newLanguage));
    navigate(`/${newLanguage}${window.location.pathname.slice(3)}`, {
      replace: true,
    }); // Update URL without full reload
  };

  return (
    <li className="nav-item">
      <a className="nav-link" onClick={switchLanguage}>
        {lang === LANGUAGES.AR
          ? LANGUAGES.EN.toUpperCase()
          : LANGUAGES.AR.toUpperCase()}
      </a>
    </li>
  );
};

export default LanguageSwitcher;
