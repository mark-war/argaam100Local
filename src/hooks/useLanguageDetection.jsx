import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useLanguageSwitch from "./useLanguageSwitch";
import { LANGUAGES } from "../utils/constants/localizedStrings";

const useLanguageDetection = () => {
  const { lang } = useParams();
  const { setLanguageFromUrl } = useLanguageSwitch();

  useEffect(() => {
    if (lang === LANGUAGES.AR || lang === LANGUAGES.EN) {
      setLanguageFromUrl(lang);
    }
  }, [lang, setLanguageFromUrl]);
};

export default useLanguageDetection;
