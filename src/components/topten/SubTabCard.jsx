import React, { useCallback, useMemo } from "react";
import { Card, Table } from "react-bootstrap";
import RaceChart from "../common/RaceChart";
import { strings, TABS } from "../../utils/constants/localizedStrings";
import { localized } from "../../utils/localization";
import NumberFormatter from "../common/NumberFormatter";
import { generateRankToBarWidth } from "../../utils/generateRankToBarWidth";

const SubTabCard = ({
  section,
  withHistoricalTab,
  isHistoricalTab,
  currentLanguage,
  isMultiple,
  loadingState,
  activeSubTab,
}) => {
  const selectedTab = Number(section.identifier.split("-")[0]);
  const processSubSection = useCallback(
    (data) => {
      if (
        !data ||
        (typeof data === "object" && Object.keys(data).length === 0)
      ) {
        return null; // Return null if subSection.data is null, undefined, or an empty object
      }

      //const rankToBarWidth = generateRankToBarWidth(10, 85, 5);
      const propertyNames = Object.keys(data[0] || {});

      const thirdToLastProperty = propertyNames[propertyNames.length - 3];
      const secondToLastProperty = propertyNames[propertyNames.length - 2];

      // Extract the values to base the rank-to-bar width on
      const values = data.map(
        (item) =>
          (typeof item[thirdToLastProperty] === "number"
            ? item[thirdToLastProperty]
            : item[secondToLastProperty]) || 0
      );

      // Generate rank to bar width based on the values
      const rankToBarWidth = generateRankToBarWidth(values, 75, 5, selectedTab);
      if (!data === null) return null;
      return data.map((item, index) => {
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
                {valueString !== null ? (
                  valueString
                ) : (
                  <NumberFormatter value={chartValue || 0} />
                )}
              </div>
            </td>
          </tr>
        );
      });
    },
    [currentLanguage]
  );

  const processSubSectionMultipleTabs = useCallback(
    (subSection) => {
      // Check if subSection is an array and is not empty
      if (!Array.isArray(subSection) || subSection.length === 0) {
        console.error("Invalid subSection data:", subSection);
        return null; // Return null if subSection is not an array or is empty
      }

      // Extract property names from the first item of subSection
      const propertyNames = Object.keys(subSection[0] || {});
      const thirdToLastProperty = propertyNames[propertyNames.length - 3];
      const secondToLastProperty = propertyNames[propertyNames.length - 2];

      // Handle cases where property names may be missing
      if (!thirdToLastProperty || !secondToLastProperty) {
        console.error("Property names are missing:", propertyNames);
        return null;
      }

      // Extract values to base the rank-to-bar width on
      const values = subSection.map((item) => {
        // Handle cases where properties might be undefined
        const thirdToLastValue =
          typeof item[thirdToLastProperty] === "number"
            ? item[thirdToLastProperty]
            : 0;
        const secondToLastValue =
          typeof item[secondToLastProperty] === "number"
            ? item[secondToLastProperty]
            : 0;
        return thirdToLastValue || secondToLastValue;
      });

      // Generate rank to bar width based on the values
      const rankToBarWidth = generateRankToBarWidth(values, 75, 5, selectedTab);

      // Map over subSection to create rows
      return subSection.map((item, index) => {
        const chartValue =
          typeof item[secondToLastProperty] === "number"
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
                <span
                  className="bg"
                  style={{
                    width: chartWidth,
                    //backgroundColor: chartValue < 0 ? "red" : "#9ac6e6", // Set background to red if chartValue is negative
                  }}
                ></span>
                {valueString !== null ? (
                  valueString
                ) : (
                  <NumberFormatter value={chartValue || 0} />
                )}
              </div>
            </td>
            {/* <td>
              <span>
                {valueString !== null ? (
                  valueString
                ) : (
                  <NumberFormatter value={chartValue || 0} />
                )}
              </span>
            </td> */}
          </tr>
        );
      });
    },
    [currentLanguage, activeSubTab]
  );

  const headers = useMemo(
    () => [
      { label: strings.rank },
      { label: strings.companies },
      { label: "" }, //TODO: made empty to remove the charts header, because when removed the alignment of the Companies is getting wrong...(need to fix on design)
    ],
    [currentLanguage]
  );

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

  const renderTableRows = useCallback(
    (tabData) => {
      if (!tabData) return null;
      return (
        <>
          {renderTableHeaders(headers)}
          <tbody>{processSubSection(tabData)}</tbody>
        </>
      );
    },
    [headers, processSubSection, renderTableHeaders]
  );

  const renderMultipleTableRows = useCallback(
    (tabData) => {
      if (!tabData || !Array.isArray(tabData)) {
        return null;
      }

      const isLoading = loadingState[section.identifier]; // Fetch loading state for this sub-section

      // Check if data is available for the active sub-tab
      let activeData = tabData[activeSubTab];
      // Show loading spinner or message if the data is being fetched
      if (isLoading && !activeData) {
        return (
          <tbody>
            <tr>
              <td>
                <div className="spinner"></div>
              </td>
            </tr>
          </tbody>
        );
      }

      if (!activeData) return null; // Return null until data is fetched or available

      return (
        <>
          {renderTableHeaders(headers)}
          <tbody>{processSubSectionMultipleTabs(activeData)}</tbody>
        </>
      );
    },
    [processSubSectionMultipleTabs, loadingState, activeSubTab]
  );

  const getRaceChartDirection = () => {
    return section.subTabs[1].direction;
  };

  return (
    <Card className="rounded border-0 table_chart">
      <Card.Body className="px-layout bg-white rounded">
        {withHistoricalTab && isHistoricalTab ? (
          <div className="chart-responsive">
            <RaceChart
              chartData={section.chartData}
              currentLanguage={currentLanguage}
              direction={getRaceChartDirection()}
            />
          </div>
        ) : (
          <div className="table-responsive">
            <Table className="table_layout" style={{ width: "100%" }}>
              {!isMultiple
                ? renderTableRows(section.data)
                : renderMultipleTableRows(section.data)}
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SubTabCard;
