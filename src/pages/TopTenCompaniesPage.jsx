import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import TopCompaniesSubHeader from "../components/topten/TopCompaniesSubHeader";
import { useSelector } from "react-redux";
import TopCompaniesTable from "../components/topten/TopCompaniesTable";

const TopTenCompaniesPage = () => {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  const pages = useSelector((state) => state.apiData.pages);
  const selectedPage = pages.find((page) => !page.isSelected);
  const selectedSection = selectedPage?.sections.find(
    (section) => section.isSelected
  );

  const handleActiveTabLink = (tab) => {
    setActiveTabLink(tab);
  };

  // Extract tab data from the selected section
  const tabLinksArray =
    selectedSection?.tabs.map((tab) => ({
      tabLinkId: tab.tabId,
      nameEn: tab.tabNameEn,
      nameAr: tab.tabNameAr,
    })) || [];

  // Determine the default active tab
  const defaultActiveTab =
    selectedSection?.tabs.find((tab) => tab.isSelected)?.tabId ||
    tabLinksArray[0]?.tabLinkId;

  const [activeTabLink, setActiveTabLink] = useState(defaultActiveTab);

  const renderTabContent = () => {
    const sampleData = {
      historicalEvolution: [
        {
          rank: 1,
          company: "Yansab",
          logo: "/assets/images/yansab.svg",
          chartValue: 100,
        },
        {
          rank: 2,
          company: "Al-Rajhi",
          logo: "/assets/images/alrajhi.svg",
          chartValue: 90,
        },
        {
          rank: 3,
          company: "Aramco",
          logo: "/assets/images/aramco.svg",
          chartValue: 80,
        },
        {
          rank: 4,
          company: "Alhabib",
          logo: "/assets/images/alhabib.svg",
          chartValue: 70,
        },
        {
          rank: 5,
          company: "Almarai",
          logo: "/assets/images/almarai.svg",
          chartValue: 60,
        },
        {
          rank: 6,
          company: "Zain",
          logo: "/assets/images/zain-ksa.svg",
          chartValue: 50,
        },
        {
          rank: 7,
          company: "Dar Alarkan",
          logo: "/assets/images/dar-alarkan.svg",
          chartValue: 40,
        },
        {
          rank: 8,
          company: "Sipchem",
          logo: "/assets/images/sipchem.svg",
          chartValue: 30,
        },
        {
          rank: 9,
          company: "Riyadh Cables",
          logo: "/assets/images/riyadh-cables.svg",
          chartValue: 20,
        },
        {
          rank: 10,
          company: "SABIC",
          logo: "/assets/images/sabic.svg",
          chartValue: 10,
        },
      ],
      lastClose: [
        {
          rank: 1,
          company: "Yansab",
          logo: "/assets/images/yansab.svg",
          chartValue: 100,
        },
        {
          rank: 2,
          company: "Al-Rajhi",
          logo: "/assets/images/alrajhi.svg",
          chartValue: 90,
        },
        {
          rank: 3,
          company: "Aramco",
          logo: "/assets/images/aramco.svg",
          chartValue: 80,
        },
        {
          rank: 4,
          company: "Alhabib",
          logo: "/assets/images/alhabib.svg",
          chartValue: 70,
        },
        {
          rank: 5,
          company: "Almarai",
          logo: "/assets/images/almarai.svg",
          chartValue: 60,
        },
        {
          rank: 6,
          company: "Zain",
          logo: "/assets/images/zain-ksa.svg",
          chartValue: 50,
        },
        {
          rank: 7,
          company: "Dar Alarkan",
          logo: "/assets/images/dar-alarkan.svg",
          chartValue: 40,
        },
        {
          rank: 8,
          company: "Sipchem",
          logo: "/assets/images/sipchem.svg",
          chartValue: 30,
        },
        {
          rank: 9,
          company: "Riyadh Cables",
          logo: "/assets/images/riyadh-cables.svg",
          chartValue: 20,
        },
        {
          rank: 10,
          company: "SABIC",
          logo: "/assets/images/sabic.svg",
          chartValue: 10,
        },
      ],
      lastFiscalPeriod: [
        {
          rank: 1,
          company: "Yansab",
          logo: "/assets/images/yansab.svg",
          chartValue: 100,
        },
        {
          rank: 2,
          company: "Al-Rajhi",
          logo: "/assets/images/alrajhi.svg",
          chartValue: 90,
        },
        {
          rank: 3,
          company: "Aramco",
          logo: "/assets/images/aramco.svg",
          chartValue: 80,
        },
        {
          rank: 4,
          company: "Alhabib",
          logo: "/assets/images/alhabib.svg",
          chartValue: 70,
        },
        {
          rank: 5,
          company: "Almarai",
          logo: "/assets/images/almarai.svg",
          chartValue: 60,
        },
        {
          rank: 6,
          company: "Zain",
          logo: "/assets/images/zain-ksa.svg",
          chartValue: 50,
        },
        {
          rank: 7,
          company: "Dar Alarkan",
          logo: "/assets/images/dar-alarkan.svg",
          chartValue: 40,
        },
        {
          rank: 8,
          company: "Sipchem",
          logo: "/assets/images/sipchem.svg",
          chartValue: 30,
        },
        {
          rank: 9,
          company: "Riyadh Cables",
          logo: "/assets/images/riyadh-cables.svg",
          chartValue: 20,
        },
        {
          rank: 10,
          company: "SABIC",
          logo: "/assets/images/sabic.svg",
          chartValue: 10,
        },
      ],
      ttm: [
        {
          rank: 1,
          company: "Yansab",
          logo: "/assets/images/yansab.svg",
          chartValue: 100,
        },
        {
          rank: 2,
          company: "Al-Rajhi",
          logo: "/assets/images/alrajhi.svg",
          chartValue: 90,
        },
        {
          rank: 3,
          company: "Aramco",
          logo: "/assets/images/aramco.svg",
          chartValue: 80,
        },
        {
          rank: 4,
          company: "Alhabib",
          logo: "/assets/images/alhabib.svg",
          chartValue: 70,
        },
        {
          rank: 5,
          company: "Almarai",
          logo: "/assets/images/almarai.svg",
          chartValue: 60,
        },
        {
          rank: 6,
          company: "Zain",
          logo: "/assets/images/zain-ksa.svg",
          chartValue: 50,
        },
        {
          rank: 7,
          company: "Dar Alarkan",
          logo: "/assets/images/dar-alarkan.svg",
          chartValue: 40,
        },
        {
          rank: 8,
          company: "Sipchem",
          logo: "/assets/images/sipchem.svg",
          chartValue: 30,
        },
        {
          rank: 9,
          company: "Riyadh Cables",
          logo: "/assets/images/riyadh-cables.svg",
          chartValue: 20,
        },
        {
          rank: 10,
          company: "SABIC",
          logo: "/assets/images/sabic.svg",
          chartValue: 10,
        },
      ],
    };

    const sections = [
      {
        tabid: 8,
        title: "Market Cap",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 2, name: "Last Close" },
        ],
      },
      {
        tabid: 8,
        title: "Shareholders' Equity",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 3, name: "Last Fiscal Period" },
        ],
      },
      {
        tabid: 8,
        title: "Revenues",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 8,
        title: "Profit",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 9,
        title: "The Highest",
        data: sampleData,
        subtabs: [
          { id: 5, name: "Day" },
          { id: 6, name: "Month" },
          { id: 7, name: "3 Months" },
          { id: 8, name: "5 Years" },
          { id: 9, name: "From Beginning of the Year" },
        ],
      },
      {
        tabid: 9,
        title: "The Lowest",
        data: sampleData,
        subtabs: [
          { id: 5, name: "Day" },
          { id: 6, name: "Month" },
          { id: 7, name: "3 Months" },
          { id: 8, name: "5 Years" },
          { id: 9, name: "From Beginning of the Year" },
        ],
      },
      {
        tabid: 9,
        title: "Most Active In Quantity",
        data: sampleData,
        subtabs: [
          { id: 5, name: "Day" },
          { id: 6, name: "Month" },
          { id: 7, name: "3 Months" },
          { id: 8, name: "5 Years" },
          { id: 9, name: "From Beginning of the Year" },
        ],
      },
      {
        tabid: 9,
        title: "Most Active Value",
        data: sampleData,
        subtabs: [
          { id: 5, name: "Day" },
          { id: 6, name: "Month" },
          { id: 7, name: "3 Months" },
          { id: 8, name: "5 Years" },
          { id: 9, name: "From Beginning of the Year" },
        ],
      },
      {
        tabid: 10,
        title: "P/E",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 10,
        title: "Operating Profit",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 10,
        title: "Price/Book",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 10,
        title: "Price/Sales",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 11,
        title: "Return On Shareholder's Equity",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 11,
        title: "Indebtedness Over Shareholder's Equity",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 11,
        title: "Net Profit Margin",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 11,
        title: "Total Profit Margin",
        data: sampleData,
        subtabs: [
          { id: 1, name: "Historical Evolution" },
          { id: 4, name: "TTM" },
        ],
      },
      {
        tabid: 12,
        title: "Highest Growth",
        data: sampleData,
        subtabs: [
          { id: 10, name: "3 Years" },
          { id: 8, name: "5 Years" },
          { id: 11, name: "7 Years" },
          { id: 12, name: "10 Years" },
        ],
      },
      {
        tabid: 12,
        title: "Most Recorded Losses",
        data: sampleData,
        subtabs: [
          { id: 10, name: "3 Years" },
          { id: 8, name: "5 Years" },
          { id: 11, name: "7 Years" },
          { id: 12, name: "10 Years" },
        ],
      },
      {
        tabid: 12,
        title: "Most Profit Dividends",
        data: sampleData,
        subtabs: [
          { id: 10, name: "3 Years" },
          { id: 8, name: "5 Years" },
          { id: 11, name: "7 Years" },
          { id: 12, name: "10 Years" },
        ],
      },
      {
        tabid: 12,
        title: "Highest Return",
        data: sampleData,
        subtabs: [
          { id: 10, name: "3 Years" },
          { id: 8, name: "5 Years" },
          { id: 11, name: "7 Years" },
          { id: 12, name: "10 Years" },
        ],
      },
    ];

    const filteredSections = sections.filter(
      (section) => section.tabid === activeTabLink
    );

    return <TopCompaniesTable sections={filteredSections} />;
  };

  return (
    <MainLayout>
      <div className="pb-5">
        <TopCompaniesSubHeader
          title={
            currentLanguage === "en"
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
