import { Navigate, useParams } from "react-router-dom";
import config from "../../utils/config.js";
import useLanguage from "../../hooks/useLanguage.jsx";

const DefaultRedirect = () => {
  const { lang, tabName = "multiples" } = useParams();

  // Use the custom useLanguage hook to set the language
  useLanguage(lang);

  const redirectPath = `/${
    config.supportedLanguages.includes(lang) ? lang : config.defaultLanguage
  }/argaam-100/${tabName}`;

  return <Navigate to={redirectPath} replace />;
};

export default DefaultRedirect;
