const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  chartsUrl: import.meta.env.VITE_CHARTS_URL,
  defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE,
  supportedLanguages: import.meta.env.VITE_SUPPORTED_LANGUAGES.split(","),
  screenerTableItemPerPage: Number(
    import.meta.env.VITE_SCREEENER_TABLE_ITEMS_PER_PAGE
  ),
  decimals: Number(import.meta.env.VITE_DECIMALS),
  peFieldIds: new Set(import.meta.env.VITE_PE_FIELDIDS.split(",").map(Number)),
  // Add other global configurations here
};

export default config;
