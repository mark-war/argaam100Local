import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Row, Col, Card, Table } from "react-bootstrap";
import {
  strings,
  LANGUAGES,
  LANGUAGEID,
  SUBTABS,
} from "../../utils/constants/localizedStrings";
import { useSelector } from "react-redux";
import NumberFormatter from "../common/NumberFormatter";
import config from "../../utils/config";

const TopCompaniesTable = ({ selectedTab, data }) => {
  const transformColumnName = (fieldName) => {
    return fieldName
      .split(" ")
      .map((word) => word.toUpperCase())
      .join("_");
  };

  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  // Initialize activeSubTab state for each section
  const initializeActiveSubTabs = (data) => {
    return data.map((section) => {
      const selectedSubTab = section.subTabs.find(
        (subTab) => subTab.isSelected === "1"
      );
      const activeTab = selectedSubTab
        ? SUBTABS[transformColumnName(selectedSubTab.tabNameEn)]
        : 1;
      return activeTab;
    });
  };

  const [activeSubTabs, setActiveSubTabs] = useState(
    initializeActiveSubTabs(data)
  );

  // Reset activeSubTabs whenever selectedTab changes
  useEffect(() => {
    const newActiveSubTabs = initializeActiveSubTabs(
      filterDataBySelectedTab(selectedTab)
    );
    setActiveSubTabs(newActiveSubTabs);
  }, [selectedTab, data]); // Dependency on selectedTab and data

  // Function to filter data based on selectedTab
  const filterDataBySelectedTab = (tab) => {
    return data.filter((item) => item.identifier.startsWith(tab));
  };

  const handleSubTabClick = (subSectionIndex, subTabName) => {
    const value = SUBTABS[transformColumnName(subTabName)];
    setActiveSubTabs((prevActiveSubTabs) =>
      prevActiveSubTabs.map((tab, index) =>
        index === subSectionIndex ? value : tab
      )
    );
  };

  const filteredData = filterDataBySelectedTab(selectedTab);

  const renderTableRows = (subSection) => {
    if (!subSection.data) return;
    return subSection.data.map((item) => {
      // Get the property names of the item
      const propertyNames = Object.keys(item);
      // Check if there are at least two properties
      const secondToLastProperty =
        propertyNames.length > 1
          ? propertyNames[propertyNames.length - 2]
          : null;

      // Ensure we have a valid second-to-last property
      const chartValue = secondToLastProperty ? item[secondToLastProperty] : 0;

      // Convert chartValue to a percentage and format it correctly
      const chartPercentage = parseFloat(chartValue);

      return (
        <tr key={item.Rank}>
          <td>
            <span className="bg_tag">{item.Rank}</span>
          </td>
          <td className="td_img">
            <span className="d-flex align-items-center">
            <img alt="Image" src={item.LogoUrl} className="logo_image" />
            <span>{currentLanguage === LANGUAGES.EN
              ? item.ShortNameEn
              : item.ShortNameAr}</span>
              </span>
          </td>
          <td>
            {/* TODO: need to fix how the percentage is computed here */}
            <div className="charts_table_bg">
              <span className="bg"></span>
              <span>
                <NumberFormatter value={chartPercentage} />
              </span>
            </div>
          </td>
        </tr>
      );
    });
  };

  const renderChart = (subSection) => {
    const formattedChartUrl = `${config.chartsUrl}/race-bar-chart?params=${
      subSection.chartData
    }&language=${LANGUAGEID[currentLanguage.toUpperCase()]}`;

    return (
      <embed
        className="race_chart"
        src={`${formattedChartUrl}`}
        //src="https://chartsqa.edanat.com/charts/race-bar-chart?params=RnJMOW5jclFzcmRPUUpDOWZxQkpJc0dxZ0FoM080VTZyUGUwb0cyWkVtUmJUT0dNZnVRUDZqOG5Zem8vektoL3pPS3BsbDdERVd5NzhUVlUzMWdUK3U1SE9iV3NxMjdEYnlkMkUzSkw1ZGV5UlQyaUJGSGo2MWZ5UHJseVRnOUc=&language=2"
      ></embed>
    );
  };

  return (
    <div className="px-layout col_space mt-4 pt-1">
      <Row>
        {filteredData.map((subSection, subSectionIndex) => {
          // Create sortedSubTabs within the map function for each subSection
          const sortedSubTabs = [...subSection.subTabs].sort(
            (a, b) => Number(a.displaySeq) - Number(b.displaySeq)
          );

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
                    {/* Tabs Starts */}
                    <ul className="tabs_nav tabs_inner navbar-nav align-items-center flex-row justify-content-end">
                      {sortedSubTabs.map((subTab, subTabIndex) => (
                        <li className="nav-item" key={subTabIndex}>
                          <button
                            className={`nav-link cursor-pointer ${
                              activeSubTabs[subSectionIndex] ===
                              SUBTABS[transformColumnName(subTab.tabNameEn)]
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handleSubTabClick(
                                subSectionIndex,
                                currentLanguage === LANGUAGES.EN
                                  ? subTab.tabNameEn
                                  : subTab.tabNameAr
                              )
                            }
                          >
                            <span>
                              {currentLanguage === LANGUAGES.EN
                                ? subTab.tabNameEn
                                : subTab.tabNameAr}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                    {/* Tabs Ends */}
                  </div>
                </div>
              </div>

              {/* Card Rendering */}
              <Card className="rounded border-0 table_chart">
                <Card.Body className="px-layout bg-white rounded">
                  {activeSubTabs[subSectionIndex] === 1 && (
                    <div className="chart-responsive">
                      {renderChart(subSection)}
                    </div>
                  )}
                  {activeSubTabs[subSectionIndex] !== 1 && (
                    <div className="table-responsive">
                      <Table className="table_layout" style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th>{strings.rank}</th>
                            <th>{strings.companies}</th>
                            <th>{strings.charts}</th>
                          </tr>
                        </thead>

                        <tbody>{renderTableRows(subSection)}</tbody>
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
          Rank: PropTypes.number.isRequired,
          ShortNameEn: PropTypes.string.isRequired,
          ShortNameAr: PropTypes.string.isRequired,
          LogoUrl: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default TopCompaniesTable;
