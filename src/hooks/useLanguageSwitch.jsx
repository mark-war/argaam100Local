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
    // const updatedPath = `/${newLanguage}${newPath.slice(3)}`;
    // navigate(updatedPath, { replace: true });

    // Ensure the new path starts with "/"
    const normalizedPath = newPath.startsWith("/") ? newPath : `/${newPath}`;

    // Remove the old language prefix if present
    const pathWithoutOldLang = normalizedPath.replace(`/${currentLang}`, "");

    // Add the new language prefix
    const updatedPath = `/${newLanguage}${pathWithoutOldLang}`;

    navigate(updatedPath, { replace: true });
  };

  const setLanguageFromUrl = (langFromUrl) => {
    strings.setLanguage(langFromUrl);
    dispatch(setLanguage(langFromUrl));
  };

  return { switchLanguage, setLanguageFromUrl };
};

export default useLanguageSwitch;
