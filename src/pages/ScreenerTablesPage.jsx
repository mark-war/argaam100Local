import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import PageSubHeader from "../components/screener/PageSubHeader.jsx";
import {
  fetchFieldConfigurationData,
  fetchScreenerData,
} from "../redux/features/fieldConfigurationSlice.js";
import ScreenerTable from "../components/screener/ScreenerTable.jsx";
import {
  strings,
  LANGUAGES,
  PAGES,
} from "../utils/constants/localizedStrings.js";
import config from "../utils/config.js";
import LoadingScreen from "../components/common/LoadingScreen.jsx";

const ScreenerTablesPage = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const fieldConfigurations = useSelector(
    (state) => state.screener.fieldConfigurations
  );
  const screenerData = useSelector((state) => state.screener.screenerData);
  const isScreenerDataLoaded = useSelector(
    (state) => state.screener.isScreenerDataLoaded
  );
  const pages = useSelector((state) => state.apiData.pages);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeTabLink, setActiveTabLink] = useState(null);

  useEffect(() => {
    dispatch(fetchFieldConfigurationData());
  }, [dispatch]);

  const isDataReady = useMemo(
    () => fieldConfigurations.length > 0 && !isScreenerDataLoaded,
    [fieldConfigurations, isScreenerDataLoaded]
  );

  // console.log("DISPATCH CONFIG");
  // dispatch(fetchFieldConfigurationData());
  // console.log("DISPATCH SCREENER");
  // dispatch(fetchScreenerData({ fieldConfigurations, currentLanguage }));

  useEffect(() => {
    if (isDataReady) {
      dispatch(fetchScreenerData({ fieldConfigurations, currentLanguage }));
    }
  }, [fieldConfigurations, isDataReady, dispatch]);

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
    [selectedSection]
  );

  // Set default value for activeTabLink
  useEffect(() => {
    const defaultTab =
      tabLinksArray.length > 0 ? tabLinksArray[0].tabLinkId : null;
    setActiveTabLink(defaultTab);
  }, [tabLinksArray]);

  const handleActiveTabLink = (tab) => {
    setActiveTabLink(tab);
  };

  const handleSelectedOptionsChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  };

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
          const unitName =
            currentLanguage === LANGUAGES.AR
              ? item.UnitNameAr
              : item.UnitNameEn;
          const fieldName =
            currentLanguage === LANGUAGES.AR
              ? item.FieldNameAr
              : item.FieldNameEn;
          const optionalUnitName = unitName ? ` ${unitName}` : "";
          return {
            key: fieldName + optionalUnitName,
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
      .filter((item) => item.identifier.startsWith(`${activeTabId}-`))
      .forEach((item) => {
        // Extract the relevant part of the identifier to form the column key
        const identifierParts = item.identifier
          .split("-")
          .filter((part) => part && part.trim() !== "" && part !== "null");
        const fieldName = identifierParts.slice(1).join(" "); // This assumes identifier is formatted like `${activeTabId}-<FieldName>`

        columnKeysSet.add(fieldName);

        // Iterate through each row in the item data
        if (!item.data) return;
        item.data.forEach((row) => {
          const fixedCode = row.Code.split(".")[0] || "";

          // Check if the company already exists in formattedDataMap
          if (!formattedDataMap.has(fixedCode)) {
            formattedDataMap.set(fixedCode, {
              fixed_code: fixedCode,
              fixed_img: row.LogoUrl,
              fixed_company:
                currentLanguage === LANGUAGES.EN
                  ? row.ShortNameEn
                  : row.ShortNameAr,
              fixed_sector:
                currentLanguage === LANGUAGES.EN
                  ? row.SectorNameEn
                  : row.SectorNameAr,
              CompanyID: row.CompanyID,
            });
          }

          // Get the existing company data
          const existingCompany = formattedDataMap.get(fixedCode);

          // Add the value to the correct column
          const keys = Object.keys(row);
          const secondToLastKey = keys[keys.length - 2];
          existingCompany[fieldName] = row[secondToLastKey] ?? "-"; // Use dash if undefined or null
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
    );
  };

  if (!isDataReady) {
    return <LoadingScreen />;
  }

  return (
    <MainLayout>
      <div className="pb-5">
        <PageSubHeader
          title={
            currentLanguage === LANGUAGES.EN
              ? selectedSection?.sectionNameEn
              : selectedSection?.sectionNameAr
          }
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
