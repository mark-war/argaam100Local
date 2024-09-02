import { localized } from "./localization.js";
import { strings } from "./constants/localizedStrings.js";

export const transformDataForTable = (
  screenerData,
  fieldConfigurations,
  activeTabId,
  currentLanguage
) => {
  const columns = [
    { key: "fixed_code", label: `${strings.code}` },
    { key: "fixed_company", label: `${strings.companies}` },
    { key: "fixed_sector", label: `${strings.sector}` },
    { key: "CompanyID", label: "CompanyID", hidden: true },
    { key: "SectorID", label: "SectorID", hidden: true },
    ...fieldConfigurations
      .filter((item) => item.TabID === activeTabId)
      .map((item) => {
        const unitName = localized(item, "UnitName", currentLanguage);
        const fieldName = localized(item, "FieldName", currentLanguage);
        const optionalUnitName = unitName ? ` ${unitName}` : "";
        return {
          key: item.Pkey,
          label: `${fieldName}${optionalUnitName}`, // Combine fieldName and optionalUnitName into a single string
        };
      }),
  ];

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
    .filter(
      (item) =>
        item.identifier.startsWith(`${activeTabId}-`) &&
        item.identifier.endsWith(`-${currentLanguage}`)
    )
    .forEach((item) => {
      const fieldId = item.identifier.split("-")[1];
      columnKeysSet.add(fieldId);

      if (!item.data) return;
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
    //pinnedRow,
  };
};
