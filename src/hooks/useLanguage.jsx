import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setLanguage } from "../redux/features/languageSlice.js";
import { strings } from "../utils/constants/localizedStrings.js";
import config from "../utils/config.js";

const useLanguage = (lang) => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  useEffect(() => {
    const validLang = config.supportedLanguages.includes(lang)
      ? lang
      : config.defaultLanguage;

    if (currentLanguage !== validLang) {
      strings.setLanguage(validLang);
      dispatch(setLanguage(validLang));
      document.documentElement.lang = validLang;
    }

    document.title = strings.title;
  }, [lang, dispatch]);
};

export default useLanguage;
