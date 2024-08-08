import React, { useState, useMemo, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import TopCompaniesSubHeader from "../components/topten/TopCompaniesSubHeader";
import { useSelector, useDispatch } from "react-redux";
import TopCompaniesTable from "../components/topten/TopCompaniesTable";
import { LANGUAGES, PAGES } from "../utils/constants/localizedStrings";
import {
  fetchFieldConfigurationData,
  fetchScreenerData,
} from "../redux/features/fieldConfigurationSlice.js";

const TopTenCompaniesPage = () => {
  const dispatch = useDispatch();
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

  const handleActiveTabLink = (tab) => {
    setActiveTabLink(tab);
  };

  useEffect(() => {
    dispatch(fetchFieldConfigurationData());
  }, [dispatch]);

  useEffect(() => {
    if (fieldConfigurations.length > 0) {
      dispatch(fetchScreenerData({ fieldConfigurations, currentLanguage }));
    }
  }, [fieldConfigurations, dispatch]);

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

  useEffect(() => {
    if (tabLinksArray.length > 0) {
      setActiveTabLink(tabLinksArray[0].tabLinkId);
    }
  }, [tabLinksArray]);

  const getFilteredData = () => {
    return tabLinksArray.reduce((acc, tab) => {
      const filtered = screenerData.filter((item) =>
        item.identifier.startsWith(tab.tabLinkId)
      );

      return acc.concat(filtered);
    }, []);
  };

  const renderTabContent = () => {
    return (
      <TopCompaniesTable selectedTab={activeTabLink} data={getFilteredData()} />
    );
  };

  return (
    <MainLayout>
      <div className="pb-5">
        <TopCompaniesSubHeader
          title={
            currentLanguage === LANGUAGES.EN
              ? selectedSection?.sectionNameEn
              : selectedSection?.sectionNameAr
          }
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
