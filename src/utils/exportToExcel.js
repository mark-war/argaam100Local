import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { LANGUAGES } from "./constants/localizedStrings";
import { strings } from "./constants/localizedStrings";
import { localized } from "../utils/localization";
import config from "./config";

// Extract the formatting logic
const formatNumber = (number, decimals) => {
  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(number));

  return number < 0 ? `(${formattedValue})` : formattedValue;
};

const formatValue = (value, decimals = 2, isPEColumn = false) => {
  if (isPEColumn) {
    if (value < 0) return strings.neg;
    if (value > 100) return strings.moreThan100;
  }

  return typeof value === "number" ? formatNumber(value, decimals) : value;
};

// Function to sanitize sheet names
const sanitizeSheetName = (name) => {
  // Replace forbidden characters with an underscore or any other preferred character
  return name.replace(/[*?:\/\\[\]]/g, "_");
};

const argaamUrl = (companyID = "", lang) => {
  const baseUrl =
    lang === LANGUAGES.AR
      ? `https://www.argaam.com/ar/company/companyoverview/marketid/3/companyid/${companyID}/`
      : `https://www.argaam.com/en/tadawul/tasi/`;

  return baseUrl;
};

export const exportToExcel = async (
  screenerData,
  fieldConfig,
  activeTabId,
  currentLanguage,
  fileName,
  sheetName
) => {
  const sanitizedSheetName = sanitizeSheetName(sheetName);

  const columns = [
    { key: "fixed_code", label: `${strings.code}` },
    { key: "fixed_company", label: `${strings.companies}` },
    { key: "fixed_sector", label: `${strings.sector}` },
    { key: "CompanyID", label: "CompanyID", hidden: true },
    { key: "SectorID", label: "SectorID", hidden: true },
    ...fieldConfig
      .filter((item) => item.TabID === activeTabId)
      .map((item) => {
        const unitName = localized(item, "UnitName", currentLanguage);
        const fieldName = localized(item, "FieldName", currentLanguage);
        const optionalUnitName = unitName ? ` ${unitName}` : "";
        return {
          key: item.Pkey,
          label: `${fieldName}${optionalUnitName}`,
        };
      }),
  ];

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sanitizedSheetName);

  // Define headers based on your column definitions
  const headers = columns
    .filter((column) => !column.hidden)
    .map((column) => ({
      header: column.label || column.key,
      key: column.key,
      width: 30,
    }));

  worksheet.columns = headers;

  // Prepare a map to store rows by the company code
  const rowMap = new Map();

  screenerData
    .filter(
      (item) =>
        item.identifier.startsWith(`${activeTabId}-`) &&
        item.identifier.endsWith(`-${currentLanguage}`)
    )
    .forEach((item) => {
      const fieldId = item.identifier.split("-")[1];

      item.data.forEach((rowData) => {
        const fixedCode = rowData.Code.split(".")[0];
        if (!rowMap.has(fixedCode)) {
          rowMap.set(fixedCode, {
            fixed_code: fixedCode,
            fixed_img: rowData.LogoUrl,
            fixed_company: localized(rowData, "ShortName", currentLanguage),
            fixed_sector: localized(rowData, "SectorName", currentLanguage),
            CompanyID: rowData.CompanyID,
            SectorID: rowData.ArgaamSectorID,
          });
        }
        const existingCompany = rowMap.get(fixedCode);
        const keys = Object.keys(rowData);
        const secondToLastKey = keys[keys.length - 2];

        // Use the value from the second-to-last key or fallback to "-"
        const value = config.peFieldIds.has(Number(fieldId))
          ? formatValue(rowData[secondToLastKey], 2, true)
          : formatValue(rowData[secondToLastKey]);

        existingCompany[fieldId] = value ?? "-";
      });
    });

  // Add rows to the worksheet
  rowMap.forEach((rowData) => {
    const newRow = worksheet.addRow(rowData);

    // Apply hyperlink to the 'fixed_company' cell
    if (rowData.fixed_company) {
      const cell = newRow.getCell("fixed_company");
      cell.value = {
        text: rowData.fixed_company,
        hyperlink: argaamUrl(rowData.CompanyID, currentLanguage),
      };
      cell.font = { color: { argb: "FF0000FF" }, underline: true };
    }
  });

  // Apply bold styling to header row
  worksheet.getRow(1).font = { bold: true };

  // Generate Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Download the Excel file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};
