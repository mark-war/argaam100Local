import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Function to sanitize sheet names
const sanitizeSheetName = (name) => {
  // Replace forbidden characters with an underscore or any other preferred character
  return name.replace(/[*?:\/\\[\]]/g, "_");
};

export const exportToExcel_DIRECT = async (data, fileName, sheetName) => {
  const sanitizedSheetName = sanitizeSheetName(sheetName);

  const workbook = new ExcelJS.Workbook();
  console.log("DATA EXCEL: ", data);

  // Create a worksheet for the data
  const worksheet = workbook.addWorksheet(sanitizedSheetName);

  // Define headers for the columns
  const headers = [
    "CompanyID",
    "ShortNameAr",
    "ShortNameEn",
    "Code",
    "SectorNameAr",
    "SectorNameEn",
    "OperatingPe (Identifier 1)",
    "OperatingPe (Identifier 2)",
    "BookValue",
    "CurrentPricePerBook",
    "PricePerRevenue",
    // Add other relevant fields as needed
  ];

  // Add the headers to the worksheet
  worksheet.columns = headers.map((header) => ({
    header,
    key: header,
    width: 30,
  }));

  // Create an object to hold company data keyed by CompanyID
  const companyMap = {};

  // Iterate through the data array to populate the companyMap
  data.forEach((item) => {
    const identifierSplit = item.identifier.split("-");

    item.data.forEach((company) => {
      // If the company doesn't exist in the map, create an entry
      if (!companyMap[company.CompanyID]) {
        companyMap[company.CompanyID] = {
          CompanyID: company.CompanyID,
          ShortNameAr: company.ShortNameAr,
          ShortNameEn: company.ShortNameEn,
          Code: company.Code,
          SectorNameAr: company.SectorNameAr,
          SectorNameEn: company.SectorNameEn,
          // Initialize OperatingPe for both identifiers
          [`OperatingPe (Identifier ${identifierSplit[1]})`]: null,
          BookValue: null,
          CurrentPricePerBook: null,
          PricePerRevenue: null,
        };
      }

      // Map the relevant fields based on identifier
      if (identifierSplit[1] === "1") {
        companyMap[company.CompanyID][`OperatingPe (Identifier 1)`] =
          company.OperatingPe;
      } else if (identifierSplit[1] === "2") {
        companyMap[company.CompanyID][`OperatingPe (Identifier 2)`] =
          company.OperatingPe;
      } else if (item.identifier === "5-3-en") {
        companyMap[company.CompanyID]["BookValue"] = company.BookValue;
      } else if (item.identifier === "5-4-en") {
        companyMap[company.CompanyID]["CurrentPricePerBook"] =
          company.CurrentPricePerBook;
      } else if (item.identifier === "5-5-en") {
        companyMap[company.CompanyID]["PricePerRevenue"] =
          company.PricePerRevenue;
      }
      // Add more conditions if you have more identifiers
    });
  });

  // Add rows for each company from the map
  Object.values(companyMap).forEach((company) => {
    worksheet.addRow(company);
  });

  // Apply styling (optional)
  worksheet.getRow(1).font = { bold: true };

  // Generate Excel file buffer
  const buffer = await workbook.xlsx.writeBuffer();

  // Download the Excel file
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, fileName);
};
