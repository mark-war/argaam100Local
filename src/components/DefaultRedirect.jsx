import React, { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import config from "../utils/config.js";
import { setLanguage } from "../redux/features/languageSlice.js";

const DefaultRedirect = () => {
  const { pathname } = useLocation();
  const lang = pathname.split("/")[1]; // Extract the language from the URL path
  const dispatch = useDispatch();

  useEffect(() => {
    const validLang = config.supportedLanguages.includes(lang)
      ? lang
      : config.defaultLanguage;
    dispatch(setLanguage(validLang)); // Update the application language
  }, [lang, dispatch]);

  const redirectPath = `/${
    config.supportedLanguages.includes(lang) ? lang : config.defaultLanguage
  }/screener`;

  return <Navigate to={redirectPath} replace />;
};

export default DefaultRedirect;
