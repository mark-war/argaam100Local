import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { LANGUAGES, strings } from "./constants/localizedStrings";
import { localized } from "../utils/localization";
import config from "./config";

// COMMON FUNTIONS START

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
const sanitizeSheetName = (name) => name.replace(/[*?:\/\\[\]]/g, "_");

const argaamUrl = (companyID = "", lang) => {
  return lang === LANGUAGES.AR
    ? `https://www.argaam.com/ar/company/companyoverview/marketid/3/companyid/${companyID}/`
    : `https://www.argaam.com/en/tadawul/tasi/`;
};

// Function to apply right-to-left properties for Arabic
const applyArabicFormatting = (worksheet) => {
  // Set the worksheet properties to indicate RTL
  //worksheet.properties.outline = { summaryBelow: false }; // Optional, adjust as needed
  //worksheet.properties.tabColor = { argb: "FF0000" }; // Optional, adjust color if needed

  // Set alignment to right for all columns in the worksheet
  // worksheet.columns.forEach((column) => {
  //   column.alignment = { horizontal: "right" }; // Align content to the right
  // });

  // Set the active cell to the last column in the first row
  const lastColumnIndex = worksheet.columns.length; // Get the last column index
  const lastCellAddress = `${String.fromCharCode(64 + lastColumnIndex)}1`; // Get the address of the last cell in the first row

  const firstColumnIndex = 1; // The index of the first column
  const firstCellAddress = `A1`; // The address of the first cell in the first row
  worksheet.views = [
    {
      state: "normal",
      activeCell: firstCellAddress, // Set the active cell to the last column in the first row
      rightToLeft: true,
    },
  ];
};

// Dynamic column creation
const createColumns = (fieldConfig, activeTabId, currentLanguage) => [
  { key: "fixed_code", label: strings.code },
  { key: "fixed_company", label: strings.companies },
  { key: "fixed_sector", label: strings.sector },
  { key: "CompanyID", label: "CompanyID", hidden: true },
  { key: "SectorID", label: "SectorID", hidden: true },
  ...fieldConfig
    .filter((item) => item.TabID === activeTabId)
    .map((item) => {
      const unitName = localized(item, "UnitName", currentLanguage);
      const fieldName = localized(item, "FieldName", currentLanguage);
      const optionalUnitName = unitName ? ` ${unitName}` : "";
      return { key: item.Pkey, label: `${fieldName}${optionalUnitName}` };
    }),
];

const customSort = (data, key, direction) => {
  // Define the group for each value
  const getGroup = (value) => {
    if (value === "-" || value === undefined || value === null) return 3; // Dash values (last group)
    if (value === strings.neg) return 2; // Negatives (last group)
    if (value === strings.moreThan100) return 1; // Positives >= 100 (second group)
    return 0; // Positives < 100 (first group)
  };

  // Define the fixed group order
  const groupOrder = [0, 1, 2, 3]; // Fixed order: positives < 100, positives >= 100, negatives

  // Separate data into groups
  const groups = groupOrder.reduce((acc, group) => {
    acc[group] = [];
    return acc;
  }, {});

  data.forEach((item) => {
    const group = getGroup(item[key]);
    groups[group].push(item);
  });

  // Sort each group based on the direction
  Object.keys(groups).forEach((group) => {
    groups[group].sort((a, b) => {
      // Treat dash values as equal within their group
      if (a[key] === "-" || b[key] === "-") return 0;
      return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
    });
  });

  // Combine the groups into a single array
  return groupOrder.flatMap((group) => groups[group]);
};

