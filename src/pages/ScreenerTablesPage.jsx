import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import PageSubHeader from "../components/screener/PageSubHeader.jsx";
import ScreenerTable from "../components/screener/ScreenerTable.jsx";
import {
  strings,
  LANGUAGES,
  PAGES,
} from "../utils/constants/localizedStrings.js";
import config from "../utils/config.js";
import useTabDataFetch from "../hooks/useTabDataFetch"; // Import the hook
import {
  selectPages,
  selectFieldConfigurations,
  selectCurrentLanguage,
  selectScreenerData,
} from "../redux/selectors.js";
import { localized } from "../utils/localization.js";

const ScreenerTablesPage = () => {
  const pages = useSelector(selectPages);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const fieldConfigurations = useSelector(selectFieldConfigurations);
  const screenerData = useSelector(selectScreenerData);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeTabLink, setActiveTabLink] = useState(null);

  //hook to fetch data by active tab
  const { loading } = useTabDataFetch(activeTabLink);

  const selectedPage = pages.find((page) => page.pageId === PAGES.SCREENER);
  const selectedSection = selectedPage?.sections.find(
    (section) => section.isSelected
  );

  // Memoize tabLinksArray
  const tabLinksArray = useMemo(
    () =>
      selectedSection?.tabs.map((tab) => ({
        tabLinkId: tab.tabId,
        nameEn: tab.tabNameEn,
        nameAr: tab.tabNameAr,
      })) || [],
    [selectedSection, currentLanguage]
  );

  // Set default value for activeTabLink
  useEffect(() => {
    const defaultTab =
      tabLinksArray.length > 0 ? tabLinksArray[0].tabLinkId : null;
    setActiveTabLink(defaultTab);
  }, [tabLinksArray, currentLanguage]);

  const handleActiveTabLink = useCallback((tab) => {
    setActiveTabLink(tab);
  }, []);

  const handleSelectedOptionsChange = useCallback((newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  }, []);

  const transformDataForTable = (
    screenerData,
    fieldConfigurations,
    activeTabId
  ) => {
    const columns = [
      { key: "fixed_code", label: `${strings.code}` },
      { key: "fixed_company", label: `${strings.companies}` },
      { key: "fixed_sector", label: `${strings.sector}` },
      { key: "CompanyID", label: "CompanyID", hidden: true },
      ...fieldConfigurations
        .filter((item) => item.TabID === activeTabId)
        .map((item) => {
          const unitName = localized(item, "UnitName", currentLanguage);
          const fieldName = localized(item, "FieldName", currentLanguage);
          const optionalUnitName = unitName ? ` ${unitName}` : "";
          return {
            //key: fieldName + optionalUnitName,
            key: item.Pkey,
            label: fieldName + optionalUnitName,
          };
        }),
    ];

    const pinnedRow = {
      fixed_code: "",
      fixed_img: "/assets/images/tasi.svg",
      fixed_company: currentLanguage === LANGUAGES.EN ? "Tasi" : "تاسي",
      fixed_sector: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="3"
          viewBox="0 0 30 3"
        >
          <path
            id="Path_95057"
            data-name="Path 95057"
            d="M27,0H0"
            transform="translate(1.5 1.5)"
            fill="none"
            stroke="#e27922"
            strokeLinecap="square"
            strokeWidth="3"
          />
        </svg>
      ),
      ...fieldConfigurations
        .filter((config) => config.TabID === activeTabId)
        .reduce((acc, config) => {
          const unitName = config.UnitNameEn ? ` ${config.UnitNameEn}` : "";
          const columnKey = config.FieldNameEn + unitName;
          acc[columnKey] = "78.50";
          return acc;
        }, {}),
    };

    // Initialize a map to track all column keys
    const columnKeysSet = new Set();
    // Initialize a map to hold the formatted data
    const formattedDataMap = new Map();

    screenerData
      .filter(
        (item) =>
          item.identifier.startsWith(`${activeTabId}-`) &&
          item.identifier.endsWith(`-${currentLanguage}`)
      )
      .forEach((item) => {
        // Extract the relevant part of the identifier to form the column key
        const identifierParts = item.identifier
          .split("-")
          .filter((part) => part && part.trim() !== "" && part !== "null");
        //const fieldName = identifierParts.slice(1, -1).join(" "); // join the identifier parts using white space and remove the language part
        const fieldId = item.identifier.split("-")[1];

        //columnKeysSet.add(fieldName);
        columnKeysSet.add(fieldId);

        // Iterate through each row in the item data
        if (!item.data) return;
        item.data.forEach((row) => {
          const fixedCode = row.Code.split(".")[0] || "";

          // Check if the company already exists in formattedDataMap
          if (!formattedDataMap.has(fixedCode)) {
            formattedDataMap.set(fixedCode, {
              fixed_code: fixedCode,
              fixed_img: row.LogoUrl,
              fixed_company: localized(row, "ShortName", currentLanguage),
              fixed_sector: localized(row, "SectorName", currentLanguage),
              CompanyID: row.CompanyID,
            });
          }

          // Get the existing company data
          const existingCompany = formattedDataMap.get(fixedCode);

          // Add the value to the correct column
          const keys = Object.keys(row);
          const secondToLastKey = keys[keys.length - 2];
          //existingCompany[fieldName] = row[secondToLastKey] ?? "-"; // Use dash if undefined or null
          existingCompany[fieldId] = row[secondToLastKey] ?? "-"; // Use dash if undefined or null
        });
      });

    // Convert the columnKeysSet to an array for easy iteration
    const columnKeys = Array.from(columnKeysSet);

    // Ensure all columns are present in each row
    formattedDataMap.forEach((data) => {
      columnKeys.forEach((key) => {
        if (data[key] === undefined) {
          data[key] = "-"; // Set missing columns to - (dash)
        }
      });
    });

    // Convert the Map to an array
    const formattedData = Array.from(formattedDataMap.values());

    return {
      columns,
      data: formattedData,
      pinnedRow,
    };
  };

  const renderTabContent = () => {
    if (!activeTabLink) {
      return null; // Or some placeholder indicating no data is available
    }

    const { columns, data } = transformDataForTable(
      screenerData,
      fieldConfigurations,
      activeTabLink
    );

    const { pinnedRow } = transformDataForTable(
      screenerData,
      fieldConfigurations,
      activeTabLink
    );

    return (
      <>
        {loading ? (
          <div className="spinner"></div> // Your loading spinner
        ) : (
          <ScreenerTable
            data={data}
            columns={columns}
            itemsPerPage={config.screenerTableItemPerPage}
            pinnedRow={pinnedRow}
            selectedTab={activeTabLink}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            decimals={config.decimals}
          />
        )}
      </>
    );
  };

  return (
    <MainLayout>
      <div className="pb-5">
        <PageSubHeader
          title={localized(selectedSection, "sectionName", currentLanguage)}
          tabLinksArray={tabLinksArray}
          activeTabLink={activeTabLink}
          handleActiveTabLink={handleActiveTabLink}
          onSelectedOptionsChange={handleSelectedOptionsChange} // Pass the handler here
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions} // Pass setSelectedOptions here
        />

        {renderTabContent()}
      </div>
    </MainLayout>
  );
};

export default ScreenerTablesPage;
