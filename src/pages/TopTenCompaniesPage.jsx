import React, { useState, useMemo, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import TopCompaniesSubHeader from "../components/topten/TopCompaniesSubHeader";
import { useSelector } from "react-redux";
import TopCompaniesTable from "../components/topten/TopCompaniesTable";
import { PAGES, TABS } from "../utils/constants/localizedStrings";
import useTabDataFetch from "../hooks/useTabDataFetch";
import { localized } from "../utils/localization";
import config from "../utils/config.js";
import {
  selectCurrentLanguage,
  selectFieldConfigurations,
  selectPages,
  selectTopTenData,
  selectTopTenDataMultiple,
} from "../redux/selectors.js";
import { strings } from "../utils/constants/localizedStrings";

const TopTenCompaniesPage = () => {
  const pages = useSelector(selectPages);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const fieldConfigurations = useSelector(selectFieldConfigurations);

  const topTenData = useSelector(selectTopTenData);
  const topTenDataMultiple = useSelector(selectTopTenDataMultiple);

  // Get the selected page and section
  const selectedPage = pages.find((page) => page.pageId === PAGES.TOPTEN);
  const selectedSection = selectedPage?.sections.find(
    (section) => section.isSelected
  );

  //defaultActiveTab
  const [activeTabLink, setActiveTabLink] = useState(TABS.T_RANKING);

  // default active subtabs will be index 0 for each subsection
  const [activeSubTabs, setActiveSubTabs] = useState({
    0: 0,
    1: 0,
    2: 0,
    3: 0,
  });

  // Handle updating the specific sub-section's active tab
  const handleSubTabsChange = (subSectionIndex, newSubTabIndex) => {
    setActiveSubTabs((prevActiveSubTabs) => ({
      ...prevActiveSubTabs, // Keep the previous state
      [subSectionIndex]: newSubTabIndex, // Update the specific sub-section index
    }));
  };

  //hook to fetch data by active tab
  const { loading } = useTabDataFetch(
    activeTabLink,
    config.expirationInMinutes
  );

  const handleActiveTabLink = (tab) => {
    setActiveTabLink(tab);
    setActiveSubTabs({ 0: 0, 1: 0, 2: 0, 3: 0 }); // reset to default when active tab is changed
  };

  // Memoize tabLinksArray to avoid recalculating it unnecessarily
  const tabLinksArray = useMemo(() => {
    if (!selectedSection) return [];

    return selectedSection.tabs.map((tab) => ({
      tabLinkId: tab.tabId,
      nameEn: tab.tabNameEn,
      nameAr: tab.tabNameAr,
    }));
  }, [selectedSection, currentLanguage]);

  useEffect(() => {
    if (tabLinksArray.length > 0) {
      setActiveTabLink(tabLinksArray[0].tabLinkId);
    }
  }, [tabLinksArray, currentLanguage]);

  // Create a map of field configurations for easier lookup
  const fieldConfigMap = useMemo(() => {
    const map = {};
    fieldConfigurations.forEach((field) => {
      map[field.Pkey] = {
        nameEn: field.FieldNameEn,
        nameAr: field.FieldNameAr,
        unitEn: field.UnitNameEn,
        unitAr: field.UnitNameAr,
        notesEn: field.NotesEn,
        notesAr: field.NotesAr,
      };
    });
    return map;
  }, [fieldConfigurations]);

  // switch data source
  const getFilteredData = (isMultiple) => {
    const data = isMultiple ? topTenDataMultiple : topTenData;
    return filterAndMapData(data);
  };

  // filter data using the identifier and map using the field id (second index of the identifier)
  const filterAndMapData = (data) => {
    if (!activeTabLink || !data) return [];

    return data
      .filter(
        (item) =>
          item.identifier.startsWith(activeTabLink) &&
          item.identifier.endsWith(`-${currentLanguage}`)
      )
      .map((item) => {
        const fieldId = item.identifier.split("-")[1];
        return {
          ...item,
          fieldNameEn: fieldConfigMap[fieldId]?.nameEn || fieldId,
          fieldNameAr: fieldConfigMap[fieldId]?.nameAr || fieldId,
          unitNameEn: fieldConfigMap[fieldId]?.unitEn || "",
          unitNameAr: fieldConfigMap[fieldId]?.unitAr || "",
          notesEn: fieldConfigMap[fieldId]?.notesEn || "",
          notesAr: fieldConfigMap[fieldId]?.notesAr || "",
        };
      });
  };

  const tabsWithRaceChart = [
    TABS.T_RANKING,
    TABS.T_ARR_MULTIPLE,
    TABS.T_FINANCIAL_RATIO,
  ];

  const tabsWithMultipleSubTabs = [
    TABS.T_STOCK_PERFORMANCE,
    TABS.T_GROWTH_AND_DIVIDENDS,
  ];

  // Function to determine which data and flags to pass
  const getDataAndFlags = (tabLink) => {
    let data;
    let isMultiple = false;

    // Check if the activeTabLink is in the specified ranges
    if (tabsWithRaceChart.includes(tabLink)) {
      data = getFilteredData(false);
    } else if (tabsWithMultipleSubTabs.includes(tabLink)) {
      data = getFilteredData(true);

      isMultiple = true;
    }

    return { data, isMultiple };
  };

  // Get data and flags based on activeTabLink
  const { data, isMultiple } = getDataAndFlags(activeTabLink);

  const renderTabContent = useCallback(() => {
    return (
      <>
        {loading && <div className="spinner"></div>}
        {activeTabLink === TABS.T_FINANCIAL_RATIO && (
          <div className="flex-fill text_right mt-2 no-print mb-2">
            <p className="font-20 mb-0 date">{strings.tableCommentTopTen}</p>
          </div>
        )}
        <TopCompaniesTable
          selectedTab={activeTabLink}
          data={data}
          isMultiple={isMultiple} // Pass isMultiple as true or false
          onSubTabsChange={handleSubTabsChange}
        />
      </>
    );
  }, [activeTabLink, getFilteredData, loading]);

  return (
    <MainLayout>
      <div className="pb-5 min__height">
        <TopCompaniesSubHeader
          title={
            selectedSection
              ? localized(selectedSection, "sectionName", currentLanguage)
              : ""
          }
          tabLinksArray={tabLinksArray}
          activeTabLink={activeTabLink}
          handleActiveTabLink={handleActiveTabLink}
          activeSubTabs={activeSubTabs}
        />

        {renderTabContent()}
      </div>
    </MainLayout>
  );
};

export default TopTenCompaniesPage;
