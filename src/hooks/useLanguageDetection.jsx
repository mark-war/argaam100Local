import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useLanguageSwitch from "./useLanguageSwitch";
import { LANGUAGES } from "../utils/constants/localizedStrings";

const useLanguageDetection = () => {
  const { lang } = useParams();
  const { setLanguageFromUrl } = useLanguageSwitch();

  useEffect(() => {
    console.log("LANGUAGE: ", lang);
    if (lang === LANGUAGES.AR || lang === LANGUAGES.EN) {
      setLanguageFromUrl(lang);
    }
  }, [lang, setLanguageFromUrl]);
};

export default useLanguageDetection;
