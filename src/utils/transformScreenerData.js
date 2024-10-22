import { localized } from "./localization.js";
import { strings, TABS } from "./constants/localizedStrings.js";

export const transformDataForTable = (
  screenerData,
  fieldConfigurations,
  activeTabId,
  currentLanguage,
  selectedSectorId = null
) => {
  const columns = [
    { key: "fixed_code", label: `${strings.code}` },
    { key: "fixed_company", label: `${strings.companies}` },
    { key: "fixed_sector", label: `${strings.sector}` },
    { key: "CompanyID", label: "CompanyID", hidden: true },
    { key: "SectorID", label: "SectorID", hidden: true },
    ...fieldConfigurations
      .filter((item) => {
        // Check if the active tab is S_FINANCIAL_RATIO
        if (activeTabId === TABS.S_FINANCIAL_RATIO) {
          // Only check selectedSectorId when activeTabId is S_FINANCIAL_RATIO
          return (
            item.TabID === activeTabId && item.SectorID === selectedSectorId
          );
        }
        // If the tab is not S_FINANCIAL_RATIO, just check TabID
        return item.TabID === activeTabId;
      })
      .map((item) => {
        const unitName = localized(item, "UnitName", currentLanguage);
        const fieldName = localized(item, "FieldName", currentLanguage);
        return {
          key: item.Pkey,
          label: fieldName,
          unit: unitName,
          indicator: item.IndicatorID,
          showPercentage: item.ShowPercentage,
        };
      }),
  ];

  const pinnedRow = null;
  //   const pinnedRow = {
  //     fixed_code: "",
  //     fixed_img: "/assets/images/tasi.svg",
  //     fixed_company: currentLanguage === LANGUAGES.EN ? "Tasi" : "تاسي",
  //     fixed_sector: (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width="30"
  //         height="3"
  //         viewBox="0 0 30 3"
  //       >
  //         <path
  //           id="Path_95057"
  //           data-name="Path 95057"
  //           d="M27,0H0"
  //           transform="translate(1.5 1.5)"
  //           fill="none"
  //           stroke="#e27922"
  //           strokeLinecap="square"
  //           strokeWidth="3"
  //         />
  //       </svg>
  //     ),
  //     ...fieldConfigurations
  //       .filter((config) => config.TabID === activeTabId)
  //       .reduce((acc, config) => {
  //         const unitName = config.UnitNameEn ? ` ${config.UnitNameEn}` : "";
  //         const columnKey = config.FieldNameEn + unitName;
  //         acc[columnKey] = "78.50";
  //         return acc;
  //       }, {}),
  //   };

  const columnKeysSet = new Set();
  const formattedDataMap = new Map();

  screenerData
    .filter((item) => {
      if (activeTabId === TABS.S_FINANCIAL_RATIO) {
        // Only include items with the selectedSectorId when the activeTabId is S_FINANCIAL_RATIO
        return (
          item.identifier.startsWith(`${activeTabId}-`) &&
          item.identifier.endsWith(`-${currentLanguage}`) &&
          item.sectorId === selectedSectorId
        );
      }
      // If the tab is not S_FINANCIAL_RATIO, just check the identifier
      return (
        item.identifier.startsWith(`${activeTabId}-`) &&
        item.identifier.endsWith(`-${currentLanguage}`)
      );
    })
    .forEach((item) => {
      const fieldId = item.identifier.split("-")[1];
      columnKeysSet.add(fieldId);

      if (
        !item.data ||
        typeof item.data !== "object" ||
        Object.keys(item.data).length === 0
      )
        return;
      item.data.forEach((row) => {
        const fixedCode = row.Code.split(".")[0] || "";
        if (!formattedDataMap.has(fixedCode)) {
          formattedDataMap.set(fixedCode, {
            fixed_code: fixedCode,
            fixed_img: row.LogoUrl,
            fixed_company: localized(row, "ShortName", currentLanguage),
            fixed_sector: localized(row, "SectorName", currentLanguage),
            CompanyID: row.CompanyID,
            SectorID: row.ArgaamSectorID,
          });
        }

        const existingCompany = formattedDataMap.get(fixedCode);
        const keys = Object.keys(row);
        const secondToLastKey = keys[keys.length - 2];
        existingCompany[fieldId] = row[secondToLastKey] ?? "-";
      });
    });

  const columnKeys = Array.from(columnKeysSet);

  formattedDataMap.forEach((data) => {
    columnKeys.forEach((key) => {
      if (data[key] === undefined) {
        data[key] = "-";
      }
    });
  });

  const formattedData = Array.from(formattedDataMap.values());

  return {
    columns,
    data: formattedData,
    pinnedRow,
  };
};
