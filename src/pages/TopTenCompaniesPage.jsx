import React, { useState, useMemo, useEffect, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import TopCompaniesSubHeader from "../components/topten/TopCompaniesSubHeader";
import { useSelector } from "react-redux";
import TopCompaniesTable from "../components/topten/TopCompaniesTable";
import { PAGES } from "../utils/constants/localizedStrings";
import useTabDataFetch from "../hooks/useTabDataFetch";
import { localized } from "../utils/localization";
import config from "../utils/config.js";

const TopTenCompaniesPage = () => {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const fieldConfigurations = useSelector(
    (state) => state.screener.fieldConfigurations
  );
  const screenerData = useSelector((state) => state.screener.screenerData);
  const pages = useSelector((state) => state.apiData.pages);

  // Get the selected page and section
  const selectedPage = pages.find((page) => page.pageId === PAGES.TOPTEN);
  const selectedSection = selectedPage?.sections.find(
    (section) => section.isSelected
  );

  //defaultActiveTab
  const [activeTabLink, setActiveTabLink] = useState(null);

  //hook to fetch data by active tab
  const { loading } = useTabDataFetch(
    activeTabLink,
    config.expirationInMinutes
  );

  const handleActiveTabLink = (tab) => {
    setActiveTabLink(tab);
  };

  // Memoize tabLinksArray to avoid recalculating it unnecessarily
  const tabLinksArray = useMemo(() => {
    if (!selectedSection) return [];

    return selectedSection.tabs.map((tab) => ({
      tabLinkId: tab.tabId,
      nameEn: tab.tabNameEn,
      nameAr: tab.tabNameAr,
    }));
  }, [selectedSection?.tabs]);

  useEffect(() => {
    if (tabLinksArray.length > 0) {
      setActiveTabLink(tabLinksArray[0].tabLinkId);
    }
  }, [tabLinksArray]);

  // Create a map of field configurations for easier lookup
  const fieldConfigMap = useMemo(() => {
    const map = {};
    fieldConfigurations.forEach((field) => {
      map[field.Pkey] = {
        nameEn: field.FieldNameEn,
        nameAr: field.FieldNameAr,
      };
    });
    return map;
  }, [fieldConfigurations]);

  const getFilteredData = () => {
    if (!activeTabLink || !screenerData) return [];
    return screenerData
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
        };
      });
  };

  const renderTabContent = useCallback(() => {
    return (
      <>
        {loading && <div className="spinner"></div>}
        <TopCompaniesTable
          selectedTab={activeTabLink}
          data={getFilteredData()}
        />
      </>
    );
  }, [activeTabLink, getFilteredData, loading]);

  return (
    <MainLayout>
      <div className="pb-5 min__height">
        <TopCompaniesSubHeader
          title={localized(selectedSection, "sectionName", currentLanguage)}
          tabLinksArray={tabLinksArray}
          activeTabLink={activeTabLink}
          handleActiveTabLink={handleActiveTabLink}
        />

        {renderTabContent()}
      </div>
    </MainLayout>
  );
};

export default TopTenCompaniesPage;
