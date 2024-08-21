import LocalizedStrings from "react-localization";

export const strings = new LocalizedStrings({
  en: {
    topTen: "Top 10",
    screener: "Screener",
    navLinkArgaam: "Argaam",
    navLinkAbout: "About Us",
    sector: "Sector",
    date: "Last Update :",
    code: "Code",
    companies: "Companies",
    sector: "Sector",
    pemtt: "P/E (MTT)",
    par: "PE/(AR)",
    bookValue: "Book Value (Last Fiscal Period)",
    priceBook: "Price/Book",
    priceSales: "Price/Sales",
    stockScreener: "Stock Screener",
    topTenCompanies: "Top Ten Companies",
    grossProfitMargins: "Gross Profit Margins",
    netMargin: "Net Margin",
    returnOnAssets: "Return On assets",
    returnOnEquity: "Return On equity",
    netIndebt: "Net indebtedness/quity",
    evRevenues: "EV / Revenues",
    ttm: "TTM",
    marketCap: "Market Cap (LFY)",
    capital: "Capital ( LFY )",
    assets: "Assets ( LFY )",
    shareholder: "Shareholder's Equity (LFY)",
    revenue: "Revenue (TTM)",
    profit: "Profit (TTM)",
    rank: "Rank",
    charts: "Charts",
    neg: "NEG",
    moreThan100: "More than 100",
    pe: "P/E",
    prev: "Previous",
    next: "Next",
    notFound: "No results found",
  },
  ar: {
    topTen: "أعلى 10",
    screener: "تحليل الاسهم",
    navLinkArgaam: "أرقام",
    navLinkAbout: "معلومات عنا",
    code: "الكود  ",
    companies: "الشركة",
    sector: "القطاع",
    pemtt: "مكرر الربح ( أخر 12 )",
    par: "(معدل سنوياً) مكرر الربح",
    priceBook: "(اخر فترة مالية) القيمة الدفترية",
    priceSales: "(اخر 12) مضاعف الإيرادات",
    date: "التحديث الأخير :",
    bookValue: "(معدل سنوياً) مكرر الربح",
    stockScreener: "نتيجة الفلتر",
    topTenCompanies: "أعلى 10 شركات",
    grossProfitMargins: "هامش الربح الإجمالي",
    netMargin: "هامش الربح الصافي",
    returnOnAssets: "% العائد على الأصول",
    returnOnEquity: "% العائد على حقوق المساهمين",
    netIndebt: "صافي المديونية/ حقوق المساهمين",
    evRevenues: "المنشآة/ الايرادات",
    ttm: "( اخر 12 )",
    marketCap: "( اخر اغلاق ) القيمة السوقية",
    capital: "( اخر فترة مالية ) رآس المال",
    assets: "(اخر فترة مالية) الأصول",
    shareholder: "(اخر فترة مالية) حقوق المساهمين",
    revenue: "(اخر 12) الايردات",
    profit: "(اخر 12) الأرباح",
    rank: "رتبة",
    charts: "الرسوم البيانية",
    neg: "سالب",
    moreThan100: "أكبر من 100",
    pe: "مكرر الربح",
    prev: "السابق",
    next: "التالي",
    notFound: "لا توجد نتائج للبحث",
  },
});

export const LANGUAGES = {
  EN: "en",
  AR: "ar",
};

export const LANGUAGEID = {
  AR: 1,
  EN: 2,
};

export const PAGES = {
  SCREENER: 1,
  TOPTEN: 2,
};

export const SECTIONS = {
  STOCK_SCREENER: 3,
  TOPTEN_COMPANIES: 4,
};

export const TABS = {
  S_PE: 5,
  S_FINANCIAL_RATIO: 6,
  S_PERFORMANCE_AND_SIZE: 7,

  T_RANKING: 8,
  T_STOCK_PERFORMANCE: 9,
  T_ARR_MULTIPLE: 10,
  T_FINANCIAL_RATIO: 11,
  T_GROWTH_AND_DIVIDENDS: 12,
};

export const SUBTABS = {
  HISTORICAL_EVOLUTION: 1,
  LAST_CLOSE: 2,
  LAST_FISCAL_PERIOD: 3,
  TTM: 4,

  SP_DAY: 5,
  SP_MONTH: 6,
  SP_3_MONTHS: 7,
  SP_5_YEARS: 8,
  SP_FROM_BEGINNING_OF_THE_YEAR: 9,

  GD_3_YEARS: 10,
  GD_5_YEARS: 11,
  GD_7_YEARS: 12,
  GD_10_YEARS: 13,
};
