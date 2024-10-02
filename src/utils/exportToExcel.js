import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { LANGUAGES, strings } from "./constants/localizedStrings";
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

// Function to apply right-to-left properties for Arabic
const applyArabicFormatting = (worksheet) => {
  // Set the worksheet properties to indicate RTL
  worksheet.properties.outline = { summaryBelow: false }; // Optional, adjust as needed
  //worksheet.properties.tabColor = { argb: "FF0000" }; // Optional, adjust color if needed

  // Set alignment to right for all columns in the worksheet
  worksheet.columns.forEach((column) => {
    column.alignment = { horizontal: "right" }; // Align content to the right
  });

  worksheet.properties.rightToLeft = true; // Set worksheet direction to RTL
  // Set the active cell to the last column in the first row
  const lastColumnIndex = worksheet.columns.length; // Get the last column index
  const lastCellAddress = `${String.fromCharCode(64 + lastColumnIndex)}1`; // Get the address of the last cell in the first row
  worksheet.views = [
    {
      state: "normal",
      activeCell: lastCellAddress, // Set the active cell to the last column in the first row
      rightToLeft: true,
    },
  ];
};

const customSort = (data, key, direction) => {
  // Define the group for each value
  const getGroup = (value) => {
    if (value === "-" || value === undefined || value === null) return 3; // Dash values group
    if (value < 0) return 2; // Negative values group
    if (value >= 100) return 1; // Positives >= 100 group
    return 0; // Positives < 100 group
  };

  // Preallocate the groups array for efficiency
  const groups = [[], [], [], []];

  // Assign each data item to the correct group
  data.forEach((item) => {
    const group = getGroup(item[key]);
    groups[group].push(item);
  });

  // Sort only non-dash groups
  groups.forEach((group, index) => {
    if (group.length > 1 && index !== 3) {
      // Skip the dash group (index 3)
      group.sort((a, b) => {
        if (a[key] === "-" || b[key] === "-") return 0;
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      });
    }
  });

  // Flatten the groups into a single array
  return groups.flat();
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
          : typeof a[sortConfig.key] === "string"
          ? parseFloat(a[sortConfig.key].replace(/,/g, "")) // Remove commas from strings
          : a[sortConfig.key]; // If it's a number, use it directly

      const bValue =
        b[sortConfig.key] === "-" ||
        b[sortConfig.key] === null ||
        b[sortConfig.key] === undefined
          ? null
          : typeof a[sortConfig.key] === "string"
          ? parseFloat(a[sortConfig.key].replace(/,/g, "")) // Remove commas from strings
          : a[sortConfig.key]; // If it's a number, use it directly

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

const processRowData = (rowData) => {
  const formattedRow = {};

  // Iterate through the rowData keys
  Object.keys(rowData).forEach((key) => {
    // Check if the key is a numeric string and not one of the fixed keys
    if (!isNaN(key)) {
      const value = rowData[key];

      // Check if the key (as a number) is in peFieldIds
      if (config.peFieldIds.has(Number(key))) {
        // Format using custom logic for PE fields
        formattedRow[key] = formatValue(value, 2, true); // PE formatting
      } else {
        // General formatting for other fields
        formattedRow[key] = formatValue(value);
      }
    } else {
      // For fixed fields like company, sector, etc., add them directly to the formattedRow
      formattedRow[key] = rowData[key];
    }
  });

  return formattedRow;
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
        const value = rowData[secondToLastKey];
        // config.peFieldIds.has(Number(fieldId))
        //   ? formatValue(rowData[secondToLastKey], 2, true)
        //   : formatValue(rowData[secondToLastKey]);

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
    const formattedRow = processRowData(rowData);

    const newRow = worksheet.addRow(formattedRow);

    // Apply hyperlink to the 'fixed_company' cell
    if (formattedRow.fixed_company) {
      const cell = newRow.getCell("fixed_company");
      cell.value = {
        text: formattedRow.fixed_company,
        hyperlink: argaamUrl(formattedRow.CompanyID, currentLanguage),
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

    const columns = [
      { key: "fixed_code", label: `${strings.code}` },
      { key: "fixed_company", label: `${strings.companies}` },
      { key: "fixed_sector", label: `${strings.sector}` },
      { key: "CompanyID", label: "CompanyID", hidden: true },
      { key: "SectorID", label: "SectorID", hidden: true },
      ...fieldConfig
        .filter((item) => item.TabID === tabId)
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
          const value = rowData[secondToLastKey];
          // config.peFieldIds.has(Number(fieldId))
          //   ? formatValue(rowData[secondToLastKey], 2, true)
          //   : formatValue(rowData[secondToLastKey]);

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
      const formattedRow = processRowData(rowData);

      const newRow = worksheet.addRow(formattedRow);

      // Apply hyperlink to the 'fixed_company' cell
      if (formattedRow.fixed_company) {
        const cell = newRow.getCell("fixed_company");
        cell.value = {
          text: formattedRow.fixed_company,
          hyperlink: argaamUrl(formattedRow.CompanyID, currentLanguage),
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
        { header: "", key: "Value", width: 15 },
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
        { header: "", key: "Value", width: 15 },
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
