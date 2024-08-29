import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Row, Col, Card, Table } from "react-bootstrap";
import {
  strings,
  SUBSECTIONS,
  SUBTABS,
  TABS,
} from "../../utils/constants/localizedStrings";
import { useSelector } from "react-redux";
import NumberFormatter from "../common/NumberFormatter";
import RaceChart from "../common/RaceChart";
import { localized } from "../../utils/localization";
import { generateRankToBarWidth } from "../../utils/generateRankToBarWidth";
import { selectCurrentLanguage } from "../../redux/selectors";

const TopCompaniesTable = ({ selectedTab, data }) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const isInitialMount = useRef(true); // Track the initial render

  const transformColumnName = useCallback((fieldName) => {
    return fieldName
      .split(" ")
      .map((word) => word.toUpperCase())
      .join("_");
  }, []);

  const getSubTabKey = useCallback(
    (subTabName) => {
      const transformedName = transformColumnName(subTabName);

      switch (selectedTab) {
        case TABS.T_STOCK_PERFORMANCE:
          return `SP_${transformedName}`;
        case TABS.T_GROWTH_AND_DIVIDENDS:
          return `GD_${transformedName}`;
        default:
          return transformedName;
      }
    },
    [selectedTab, transformColumnName]
  );

  const initializeActiveSubTabs = useCallback(
    (data) => {
      return data.map((section) => {
        const selectedSubTab = section.subTabs.find(
          (subTab) => subTab.isSelected === "1"
        );
        const subTabKey = getSubTabKey(selectedSubTab?.tabNameEn || "");
        return SUBTABS[subTabKey] || 1;
      });
    },
    [getSubTabKey]
  );

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
  }, [selectedTab, data, initializeActiveSubTabs]);

  const filterDataBySelectedTab = useCallback(
    (tab) => {
      return data.filter((item) => item.identifier.startsWith(tab));
    },
    [data]
  );

  const handleSubTabClick = useCallback(
    (subSectionIndex, subTabName) => {
      const subTabKey = getSubTabKey(subTabName);
      const value = SUBTABS[subTabKey];
      setActiveSubTabs((prevActiveSubTabs) =>
        prevActiveSubTabs.map((tab, index) =>
          index === subSectionIndex ? value : tab
        )
      );
    },
    [getSubTabKey]
  );

  const filteredData = useMemo(
    () => filterDataBySelectedTab(selectedTab),
    [selectedTab, filterDataBySelectedTab]
  );

  const headers = useMemo(
    () => [
      { label: strings.rank },
      { label: strings.companies },
      { label: strings.charts },
    ],
    [currentLanguage]
  );

  // Helper function to render table headers
  const renderTableHeaders = useCallback(
    (columns) => (
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.label}</th>
          ))}
        </tr>
      </thead>
    ),
    []
  );

  const withPercentageLabels = [
    SUBSECTIONS.THE_HIGHEST,
    SUBSECTIONS.THE_LOWEST,
    SUBSECTIONS.RET_SH,
    SUBSECTIONS.IND_OVER_SH,
    SUBSECTIONS.NET_PROF_MARGIN,
    SUBSECTIONS.TOT_PROF_MARGIN,
    SUBSECTIONS.HIGHEST_RET,
  ];

  const processSubSection = useCallback(
    (subSection) => {
      if (
        !subSection.data ||
        (typeof subSection.data === "object" &&
          Object.keys(subSection.data).length === 0)
      ) {
        return null; // Return null if subSection.data is null, undefined, or an empty object
      }

      //const rankToBarWidth = generateRankToBarWidth(10, 85, 5);
      const propertyNames = Object.keys(subSection.data[0] || {});
      const thirdToLastProperty = propertyNames[propertyNames.length - 3];
      const secondToLastProperty = propertyNames[propertyNames.length - 2];

      // Extract the values to base the rank-to-bar width on
      const values = subSection.data.map(
        (item) =>
          (typeof item[thirdToLastProperty] === "number"
            ? item[thirdToLastProperty]
            : item[secondToLastProperty]) || 0
      );

      // Generate rank to bar width based on the values
      const rankToBarWidth = generateRankToBarWidth(values, 85, 5);
      if (!subSection.data === null) return null;
      return subSection.data.map((item, index) => {
        const chartValue = secondToLastProperty
          ? item[secondToLastProperty]
          : 0;
        const rank = item.Rank ?? item.rankno ?? null;
        const chartWidth = rankToBarWidth[rank] || "0%";

        const valueString =
          item[thirdToLastProperty] !== null &&
          item[secondToLastProperty] !== null &&
          typeof item[thirdToLastProperty] === "number" &&
          typeof item[secondToLastProperty] === "number"
            ? `${item[thirdToLastProperty]}/${item[secondToLastProperty]}`
            : null;

        return (
          <tr key={index}>
            <td>
              <span className="bg_tag">{rank}</span>
            </td>
            <td className="td_img">
              <span className="d-flex align-items-center">
                <img alt="Image" src={item.LogoUrl} className="logo_image" />
                <span>{localized(item, "ShortName", currentLanguage)}</span>
              </span>
            </td>
            <td>
              <div className="charts_table_bg">
                <span className="bg" style={{ width: chartWidth }}></span>
                <span>
                  {valueString !== null ? (
                    valueString
                  ) : (
                    <NumberFormatter value={chartValue || 0} />
                  )}
                </span>
              </div>
            </td>
          </tr>
        );
      });
    },
    [currentLanguage]
  );

  const renderTableRows = useCallback(
    (subSection) => {
      if (!subSection.data) return null;
      return (
        <>
          {renderTableHeaders(headers)}
          <tbody>{processSubSection(subSection)}</tbody>
        </>
      );
    },
    [headers, processSubSection, renderTableHeaders]
  );

  const renderMultipleTableRows = useCallback(
    (subSection, subSectionIndex) => {
      if (!subSection.data) return null;
      console.log("SS: ", subSection);
      const activeSubTabIndex = subSection.subTabs.findIndex(
        (subTab) =>
          SUBTABS[
            getSubTabKey(localized(subTab, "tabName", currentLanguage))
          ] === activeSubTabs[subSectionIndex]
      );

      const activeData = subSection.data[activeSubTabIndex];
      if (!activeData) return null;

      return (
        <>
          {renderTableHeaders(headers)}
          <tbody>{processSubSection(activeData)}</tbody>
        </>
      );
    },
    [
      activeSubTabs,
      currentLanguage,
      getSubTabKey,
      headers,
      processSubSection,
      renderTableHeaders,
    ]
  );

  return (
    <div className="px-layout col_space mt-4 pt-1">
      <Row>
        {filteredData.map((subSection, subSectionIndex) => {
          const sortedSubTabs = [...subSection.subTabs].sort(
            (a, b) => Number(a.displaySeq) - Number(b.displaySeq)
          );
          const subTabCount = sortedSubTabs.length;
          const sectionIndex = subSection.identifier.split("-")[1];

          return (
            <Col lg={6} key={subSectionIndex}>
              <div className="tabs_inner_nav row px-3">
                <div className="col-6">
                  <p className="sub_heading">
                    {localized(subSection, "fieldName", currentLanguage)}{" "}
                    <span>
                      {withPercentageLabels.includes(Number(sectionIndex))
                        ? "%"
                        : ""}
                    </span>
                  </p>
                </div>
                <div className="col-6">
                  <div className="flex-fill justify-content-end">
                    <ul className="tabs_nav tabs_inner navbar-nav align-items-center flex-row justify-content-end">
                      {sortedSubTabs.map((subTab, subTabIndex) => {
                        const subTabKey = getSubTabKey(
                          localized(subTab, "tabName", currentLanguage),
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
                                )
                              }
                            >
                              {localized(subTab, "tabName", currentLanguage)}
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

TopCompaniesTable.propTypes = {
  selectedTab: PropTypes.number.isRequired, // Specify that selectedTab is a required string
  data: PropTypes.arrayOf(PropTypes.object).isRequired, // Specify that data is a required array of objects
};

export default TopCompaniesTable;
