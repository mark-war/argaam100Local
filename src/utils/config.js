const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  baseUrl: import.meta.env.VITE_BASE_URL,
  chartsUrl: import.meta.env.VITE_CHARTS_URL,
  defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE,
  supportedLanguages: import.meta.env.VITE_SUPPORTED_LANGUAGES.split(","),
  screenerTableItemPerPage: Number(
    import.meta.env.VITE_SCREEENER_TABLE_ITEMS_PER_PAGE
  ),
  decimals: Number(import.meta.env.VITE_DECIMALS),
  peFieldIds: new Set(import.meta.env.VITE_PE_FIELDIDS.split(",").map(Number)),
  refreshOnReload: Number(import.meta.env.VITE_REFRESH_ONRELOAD),
  expirationInMinutes: Number(import.meta.env.VITE_EXPIRATION_IN_MINUTES),
  chartsApiUrl: import.meta.env.VITE_CHARTS_API_URL,
  defaultMarket: import.meta.env.VITE_DEFAULT_MARKETID,
  companyApiUrl: import.meta.env.VITE_SCREENER_API_URL,
};

export default config;
