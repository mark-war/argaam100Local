import LocalizedStrings from "react-localization";

export const strings = new LocalizedStrings({
  en: {
    topTen: "Top 10",
    screener: "Screener",
    navLinkArgaam: "Argaam",
    navLinkAbout: "About Us",
    sector: "Sector",
    date: "Last Update :",
    code: "Symbol",
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
    title: "Argaam Screener",
    errorPage: "Something went wrong...",
    reset: "Reset",
    exportCurrent: "Export Current Tab",
    exportAllTabs: "Export All Tabs",
    finRatioMsg: "Some Ratios are not applicable",
    banks: "Banks",
    insurance: "Insurance",
    reits: "Reits",
    financing: "Financing",
    and: "and",
  },
  ar: {
    topTen: "أعلى 10",
    screener: "تحليل الاسهم",
    navLinkArgaam: "أرقام",
    navLinkAbout: "معلومات عنا",
    code: "الرمز",
    companies: "الشركة",
    sector: "القطاع",
    pemtt: "مكرر الربح ( أخر 12 )",
    par: "(معدل سنوياً) مكرر الربح",
    priceBook: "(اخر فترة مالية) القيمة الدفترية",
    priceSales: "(اخر 12) مضاعف الإيرادات",
    date: "آخر تحديث :",
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
    rank: "الترتيب",
    charts: "الرسوم البيانية",
    neg: "سالب",
    moreThan100: "أكبر من 100",
    pe: "مكرر الربح",
    prev: "السابق",
    next: "التالي",
    notFound: "لا توجد نتائج للبحث",
    title: "تحليل الأسهم",
    errorPage: "حدث خطأ ما...",
    reset: "إعادة تعيين",
    exportCurrent: "تصدير علامة التبويب الحالية",
    exportAllTabs: "تصدير كافة علامات التبويب",
    finRatioMsg: "بعض المؤشرات لا تنطبق على",
    banks: "البنوك",
    insurance: "التأمين",
    reits: "الريت",
    financing: "التمويل",
    and: "و",
  },
});

export const SECTORS = {
  BANKING: 8,
  INSURANCE: 15,
  REITS: 238,
  FINANCING: 240,
};

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

  //arabic subtabs (TODO: need to find a different approach handling these subtabs)
  التطور_التاريخي: 1,
  آخر_إغلاق: 2,
  القيمة_الدفترية: 3,
  آخر_12_شهرا: 4,

  SP_1_يوم: 5,
  SP_شهر: 6,
  SP_3_أشهر: 7,
  SP_5_سنوات: 8,
  SP_منذ_بداية_العام: 9,

  GD_3_سنوات: 10,
  GD_5_سنوات: 11,
  GD_7_سنوات: 12,
  GD_10_سنوات: 13,
};

export const SUBSECTIONS = {
  MARKET_CAP: 18,
  SH_EQUITY: 19,
  REVENUES: 20,
  PROFIT: 21,

  THE_HIGHEST: 30,
  THE_LOWEST: 31,
  MOST_ACTIVE_QTY: 32,
  MOST_ACTIVE_VAL: 33,

  PE: 22,
  OP_PROFIT: 23,
  PRICE_BOOK: 24,
  PRICE_SALES: 25,

  RET_SH: 26,
  IND_OVER_SH: 27,
  NET_PROF_MARGIN: 28,
  TOT_PROF_MARGIN: 29,

  HIGHEST_GROWTH: 34,
  MOST_REC_LOSES: 35,
  MOST_PROF_DIV: 36,
  HIGHEST_RET: 37,
};

export const SUBSECTION_TO_SUBTABS_MAP = {
  [SUBSECTIONS.MARKET_CAP]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.LAST_CLOSE],
  [SUBSECTIONS.SH_EQUITY]: [
    SUBTABS.HISTORICAL_EVOLUTION,
    SUBTABS.LAST_FISCAL_PERIOD,
  ],
  [SUBSECTIONS.REVENUES]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],
  [SUBSECTIONS.PROFIT]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],

  [SUBSECTIONS.THE_HIGHEST]: [
    SUBTABS.SP_DAY,
    SUBTABS.SP_MONTH,
    SUBTABS.SP_3_MONTHS,
    SUBTABS.SP_5_YEARS,
    SUBTABS.SP_FROM_BEGINNING_OF_THE_YEAR,
  ],
  [SUBSECTIONS.THE_LOWEST]: [
    SUBTABS.SP_DAY,
    SUBTABS.SP_MONTH,
    SUBTABS.SP_3_MONTHS,
    SUBTABS.SP_5_YEARS,
    SUBTABS.SP_FROM_BEGINNING_OF_THE_YEAR,
  ],
  [SUBSECTIONS.MOST_ACTIVE_QTY]: [
    SUBTABS.SP_DAY,
    SUBTABS.SP_MONTH,
    SUBTABS.SP_3_MONTHS,
    SUBTABS.SP_5_YEARS,
    SUBTABS.SP_FROM_BEGINNING_OF_THE_YEAR,
  ],
  [SUBSECTIONS.MOST_ACTIVE_VAL]: [
    SUBTABS.SP_DAY,
    SUBTABS.SP_MONTH,
    SUBTABS.SP_3_MONTHS,
    SUBTABS.SP_5_YEARS,
    SUBTABS.SP_FROM_BEGINNING_OF_THE_YEAR,
  ],

  [SUBSECTIONS.PE]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],
  [SUBSECTIONS.OP_PROFIT]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],
  [SUBSECTIONS.PRICE_BOOK]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],
  [SUBSECTIONS.PRICE_SALES]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],

  [SUBSECTIONS.RET_SH]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],
  [SUBSECTIONS.IND_OVER_SH]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],
  [SUBSECTIONS.NET_PROF_MARGIN]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],
  [SUBSECTIONS.TOT_PROF_MARGIN]: [SUBTABS.HISTORICAL_EVOLUTION, SUBTABS.TTM],

  [SUBSECTIONS.HIGHEST_GROWTH]: [
    SUBTABS.GD_3_YEARS,
    SUBTABS.GD_5_YEARS,
    SUBTABS.GD_7_YEARS,
    SUBTABS.GD_10_YEARS,
  ],
  [SUBSECTIONS.MOST_REC_LOSES]: [
    SUBTABS.GD_3_YEARS,
    SUBTABS.GD_5_YEARS,
    SUBTABS.GD_7_YEARS,
    SUBTABS.GD_10_YEARS,
  ],
  [SUBSECTIONS.MOST_PROF_DIV]: [
    SUBTABS.GD_3_YEARS,
    SUBTABS.GD_5_YEARS,
    SUBTABS.GD_7_YEARS,
    SUBTABS.GD_10_YEARS,
  ],
  [SUBSECTIONS.HIGHEST_RET]: [
    SUBTABS.GD_3_YEARS,
    SUBTABS.GD_5_YEARS,
    SUBTABS.GD_7_YEARS,
    SUBTABS.GD_10_YEARS,
  ],
};
