import { useParams } from "react-router-dom";
import { LANGUAGES } from "../utils/constants/localizedStrings";

const useArgaamUrl = () => {
  const { lang } = useParams();

  const getBaseUrl = () => {
    return lang === LANGUAGES.AR
      ? "https://www.argaamcharts.com/ar/"
      : "https://www.argaamcharts.com/en/";
  };

  const getArgaamUrl = () => {
    return lang === LANGUAGES.AR
      ? `https://www.argaam.com/ar/company/companyoverview/marketid/3/companyid/`
      : `https://www.argaam.com/en/tadawul/tasi/`;
  };

  const argaamUrl = (symbol = null, companyId = null, companyName = null) => {
    if (symbol) {
      const baseUrl = getBaseUrl();
      return `${baseUrl}${encodeURIComponent(symbol)}`; // Ensure the symbol is URL-safe
    }

    const baseUrl = getArgaamUrl();
    if (lang === LANGUAGES.AR && companyId) {
      return `${baseUrl}${companyId}`;
    } else if (lang === LANGUAGES.EN && companyName) {
      return `${baseUrl}${encodeURIComponent(companyName)}`; // Ensure companyName is URL-safe
    }

    // Fallback if no matching condition
    return baseUrl;
  };

  return argaamUrl;
};

export default useArgaamUrl;