const sortData = (unSortedData, sortConfig) => {
  if (sortConfig.key) {
    if (config.peFieldIds.has(sortConfig.key)) {
      return customSort(unSortedData, sortConfig.key, sortConfig.direction);
    }

    const dataArray = Array.from(unSortedData.values());

    // Sort the array based on the sortConfig key
    const sortedArray = dataArray.sort((a, b) => {
      const aValue =
        a[sortConfig.key] === "-" ||
        a[sortConfig.key] === null ||
        a[sortConfig.key] === undefined
          ? null
          : parseFloat(a[sortConfig.key].replace(/,/g, ""));

      const bValue =
        b[sortConfig.key] === "-" ||
        b[sortConfig.key] === null ||
        b[sortConfig.key] === undefined
          ? null
          : parseFloat(b[sortConfig.key].replace(/,/g, ""));

      if (aValue === null) return 1; // Place null, undefined, or "-" at the bottom
      if (bValue === null) return -1; // Place null, undefined, or "-" at the bottom

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

      return 0;
    });

    // Return the sorted array in the same format as `customSort`
    return sortedArray;
  }
};

//COMMON FUNCTIONS END

// SCREENER PAGE EXPORT START

export const exportToExcel = async (
  screenerData,
  fieldConfig,
  activeTabId,
  currentLanguage,
  fileName,
  sheetName
) => {
  const sanitizedSheetName = sanitizeSheetName(sheetName);

  const columns = createColumns(fieldConfig, activeTabId, currentLanguage);

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

  // Apply Arabic formatting if the current language is Arabic
  if (currentLanguage === LANGUAGES.AR) {
    applyArabicFormatting(worksheet);
  }

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

  const getFirstDynamicColumn = () =>
    columns.find((col) => typeof col.key === "number" && !col.hidden);

  const firstDynamicColumn = getFirstDynamicColumn();

  const sortDirection = config.peFieldIds.has(firstDynamicColumn.key)
    ? `asc`
    : `desc`;

  const sortConfig = {
    key: firstDynamicColumn.key,
    direction: sortDirection,
  };
  const sortedRowMap = sortData(rowMap, sortConfig);

  // Add rows to the worksheet
  sortedRowMap.forEach((rowData) => {
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

export const exportMultipleTabsToExcel = async (
  screenerData,
  fieldConfig,
  tabIdsAndNames,
  currentLanguage,
  fileName
) => {
  const workbook = new ExcelJS.Workbook();

  // Loop through each tab and create a sheet
  for (const { tabId, tabName } of tabIdsAndNames) {
    const sanitizedSheetName = sanitizeSheetName(tabName);

    const columns = createColumns(fieldConfig, tabId, currentLanguage);

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

    // Apply Arabic formatting if the current language is Arabic
    if (currentLanguage === LANGUAGES.AR) {
      applyArabicFormatting(worksheet);
    }

    // Prepare a map to store rows by the company code
    const rowMap = new Map();

    screenerData
      .filter(
        (item) =>
          item.identifier.startsWith(`${tabId}-`) &&
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

    const getFirstDynamicColumn = () =>
      columns.find((col) => typeof col.key === "number" && !col.hidden);

    const firstDynamicColumn = getFirstDynamicColumn();

    const sortDirection = config.peFieldIds.has(firstDynamicColumn.key)
      ? `asc`
      : `desc`;

    const sortConfig = {
      key: firstDynamicColumn.key,
      direction: sortDirection,
    };
    const sortedRowMap = sortData(rowMap, sortConfig);

    // Add rows to the worksheet
    sortedRowMap.forEach((rowData) => {
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
  }

  // Generate Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Download the Excel file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};

// SCREENER PAGE EXPORT END

// TOP TEN PAGE EXPORT START

export const exportToExcelTopTen = async (
  topTenTabData,
  currentLanguage,
  fileName,
  sheetName,
  isMultiple,
  subTabIds
) => {
  exportDataToExcel(
    fileName,
    sheetName,
    topTenTabData,
    currentLanguage,
    isMultiple,
    subTabIds
  );
};

const createMappedTable = (dataObject, currentLanguage) => {
  if (dataObject.data === undefined) {
    return dataObject.map((company) => {
      const keys = Object.keys(company);

      const thirdToLastKey = keys[keys.length - 3]; // Get the third-to-last key dynamically
      const secondToLastKey = keys[keys.length - 2]; // Get the second-to-last key dynamically

      const valueString =
        company[thirdToLastKey] !== null &&
        company[secondToLastKey] !== null &&
        typeof company[thirdToLastKey] === "number" &&
        typeof company[secondToLastKey] === "number"
          ? `${company[thirdToLastKey]}/${company[secondToLastKey]}`
          : null;

      // Create a mapped object for each company with the desired properties
      return {
        Rank: company.Rank,
        Company: localized(company, "ShortName", currentLanguage),
        Value:
          valueString !== null
            ? valueString
            : formatValue(company[secondToLastKey], 2, false), // Dynamically get the value of the second-to-last property
      };
    });
  }
  return dataObject.data.map((company) => {
    const keys = Object.keys(company);

    const secondToLastKey = keys[keys.length - 2]; // Get the second-to-last key dynamically

    // Create a mapped object for each company with the desired properties
    return {
      Rank: company.Rank,
      Company: localized(company, "ShortName", currentLanguage),
      Value: formatValue(company[secondToLastKey], 2, false), // Dynamically get the value of the second-to-last property
    };
  });
};

const exportDataToExcel = async (
  fileName,
  sheetName,
  dataObjects,
  currentLanguage,
  isMultiple,
  subTabIds
) => {
  const workbook = new ExcelJS.Workbook();
  if (!isMultiple) {
    dataObjects.forEach((dataObject) => {
      // Get the mapped table
      const mappedTable = createMappedTable(dataObject, currentLanguage);

      const sanitizedSheetName = sanitizeSheetName(sheetName);
      const sanitizedTabName = sanitizeSheetName(
        localized(dataObject, "fieldName", currentLanguage)
      );

      // Create a new worksheet named after the fieldNameEn (which is the sheet name)
      const worksheet = workbook.addWorksheet(
        sanitizedSheetName + "_" + sanitizedTabName
      );

      // Add the headers
      worksheet.columns = [
        { header: strings.rank, key: "Rank", width: 10 },
        { header: strings.companies, key: "Company", width: 30 },
        { header: strings.charts, key: "Value", width: 15 },
      ];

      // Add rows from mappedTable
      worksheet.addRows(mappedTable);
      // Apply bold styling to header row
      worksheet.getRow(1).font = { bold: true };

      // Apply Arabic formatting if the current language is Arabic
      if (currentLanguage === LANGUAGES.AR) applyArabicFormatting(worksheet);
    });
  } else {
    dataObjects.map((dataObject, index) => {
      const activeSubTabId = subTabIds[index];
      // Get the mapped table
      const mappedTable = createMappedTable(
        dataObject.data[activeSubTabId],
        currentLanguage
      );

      const sanitizedSheetName = sanitizeSheetName(sheetName);
      const sanitizedTabName = sanitizeSheetName(
        localized(dataObject, "fieldName", currentLanguage)
      );

      // Create a new worksheet named after the fieldNameEn (which is the sheet name)
      const worksheet = workbook.addWorksheet(
        sanitizedSheetName + "_" + sanitizedTabName
      );

      // Add the headers
      worksheet.columns = [
        { header: strings.rank, key: "Rank", width: 10 },
        { header: strings.companies, key: "Company", width: 30 },
        { header: strings.charts, key: "Value", width: 15 },
      ];

      // Add rows from mappedTable
      worksheet.addRows(mappedTable);
      // Apply bold styling to header row
      worksheet.getRow(1).font = { bold: true };

      // Apply Arabic formatting if the current language is Arabic
      if (currentLanguage === LANGUAGES.AR) {
        applyArabicFormatting(worksheet);
      }
    });
  }

  // Generate Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Download the Excel file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};

export const exportMultipleTabsToExcelTopTen = async () => {};

// TOP TEN PAGE EXPORT END
