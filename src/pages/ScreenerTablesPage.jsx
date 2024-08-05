import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import PageSubHeader from "../components/common/PageSubHeader";
import {
  fetchFieldConfigurationData,
  fetchScreenerData,
} from "../redux/features/fieldConfigurationSlice.js";
import ScreenerTable from "../components/common/ScreenerTable.jsx";
import { strings, LANGUAGES } from "../utils/constants/localizedStrings.js";
import config from "../utils/config.js";

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

  useEffect(() => {
    if (isDataReady) {
      dispatch(fetchScreenerData({ fieldConfigurations }));
    }
  }, [fieldConfigurations, isDataReady, dispatch]);

  const selectedPage = pages.find((page) => page.isSelected);
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
    activeTabId,
    selectedOptions
  ) => {
    const columns = [
      { key: "fixed_code", label: `${strings.code}` },
      { key: "fixed_company", label: `${strings.companies}` },
      { key: "fixed_sector", label: `${strings.sector}` },
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

    const formattedData = screenerData
      .filter((item) => item.identifier.startsWith(`${activeTabId}-`))
      .flatMap((item) =>
        item.data.map((row) => {
          const rowData = {
            fixed_code: row.Code.split(".")[0] || "",
            fixed_img: row.LogoUrl,
            fixed_company:
              currentLanguage === LANGUAGES.EN
                ? row.ShortNameEn
                : row.ShortNameAr,
            fixed_sector:
              currentLanguage === LANGUAGES.EN
                ? row.SectorNameEn
                : row.SectorNameAr,
          };

          fieldConfigurations
            .filter((config) => config.TabID === activeTabId)
            .forEach((config) => {
              const unitName = config.UnitNameEn ? ` ${config.UnitNameEn}` : "";
              const columnKey = config.FieldNameEn + unitName;
              rowData[columnKey] = row.PriceEarnings || "";
            });

          return rowData;
        })
      );
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
      activeTabLink,
      selectedOptions
    );

    const { pinnedRow } = transformDataForTable(
      screenerData,
      fieldConfigurations,
      activeTabLink,
      selectedOptions
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
      />
    );
  };

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
