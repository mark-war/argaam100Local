import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Row, Col, Card, Table } from "react-bootstrap";
import {
  strings,
  LANGUAGES,
  SUBTABS,
  TABS,
} from "../../utils/constants/localizedStrings";
import { useSelector } from "react-redux";
import NumberFormatter from "../common/NumberFormatter";
import RaceChart from "../common/RaceChart";
import { localized } from "../../utils/localization";
import { generateRankToBarWidth } from "../../utils/generateRankToBarWidth";

const TopCompaniesTable = ({ selectedTab, data }) => {
  const transformColumnName = (fieldName) => {
    return fieldName
      .split(" ")
      .map((word) => word.toUpperCase())
      .join("_");
  };

  // Function to get the sub-tab key dynamically
  const getSubTabKey = (subTabName) => {
    const transformedName = transformColumnName(subTabName);

    if (selectedTab === TABS.T_STOCK_PERFORMANCE) {
      return `SP_${transformedName}`;
    }

    if (selectedTab === TABS.T_GROWTH_AND_DIVIDENDS) {
      return `GD_${transformedName}`;
    }

    return transformedName;
  };

  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  const isInitialMount = useRef(true); // Track the initial render

  // Initialize activeSubTab state for each section
  const initializeActiveSubTabs = (data) => {
    return data.map((section) => {
      const selectedSubTab = section.subTabs.find(
        (subTab) => subTab.isSelected === "1"
      );
      const subTabKey = getSubTabKey(
        selectedSubTab.tabNameEn,
        section.subTabs.length
      );
      const subTabValue = SUBTABS[subTabKey];
      const activeTab = selectedSubTab ? subTabValue : 1;
      return activeTab;
    });
  };

  const [activeSubTabs, setActiveSubTabs] = useState(() =>
    initializeActiveSubTabs(data)
  );
  // const [selectedSubTab, setSelectedSubTab] = useState(() =>
  //   initializeActiveSubTabs(data)
  // );

  // Effect to reset activeSubTabs only when selectedTab changes on initial render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false; // After initial mount, mark as false
    } else {
      const newActiveSubTabs = initializeActiveSubTabs(
        filterDataBySelectedTab(selectedTab)
      );
      setActiveSubTabs(newActiveSubTabs);
    }
  }, [selectedTab, data]);

  // Function to filter data based on selectedTab
  const filterDataBySelectedTab = (tab) => {
    return data.filter((item) => item.identifier.startsWith(tab));
  };

  //change active/selected sub tab
  const handleSubTabClick = (subSectionIndex, subTabName) => {
    const subTabKey = getSubTabKey(subTabName, 0);
    const value = SUBTABS[subTabKey];
    setActiveSubTabs((prevActiveSubTabs) =>
      prevActiveSubTabs.map((tab, index) =>
        index === subSectionIndex ? value : tab
      )
    );
    // setSelectedSubTab(value);
    // console.log("activeSubTabs: ", activeSubTabs);
    // console.log("selectedSubTab: ", selectedSubTab);
  };

  const filteredData = useMemo(
    () => filterDataBySelectedTab(selectedTab),
    [selectedTab, data]
  );

  //constant table header for topten page
  const headers = [
    { label: strings.rank },
    { label: strings.companies },
    { label: strings.charts },
  ];

  // Helper function to render table headers
  const renderTableHeaders = (columns) => {
    return (
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.label}</th>
          ))}
        </tr>
      </thead>
    );
  };

  // Helper function to render a single row of data
  const renderTableRows = (subSection) => {
    if (!subSection.data) return null;

    return (
      <>
        {renderTableHeaders(headers)}
        <tbody>{ProcessSubSection(subSection, currentLanguage)}</tbody>
      </>
    );
  };

  // Helper function to render multiple rows of data
  const renderMultipleTableRows = (subSection, subSectionIndex) => {
    if (!subSection.data) return null;

    // Find the active sub-tab index within the subTabs array
    const activeSubTabIndex = subSection.subTabs.findIndex(
      (subTab) =>
        SUBTABS[getSubTabKey(localized(subTab, "tabName", currentLanguage))] ===
        activeSubTabs[subSectionIndex]
    );

    const activeData = subSection.data[activeSubTabIndex];

    if (!activeData) return null;

    return (
      <>
        {renderTableHeaders(headers)}
        <tbody>{ProcessSubSection(activeData, currentLanguage)}</tbody>
      </>
    );
  };

  // Function to process and render data based on subsection type
  function ProcessSubSection(subSection, currentLanguage) {
    if (!subSection.data) return null;
    const propertyNames =
      subSection.data.length > 0 ? Object.keys(subSection.data[0]) : [];
    const secondToLastProperty =
      propertyNames.length > 1 ? propertyNames[propertyNames.length - 2] : null;

    // const maxValue = secondToLastProperty
    //   ? Math.max(
    //       ...subSection.data.map((item) =>
    //         parseFloat(item[secondToLastProperty])
    //       )
    //     )
    //   : 1;

    const rankToBarWidth = generateRankToBarWidth(10, 85, 5);

    return subSection.data.map((item, index) => {
      const chartValue = secondToLastProperty ? item[secondToLastProperty] : 0;
      const rank = item.Rank !== undefined ? item.Rank : null;
      const chartWidth = rankToBarWidth[rank] || "0%";
      // const chartPercentage = (parseFloat(chartValue) / maxValue) * 100;

      return (
        <tr key={index}>
          <td>
            <span className="bg_tag">
              {item.Rank !== undefined ? item.Rank : "-"}
            </span>
          </td>
          <td className="td_img">
            <span className="d-flex align-items-center">
              <img alt="Image" src={item.LogoUrl} className="logo_image" />
              <span>
                {
                  /* {currentLanguage === LANGUAGES.EN
                  ? item.ShortNameEn
                  : item.ShortNameAr} */
                  localized(item, "ShortName", currentLanguage)
                }
              </span>
            </span>
          </td>
          <td>
            <div className="charts_table_bg">
              <span className="bg" style={{ width: `${chartWidth}` }}></span>
              <span>
                <NumberFormatter value={chartValue} />
              </span>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="px-layout col_space mt-4 pt-1">
      <Row>
        {filteredData.map((subSection, subSectionIndex) => {
          const sortedSubTabs = [...subSection.subTabs].sort(
            (a, b) => Number(a.displaySeq) - Number(b.displaySeq)
          );
          const subTabCount = sortedSubTabs.length;

          return (
            <Col lg={6} key={subSectionIndex}>
              <div className="tabs_inner_nav row px-3">
                <div className="col-6">
                  <p className="sub_heading">
                    {subSection.identifier.split("-")[1]}
                  </p>
                </div>
                <div className="col-6">
                  <div className="flex-fill justify-content-end">
                    <ul className="tabs_nav tabs_inner navbar-nav align-items-center flex-row justify-content-end">
                      {sortedSubTabs.map((subTab, subTabIndex) => {
                        // Determine the dynamic key based on the current sub-tab and count
                        const subTabKey = getSubTabKey(
                          localized(subTab, "tabName", currentLanguage),
                          // currentLanguage === LANGUAGES.EN
                          //   ? subTab.tabNameEn
                          //   : subTab.tabNameAr,
                          subTabCount
                        );

                        return (
                          <li className="nav-item" key={subTabIndex}>
                            <button
                              className={`nav-link cursor-pointer ${
                                activeSubTabs[subSectionIndex] ===
                                SUBTABS[subTabKey]
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() =>
                                handleSubTabClick(
                                  subSectionIndex,
                                  localized(subTab, "tabName", currentLanguage)
                                  // currentLanguage === LANGUAGES.EN
                                  //   ? subTab.tabNameEn
                                  //   : subTab.tabNameAr
                                )
                              }
                            >
                              <span>
                                {
                                  /* {currentLanguage === LANGUAGES.EN
                                  ? subTab.tabNameEn
                                  : subTab.tabNameAr} */
                                  localized(subTab, "tabName", currentLanguage)
                                }
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>

              <Card className="rounded border-0 table_chart">
                <Card.Body className="px-layout bg-white rounded">
                  {activeSubTabs[subSectionIndex] ===
                    SUBTABS.HISTORICAL_EVOLUTION && (
                    <div className="chart-responsive">
                      <RaceChart
                        chartData={subSection.chartData}
                        currentLanguage={currentLanguage}
                      />
                    </div>
                  )}
                  {activeSubTabs[subSectionIndex] !==
                    SUBTABS.HISTORICAL_EVOLUTION && (
                    <div className="table-responsive">
                      <Table className="table_layout" style={{ width: "100%" }}>
                        {subTabCount === 2
                          ? renderTableRows(subSection)
                          : renderMultipleTableRows(
                              subSection,
                              subSectionIndex
                            )}
                      </Table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

// Define PropTypes for the component
TopCompaniesTable.propTypes = {
  selectedTab: PropTypes.number,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      subTabs: PropTypes.arrayOf(
        PropTypes.shape({
          tabNameEn: PropTypes.string.isRequired,
          tabNameAr: PropTypes.string.isRequired,
          displaySeq: PropTypes.number.isRequired, // Add displaySeq as a required prop
          isSelected: PropTypes.string.isRequired,
        })
      ).isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          Rank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Make Rank optional
          LogoUrl: PropTypes.string,
          ShortNameEn: PropTypes.string,
          ShortNameAr: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default TopCompaniesTable;
