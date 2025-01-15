import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Card, Table } from "react-bootstrap";
import RaceChart from "../common/RaceChart";
import { SECTORS, strings, TABS } from "../../utils/constants/localizedStrings";
import { localized } from "../../utils/localization";
import NumberFormatter from "../common/NumberFormatter";
import { generateRankToBarWidth } from "../../utils/generateRankToBarWidth";
import useArgaamUrl from "../../hooks/useArgaamUrl";
import RowChart from "./RowChart";
import { isEmpty } from "../../utils/helperFunctions";
import Tooltip from "../common/Tooltip";

const SubTabCard = ({
  section,
  withHistoricalTab,
  isHistoricalTab,
  currentLanguage,
  isMultiple,
  loadingState,
  activeSubTab,
  selectedCompanyID,
}) => {
  console.log("selectedCompanyID ", selectedCompanyID);
  const selectedTab = Number(section.identifier.split("-")[0]);
  const activeSection = Number(section.identifier.split("-")[1]);
  const tableConfig = section.TableConfig
    ? JSON.parse(section.TableConfig)
    : [];
  const argaamUrl = useArgaamUrl();
  const [includeAramco, setincludeAramco] = useState(
    section?.Aramcologic || true
  );
  const [activeChart, setactiveChart] = useState(null);

  const renderCompanyColumn = (item) => {
    const isInsuranceSector = item.ArgaamSectorID === SECTORS.INSURANCE;
    const url = isInsuranceSector
      ? `${argaamUrl(null, item.CompanyID, item.ShortNameEn)}`
      : `${argaamUrl(item.Code.split(".")[0])}`;

    return (
      <a target="_blank" rel="noreferrer" href={url} className="company-link">
        <span>{localized(item, "ShortName", currentLanguage)}</span>
      </a>
    );
  };
  const tableRef = useRef(null);
  const highlightRef = useRef(null);
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
      const rankToBarWidth = generateRankToBarWidth(values, selectedTab);

      // Determine the max value from the second to last property
      const maxValue = Math.max(
        ...data.map((item) => item[secondToLastProperty] || 0)
      );

      // Function to check if there is a significant drop in rank
      const hasSignificantDrop = (prev, curr) => {
        if (curr !== 0) {
          const percentageChange = (prev / curr) * 100;
          return percentageChange > 800; // More than 200% drop
        }
        return false;
      };

      // Store the ellipsis visibility for each item
      const ellipsisVisibility = new Array(data.length).fill(false);

      // Compute ellipsis visibility
      for (let i = 1; i < data.length; i++) {
        const prevItem = data[i - 1];
        const currItem = data[i];
        if (
          hasSignificantDrop(
            prevItem[secondToLastProperty],
            currItem[secondToLastProperty]
          )
        ) {
          ellipsisVisibility[i - 1] = true; // Show ellipsis on the previous rank
        }
      }

      if (!data === null) return null;
      const hasNotes = data.some((item) => item.NotesEn || item.NotesAr);

      useLayoutEffect(() => {
        // Ensure the effect runs after the DOM is updated
        const timer = setTimeout(() => {
          const table = tableRef.current?.closest(".table-responsive"); // Find the parent table
          const highlightedRow = table?.querySelector(
            `tr.highlightRow` // Look for rows with the 'highlightRow' class
          );

          if (highlightedRow) {
            highlightedRow.scrollIntoView({
              behavior: "auto",
              block: "start",
              inline: "nearest", // Keep the scroll position horizontal if possible
            });
          }

          console.log("highlightedRow: ", highlightedRow);
        }, 0); // Using setTimeout ensures the DOM is updated before executing the logic

        return () => clearTimeout(timer); // Cleanup on component unmount or dependency change
      }, [selectedCompanyID, section]); // This hook will be triggered whenever selectedCompanyID changes

      useEffect(() => {
        // Only scroll if there is a selected company ID
        if (selectedCompanyID && highlightRef.current) {
          const tableContainer = tableRef.current;

          if (tableContainer) {
            const highlightedRow = highlightRef.current;

            // Use scrollIntoView but prevent page scrolling
            highlightedRow.scrollIntoView({
              behavior: "auto",
              block: "start",
              inline: "nearest",
            });

            // After scrollIntoView, manually adjust the scrollTop of the table container to ensure no page scroll
            tableContainer.scrollTop =
              highlightedRow.offsetTop - tableContainer.offsetTop;
          }
        }
      }, [selectedCompanyID]); // Runs when selectedCompanyID changes

      return data.map((item, index) => {
        const isHighlighted = item.CompanyID === selectedCompanyID;
        const chartValue = secondToLastProperty
          ? item[secondToLastProperty]
          : "";

        const rank =
          (!includeAramco ? item.Rank - 1 : item.Rank) ?? item.rankno ?? null;
        const chartWidth = rankToBarWidth[rank] || "";

        // Determine row width based on the max value
        const getRowWidth = (maxValue) => {
          if (maxValue > 1_000_000) {
            // Check if selectedTab is T_RANKING specifically for this case
            if (selectedTab === TABS.T_RANKING) {
              return "88%"; // Special case for T_RANKING tab with more than 1 million
            }
            return "82%"; // More than 1 million (other cases)
          }
          if (maxValue > 100000) return "85%"; // More than 100
          if (maxValue > 1000) return "89%"; // More than 100
          return "90%"; // Default case
        };
        const rowWidth = getRowWidth(maxValue);

        const valueString =
          item[thirdToLastProperty] !== null &&
          item[secondToLastProperty] !== null &&
          typeof item[thirdToLastProperty] === "number" &&
          typeof item[secondToLastProperty] === "number"
            ? `${item[thirdToLastProperty]}/${item[secondToLastProperty]}`
            : null;

        // Show ellipsis if the next rank exists and there's a significant drop
        const showEllipsis =
          index < data.length - 1 && // Ensure not the last item
          hasSignificantDrop(
            item[secondToLastProperty],
            data[index + 1][secondToLastProperty]
          );

        const adjustedChartWidth = showEllipsis
          ? `${Math.max(0, parseFloat(chartWidth) - 5)}%`
          : chartWidth;

        const note = item?.[currentLanguage == "en" ? "NotesEn" : "NotesAr"];
        const unit = JSON.parse(section?.chartConfig)?.unit;

        return (
          <React.Fragment key={index}>
            <tr
              className={`${
                item.CompanyID === activeChart ? "activeRow" : ""
              } ${isHighlighted ? "highlightRow" : ""}`}
              ref={isHighlighted ? tableRef : null} // Assign ref only to the highlighted row
            >
              <td>
                <span className="bg_tag">{rank}</span>
              </td>
              <td className="td_img">
                <span className="d-flex align-items-center">
                  {renderCompanyColumn(item)}
                </span>
              </td>
              <td>
                <div className={"charts_table_bg"} style={{ width: rowWidth }}>
                  <span
                    className="bg"
                    style={{ width: adjustedChartWidth }}
                  ></span>
                  {showEllipsis && (
                    <>
                      <div className="ellipsis">......</div>
                      <div className="ellipsis">......</div>
                    </>
                  )}
                  {valueString !== null ? (
                    valueString
                  ) : (
                    <NumberFormatter
                      value={chartValue || ""}
                      selectedTab={selectedTab}
                      activeSection={activeSection}
                      unit={currentLanguage == "en" ? unit?.en : unit?.ar}
                      // showPercentage={showPercentage}
                    />
                  )}{" "}
                  {/* note */}
                </div>
              </td>

              {tableConfig.length
                ? tableConfig.map((config, index) => (
                    <td key={index}>
                      {config.type === "numeric" ? (
                        // Handle numeric type
                        <span onClick={() => console.log(dataFields)}>
                          {parseFloat(dataFields[config.key]).toFixed(2) || ""}
                        </span>
                      ) : config.type === "bool" ? (
                        // Handle boolean type
                        <span
                          className={
                            dataFields[config.key] === 1
                              ? "up-arrow-green"
                              : "down-arrow-red"
                          }
                        ></span>
                      ) : null}
                    </td>
                  ))
                : null}

              {hasNotes && (
                <td className={"textcomIcon"}>
                  <>
                    {!isEmpty(note) ? (
                      <Tooltip
                        tooltipText={note}
                        tooltipCustomPlacement={"top-end"}
                      >
                        <i className={"textComment_icon"}></i>
                      </Tooltip>
                    ) : null}
                  </>
                </td>
              )}
              {section.chartConfig ? (
                <td
                  onClick={() =>
                    item.CompanyID == activeChart
                      ? setactiveChart(null)
                      : setactiveChart(item.CompanyID)
                  }
                  className={
                    item.CompanyID == activeChart
                      ? "active_chart charts"
                      : "charts"
                  }
                ></td>
              ) : null}
            </tr>
            {item.CompanyID === activeChart && (
              <RowChart
                config={section.chartConfig}
                templateID={item?.FSTemplateID}
                CompanyID={item?.CompanyID}
              />
            )}
          </React.Fragment>
        );
      });
    },
    [currentLanguage, includeAramco, activeChart, selectedCompanyID, tableRef]
  );

  const processSubSectionMultipleTabs = useCallback(
    (subSection) => {
      // Check if subSection is an array and is not empty
      if (!subSection[activeSubTab]) {
        console.error("Invalid subSection data:", subSection);
        return null; // Return null if subSection is not an array or is empty
      }

      // Extract property names from the first item of subSection
      const propertyNames = Object.keys(subSection[activeSubTab] || {});
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
            : "";
        const secondToLastValue =
          typeof item[secondToLastProperty] === "number"
            ? item[secondToLastProperty]
            : "";
        return thirdToLastValue || secondToLastValue;
      });

      // Generate rank to bar width based on the values
      const rankToBarWidth = generateRankToBarWidth(values, selectedTab);

      // Determine the max value from the second to last property
      const maxValue = Math.max(
        ...subSection.map((item) => item[secondToLastProperty] || 0)
      );

      const hasNotes = subSection.some((item) => item.NotesEn || item.NotesAr);

      // Map over subSection to create rows
      return subSection.map((item, index) => {
        const chartValue =
          typeof item[secondToLastProperty] === "number"
            ? item[secondToLastProperty]
            : "";
        const rank = item.Rank ?? item.rankno ?? null;
        const chartWidth = rankToBarWidth[rank] || "";

        const barColor =
          activeSection === 34 ? "green" : activeSection === 35 ? "red" : "";
        // Determine row width based on the max value
        const getRowWidth = (maxValue) => {
          if (maxValue > 10_000_000) {
            if (activeSection === 32 || activeSection === 33) return "82%";
            return "80%";
          }
          if (maxValue > 1_000_000) {
            // Check if selectedTab is T_RANKING specifically for this case
            if (selectedTab === TABS.T_RANKING) {
              return "90%"; // Special case for T_RANKING tab with more than 1 million
            }
            return "82%"; // More than 1 million (other cases)
          }
          if (maxValue > 100000) return "85%"; // More than 100
          if (maxValue > 1000) return "88%"; // More than 100
          return "90%"; // Default case
        };
        const rowWidth = getRowWidth(maxValue);

        const valueString =
          item[thirdToLastProperty] !== null &&
          item[secondToLastProperty] !== null &&
          typeof item[thirdToLastProperty] === "number" &&
          typeof item[secondToLastProperty] === "number"
            ? `${item[thirdToLastProperty]}/${item[secondToLastProperty]}`
            : null;

        const note = item?.[currentLanguage == "en" ? "NotesEn" : "NotesAr"];
        const unit = JSON.parse(section?.chartConfig)?.unit;

        const dataFields = item?.DataFields ? JSON.parse(item?.DataFields) : {};

        return (
          <React.Fragment key={index}>
            <tr
              className={`${
                item.CompanyID === activeChart ? "activeRow" : ""
              } ${item.CompanyID === selectedCompanyID ? "highlightRow" : ""}`}
            >
              <td>
                <span className="bg_tag">{rank}</span>
              </td>
              <td className="td_img">
                <span className="d-flex align-items-center">
                  {renderCompanyColumn(item)}
                </span>
              </td>
              <td>
                <div className="charts_table_bg" style={{ width: rowWidth }}>
                  <span
                    className={`bg ${barColor}`}
                    style={{
                      width: chartWidth,
                      //backgroundColor: chartValue < 0 ? "red" : "#9ac6e6", // Set background to red if chartValue is negative
                    }}
                  ></span>
                  {valueString !== null ? (
                    valueString
                  ) : (
                    <NumberFormatter
                      value={chartValue || ""}
                      selectedTab={selectedTab}
                      activeSection={activeSection}
                      unit={currentLanguage == "en" ? unit?.en : unit?.ar}
                      // showPercentage={showPercentage}
                    />
                  )}
                  {/* note */}
                </div>
              </td>
              {tableConfig.length
                ? tableConfig.map((config, index) => (
                    <td key={index}>
                      {config.type === "numeric" ? (
                        // Handle numeric type
                        <span onClick={() => console.log(dataFields)}>
                          {config.key === "CAGR"
                            ? dataFields[config.key] == null
                              ? "NED*"
                              : item.LatestEPSBeforeXOItems < 0 ||
                                item.OldEPSBeforeXOItems < 0
                              ? "NM"
                              : `${parseFloat(dataFields[config.key]).toFixed(
                                  1
                                )}%`
                            : parseFloat(dataFields[config.key]).toFixed(2) ||
                              ""}
                        </span>
                      ) : config.type === "bool" ? (
                        // Handle boolean type
                        <span
                          className={
                            dataFields[config.key] === 1
                              ? "up-arrow-green"
                              : "down-arrow-red"
                          }
                        ></span>
                      ) : null}
                    </td>
                  ))
                : null}

              {hasNotes && (
                <td className="textcomIcon">
                  <>
                    {!isEmpty(note) ? (
                      <Tooltip
                        tooltipText={note}
                        tooltipCustomPlacement={"top-end"}
                      >
                        <i className={"textComment_icon"}></i>
                      </Tooltip>
                    ) : null}
                  </>
                </td>
              )}

              {section.chartConfig ? (
                <td
                  onClick={() =>
                    item.CompanyID == activeChart
                      ? setactiveChart(null)
                      : setactiveChart(item.CompanyID)
                  }
                  className={
                    item.CompanyID == activeChart
                      ? "active_chart charts"
                      : "charts"
                  }
                ></td>
              ) : null}
            </tr>
            {item.CompanyID === activeChart && (
              <RowChart
                config={section.chartConfig}
                templateID={item?.FSTemplateID}
                CompanyID={item?.CompanyID}
              />
            )}
          </React.Fragment>
        );
      });
    },
    [
      currentLanguage,
      activeSubTab,
      includeAramco,
      activeChart,
      selectedCompanyID,
    ]
  );

  const headers = useMemo(
    () => [
      { label: strings.rank },
      { label: strings.companies },
      { label: "" }, //TODO: made empty to remove the charts header, because when removed the alignment of the Companies is getting wrong...(need to fix on design)
      ...tableConfig?.map((header) => ({
        label: currentLanguage == "en" ? header.en : header.ar,
      })),
    ],
    [currentLanguage, tableConfig]
  );

  const renderTableHeaders = useCallback(
    (columns) => (
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column.label}</th>
          ))}
          {section?.Aramcologic && (
            <th style={{ display: "flex", alignItems: "center" }}>
              <span style={{ width: "max-content" }}>
                {strings.includeAramco}
              </span>
              <input
                type="checkbox"
                value={includeAramco}
                onChange={(e) => setincludeAramco(e.target.checked)}
                checked={includeAramco}
                className={includeAramco ? "include_aramco" : ""}
                style={{ margin: "0 10px" }}
              />
            </th>
          )}
          {/* added empty th to make the header and data balanced */}
          {tableConfig.length > 0 && section.chartConfig ? <th></th> : ""}
        </tr>
      </thead>
    ),
    [includeAramco]
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

  const filteredData = useMemo(() => {
    if (!includeAramco) {
      return section.data.filter((item) => item.CompanyID !== 3509);
    }
    return section.data;
  }, [includeAramco, section.data]);

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
            <Table
              className={`table_layout last__close__table custom_scroll ${
                tableConfig.length > 0 ? "table-fields" : ""
              }`}
              style={{ width: "100%" }}
            >
              {!isMultiple
                ? renderTableRows(filteredData)
                : renderMultipleTableRows(filteredData)}
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SubTabCard;
