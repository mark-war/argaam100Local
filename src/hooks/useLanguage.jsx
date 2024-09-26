import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setLanguage } from "../redux/features/languageSlice.js";
import { strings } from "../utils/constants/localizedStrings.js";
import config from "../utils/config.js";

const useLanguage = (lang) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (config.supportedLanguages.includes(lang)) {
      strings.setLanguage(lang);
    } else {
      const defaultLanguage = config.defaultLanguage;
      strings.setLanguage(defaultLanguage);
      dispatch(setLanguage(defaultLanguage));
    }
    document.documentElement.lang = lang;
  }, [lang, dispatch]);
};

export default useLanguage;
