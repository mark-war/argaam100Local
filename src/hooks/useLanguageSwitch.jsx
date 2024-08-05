// src/hooks/useLanguageSwitch.js
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLanguage } from "../redux/features/languageSlice";
import { strings, LANGUAGES } from "../utils/constants/localizedStrings";

const useLanguageSwitch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const switchLanguage = (currentLang, newPath = window.location.pathname) => {
    const newLanguage =
      currentLang === LANGUAGES.AR ? LANGUAGES.EN : LANGUAGES.AR;
    strings.setLanguage(newLanguage);
    dispatch(setLanguage(newLanguage));
    const updatedPath = `/${newLanguage}${newPath.slice(3)}`;
    navigate(updatedPath, { replace: true });
  };

  return { switchLanguage };
};

export default useLanguageSwitch;
