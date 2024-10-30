import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import PageSubHeader from "../components/screener/PageSubHeader.jsx";
import ScreenerTable from "../components/screener/ScreenerTable.jsx";
import { PAGES, SECTORS } from "../utils/constants/localizedStrings.js";
import config from "../utils/config.js";
import useTabDataFetch from "../hooks/useTabDataFetch";
import {
  selectPages,
  selectFieldConfigurations,
  selectCurrentLanguage,
  selectScreenerData,
} from "../redux/selectors.js";
import { localized } from "../utils/localization.js";
import { transformDataForTable } from "../utils/transformScreenerData.jsx";
import { isEmpty } from "../utils/helperFunctions.js";

const ScreenerTablesPage = () => {
  const pages = useSelector(selectPages);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const fieldConfigurations = useSelector(selectFieldConfigurations);
  const screenerData = useSelector(selectScreenerData);

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeTabLink, setActiveTabLink] = useState(null);

  const sectorIdForFilter =
    (selectedOptions.includes(SECTORS.BANKING) ||
      selectedOptions.includes(SECTORS.INSURANCE) ||
      selectedOptions.includes(SECTORS.REITS) ||
      selectedOptions.includes(SECTORS.FINANCING)) &&
    selectedOptions.length === 1
      ? selectedOptions[0]
      : null;

  //hook to fetch data by active tab
  const { loading } = useTabDataFetch(
    activeTabLink,
    config.expirationInMinutes,
    sectorIdForFilter
  );

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
        displaySeq: tab.displaySeq,
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

  const renderTabContent = () => {
    if (!activeTabLink) {
      return null; // Or some placeholder indicating no data is available
    }

    const { columns, data, pinnedRow } = transformDataForTable(
      screenerData,
      fieldConfigurations,
      activeTabLink,
      currentLanguage,
      sectorIdForFilter
    );


    return (
      <>
        {loading || isEmpty(data) ? (
          <div className="spinner"></div> // Your loading spinner
        ) : (
          <ScreenerTable
            data={data}
            columns={columns}
            pinnedRow={pinnedRow}
            selectedTab={activeTabLink}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            onSelectedOptionsChange={handleSelectedOptionsChange} // Pass the handler here
          />
        )}
      </>
    );
  };

  return (
    <MainLayout>
      <div className="pb-5 min__height">
        <PageSubHeader
          title={
            selectedSection
              ? localized(selectedSection, "sectionName", currentLanguage)
              : ""
          }
          tabLinksArray={tabLinksArray}
          activeTabLink={activeTabLink}
          handleActiveTabLink={handleActiveTabLink}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions} // Pass setSelectedOptions here
        />

        {renderTabContent()}
      </div>
    </MainLayout>
  );
};

export default ScreenerTablesPage;
