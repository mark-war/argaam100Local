import { useParams } from "react-router-dom";
import { LANGUAGES } from "../utils/constants/localizedStrings";

const useArgaamUrl = () => {
  const { lang } = useParams();

  const getBaseUrl = () => {
    return lang === LANGUAGES.AR
      ? "https://www.argaamcharts.com/ar/"
      : "https://www.argaamcharts.com/en/";
  };

  const argaamUrl = (symbol) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}${encodeURIComponent(symbol)}`; // Ensure the symbol is URL-safe
  };

  return argaamUrl;
};

export default useArgaamUrl;
