import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Row, Col, Card, Table } from "react-bootstrap";
import { strings, SUBTABS, TABS } from "../../utils/constants/localizedStrings";
import { useSelector } from "react-redux";
import NumberFormatter from "../common/NumberFormatter";
import RaceChart from "../common/RaceChart";
import { localized } from "../../utils/localization";
import { generateRankToBarWidth } from "../../utils/generateRankToBarWidth";
import { selectCurrentLanguage } from "../../redux/selectors";

const TopCompaniesTable = ({ selectedTab, data }) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const isInitialMount = useRef(true); // Track the initial render

  const transformColumnName = (fieldName) => {
    return fieldName
      .split(" ")
      .map((word) => word.toUpperCase())
      .join("_");
  };

  // Function to get the sub-tab key dynamically
  const getSubTabKey = (subTabName) => {
    const transformedName = transformColumnName(subTabName);

    switch (selectedTab) {
      case TABS.T_STOCK_PERFORMANCE:
        return `SP_${transformedName}`;
      case TABS.T_GROWTH_AND_DIVIDENDS:
        return `GD_${transformedName}`;
      default:
        return transformedName;
    }
  };

  // Initialize active sub-tabs
  const initializeActiveSubTabs = (data) => {
    return data.map((section) => {
      const selectedSubTab = section.subTabs.find(
        (subTab) => subTab.isSelected === "1"
      );
      const subTabKey = getSubTabKey(selectedSubTab?.tabNameEn || "");
      return SUBTABS[subTabKey] || 1;
    });
  };

  // State and effect for active sub-tabs
  const [activeSubTabs, setActiveSubTabs] = useState(() =>
    initializeActiveSubTabs(data)
  );

  useEffect(() => {
    if (!isInitialMount.current) {
      const newActiveSubTabs = initializeActiveSubTabs(
        filterDataBySelectedTab(selectedTab)
      );
      setActiveSubTabs(newActiveSubTabs);
    } else {
      isInitialMount.current = false;
    }
  }, [selectedTab, data]);

  // Function to filter data based on selectedTab
  const filterDataBySelectedTab = (tab) => {
    return data.filter((item) => item.identifier.startsWith(tab));
  };

  //change active/selected sub tab
  const handleSubTabClick = (subSectionIndex, subTabName) => {
    const subTabKey = getSubTabKey(subTabName);
    const value = SUBTABS[subTabKey];
    setActiveSubTabs((prevActiveSubTabs) =>
      prevActiveSubTabs.map((tab, index) =>
        index === subSectionIndex ? value : tab
      )
    );
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
        <tbody>{processSubSection(subSection)}</tbody>
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
        <tbody>{processSubSection(activeData)}</tbody>
      </>
    );
  };

  // Function to process and render data based on subsection type
  const processSubSection = (subSection) => {
    if (!subSection.data) return null;

    const propertyNames =
      subSection.data.length > 0 ? Object.keys(subSection.data[0]) : [];
    const secondToLastProperty =
      propertyNames.length > 1 ? propertyNames[propertyNames.length - 2] : null;

    const rankToBarWidth = generateRankToBarWidth(10, 85, 5);

    return subSection.data.map((item, index) => {
      const chartValue = secondToLastProperty ? item[secondToLastProperty] : 0;
      const rank = item.Rank !== undefined ? item.Rank : null;
      const chartWidth = rankToBarWidth[rank] || "0%";
      // const chartPercentage = (parseFloat(chartValue) / maxValue) * 100;

      return (
        <tr key={index}>
          <td>
            <span className="bg_tag">{rank}</span>
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
                <NumberFormatter value={chartValue || 0} />
              </span>
            </div>
          </td>
        </tr>
      );
    });
  };

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
                              {
                                /* {currentLanguage === LANGUAGES.EN
                                  ? subTab.tabNameEn
                                  : subTab.tabNameAr} */
                                localized(subTab, "tabName", currentLanguage)
                              }
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
                  SUBTABS.HISTORICAL_EVOLUTION ? (
                    <div className="chart-responsive">
                      <RaceChart
                        chartData={subSection.chartData}
                        currentLanguage={currentLanguage}
                      />
                    </div>
                  ) : (
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
          displaySeq: PropTypes.number.isRequired,
          isSelected: PropTypes.string.isRequired,
        })
      ).isRequired,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          Rank: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          LogoUrl: PropTypes.string,
          ShortNameEn: PropTypes.string,
          ShortNameAr: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default TopCompaniesTable;
