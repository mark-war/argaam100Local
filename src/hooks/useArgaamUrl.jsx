import { useParams } from "react-router-dom";
import { LANGUAGES } from "../utils/constants/localizedStrings";

const useArgaamUrl = () => {
  const { lang } = useParams();

  //LIVE URL
  // const argaamBaseUrl = "https://www.argaam.com/"
  // const chartsBaseUrl = "https://www.argaamcharts.com/"

  //QA URL
  const argaamBaseUrl = "https://ppliveargaamplus.edanat.com/";
  const chartsBaseUrl = "https://charts2.edanat.com/";

  const getBaseUrl = () => {
    return lang === LANGUAGES.AR
      ? chartsBaseUrl + "ar/"
      : chartsBaseUrl + "en/";
  };

  const getArgaamUrl = () => {
    return lang === LANGUAGES.AR
      ? argaamBaseUrl + `ar/company/companyoverview/marketid/3/companyid/`
      : argaamBaseUrl + `en/tadawul/tasi/`;
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
