import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Table, Row, Col, Card } from "react-bootstrap";
import TableHeader from "./TableHeader";
import { useDispatch } from "react-redux";
import NumberFormatter from "../common/NumberFormatter";
import {
  TABS,
  LANGUAGES,
  strings,
} from "../../utils/constants/localizedStrings";
import ScreenerPagination from "./ScreenerPagination";
import { useNavigate, useParams } from "react-router-dom";
import { setLanguage } from "../../redux/features/languageSlice.js";
import config from "../../utils/config.js";

const ScreenerTable = ({
  data,
  columns,
  itemsPerPage,
  pinnedRow,
  selectedTab,
  selectedOptions, // selected sectors
  setSelectedOptions, // to control selected options
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const initialSortSet = useRef(false);
  // const currentLanguage = useSelector(selectCurrentLanguage);
  const { lang } = useParams(); // Access the current language from URL parameters

  useEffect(() => {
    if (config.supportedLanguages.includes(lang)) {
      if (!lang) {
        dispatch(setLanguage(lang));
      }
      strings.setLanguage(lang);
    } else {
      const defaultLanguage = config.defaultLanguage; // Fallback to default language
      dispatch(setLanguage(defaultLanguage));
      strings.setLanguage(defaultLanguage);
      navigate(`/${defaultLanguage}` + window.location.pathname.slice(3));
    }

    document.documentElement.lang = lang;
  }, [lang, dispatch, navigate]);

  // Function to find the first dynamic column
  const getFirstDynamicColumn = () => {
    // return columns.find(
    //   (col) =>
    //     typeof col.key === "string" &&
    //     !col.key.startsWith("fixed_") &&
    //     !col.hidden
    // );
    return columns.find(
      (col) =>
        typeof col.key === "number" && // Key is a number
        !col.hidden // Column is not hidden
    );
  };

  // Initialize sorting configuration for the first dynamic column when data is loaded or tab is changed
  useEffect(() => {
    const firstDynamicColumn = getFirstDynamicColumn();
    if (firstDynamicColumn) {
      if (selectedTab === TABS.S_PE)
        setSortConfig({ key: firstDynamicColumn.key, direction: "asc" });
      else setSortConfig({ key: firstDynamicColumn.key, direction: "desc" });
      initialSortSet.current = true;
    }
  }, [columns, selectedTab]);

  // Function to handle sector filter
  const handleSectorClick = (sector) => {
    setSelectedOptions(
      (prevOptions) =>
        prevOptions.includes(sector)
          ? prevOptions.filter((option) => option !== sector) // Remove if already selected
          : [...prevOptions, sector] // Add if not selected
    );
  };

  const filteredData = data.filter((row) => {
    // If no sector is selected, return all rows
    if (selectedOptions.length === 0) return true;

    // Check if the row's sector is in the list of selected sectors
    return selectedOptions.includes(row.fixed_sector);
  });

  // Reset pagination when selectedTab changes
  useEffect(() => {
    setCurrentPage(1);
    //setSortConfig({ key: null, direction: "asc" });
  }, [selectedTab, selectedOptions]);

  // Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Custom sorting function
  const customSort = (data, key, direction) => {
    // Define the group for each value
    const getGroup = (value) => {
      if (value === "-" || value === undefined || value === null) return 3; // Dash values (last group)
      if (value < 0) return 2; // Negatives (last group)
      if (value >= 100) return 1; // Positives >= 100 (second group)
      return 0; // Positives < 100 (first group)
    };

    // Define the fixed group order
    const groupOrder = [0, 1, 2, 3]; // Fixed order: positives < 100, positives >= 100, negatives

    // Separate data into groups
    const groups = groupOrder.reduce((acc, group) => {
      acc[group] = [];
      return acc;
    }, {});

    data.forEach((item) => {
      const group = getGroup(item[key]);
      groups[group].push(item);
    });

    // Sort each group based on the direction
    Object.keys(groups).forEach((group) => {
      groups[group].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        // Treat dash values as equal within their group
        if (aValue === "-" || bValue === "-") return 0;

        return direction === "asc" ? aValue - bValue : bValue - aValue;
      });
    });

    // Combine the groups into a single array
    return groupOrder.flatMap((group) => groups[group]);
  };

  const handleSort = (columnKey) => {
    const direction =
      sortConfig.key === columnKey
        ? sortConfig.direction === "asc"
          ? "desc"
          : "asc"
        : "asc";

    setSortConfig({ key: columnKey, direction });
  };

  const sortedData = React.useMemo(() => {
    if (sortConfig.key) {
      if (config.peFieldIds.has(sortConfig.key)) {
        return customSort(filteredData, sortConfig.key, sortConfig.direction);
      } else {
        return [...filteredData].sort((a, b) => {
          const aValue = a[sortConfig.key] === "-" ? null : a[sortConfig.key];
          const bValue = b[sortConfig.key] === "-" ? null : b[sortConfig.key];

          if (aValue === null) return 1; // Place dash at the bottom
          if (bValue === null) return -1; // Place dash at the bottom

          if (aValue < bValue) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
    }
    return filteredData;
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  // Get paginated rows
  const getPaginatedRows = () => {
    const indexOfLastRow = validCurrentPage * itemsPerPage;
    const indexOfFirstRow = indexOfLastRow - itemsPerPage;
    return sortedData.slice(indexOfFirstRow, indexOfLastRow);
  };

  const currentRows = getPaginatedRows();

  // Pagination Range
  const paginationRange = 8; // Number of page numbers to show
  const startPage = Math.max(
    1,
    validCurrentPage - Math.floor(paginationRange / 2)
  );
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  const argaamUrl = (companyID = "") => {
    const baseUrl =
      lang === LANGUAGES.AR
        ? `https://www.argaam.com/ar/company/companyoverview/marketid/3/companyid/${companyID}/`
        : `https://www.argaam.com/en/tadawul/tasi/`;

    return baseUrl;
  };

  return (
    <Row>
      <Col lg={12} className="mx-auto">
        <Card className="rounded border-0">
          <Card.Body className="px-layout bg-white rounded">
            <div className="table-responsive">
              <Table
                className="table_layout table_full"
                striped
                style={{ width: "100%" }}
              >
                <TableHeader
                  columns={columns}
                  onSort={handleSort}
                  sortConfig={sortConfig}
                />
                <tbody>
                  {/* HIDE THE PINNER ROW FOR NOW */}
                  {/* {pinnedRow && (
                    <tr>
                      {columns.map((column) => {
                        if (column.hidden) return null; // Skip rendering this column
                        const isFixedColumn = column.key.startsWith("fixed_");
                        const tdClassName = isFixedColumn
                          ? column.key === "fixed_company"
                            ? "td_img"
                            : column.className // Apply td_img for fixed_company
                          : `text-center ${column.className}`;
                        return (
                          <td key={column.key} className={tdClassName}>
                            {isFixedColumn ? (
                              column.key === "fixed_company" ? (
                                // Handle fixed company column with image and company name
                                <>
                                  <img
                                    alt="Company Logo"
                                    src={pinnedRow.fixed_img} // Get the src from fixed_img
                                    className="logo_image"
                                  />
                                  <span>{pinnedRow[column.key]}</span>
                                </>
                              ) : column.key === "fixed_sector" ? (
                                // Handle fixed sector column without additional styling
                                pinnedRow[column.key]
                              ) : null
                            ) : (
                              // Handle dynamic columns
                              <span
                                style={{
                                  color:
                                    pinnedRow[column.key] < 0
                                      ? "red"
                                      : "inherit",
                                }}
                              >
                                <NumberFormatter
                                  value={pinnedRow[column.key]}
                                  isPEColumn={column.key
                                    .includes(strings.pe)}
                                />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )} */}
                  {currentRows.map((row, index) => (
                    <tr key={index}>
                      {columns.map((column) => {
                        if (column.hidden) return null; // Skip rendering this column
                        // Check if the column is a fixed column
                        const isFixedColumn =
                          typeof column.key === "string" &&
                          column.key.startsWith("fixed_");
                        // Determine class for the <td> element
                        const tdClassName = isFixedColumn
                          ? column.key === "fixed_company"
                            ? "td_img"
                            : column.className // Apply td_img for fixed_company
                          : `text-center ${column.className}`;

                        return (
                          <td key={column.key} className={tdClassName}>
                            {isFixedColumn ? (
                              column.key === "fixed_company" ? (
                                // Handle fixed company column with image and company name
                                <a
                                  target="_blank" // This will open the link in a new tab
                                  rel="noreferrer"
                                  href={`${argaamUrl(row.CompanyID)}${
                                    row[column.key]
                                  }`}
                                  className="company-link"
                                >
                                  <img
                                    alt=""
                                    src={row.fixed_img} // Get the src from fixed_img
                                    className="logo_image"
                                  />
                                  <span>{row[column.key]}</span>
                                </a>
                              ) : column.key === "fixed_code" ? (
                                // Handle fixed code column with span
                                <span className="bg_tag">
                                  {row[column.key]}
                                </span>
                              ) : column.key === "fixed_sector" ? (
                                // Handle fixed sector column without additional styling
                                <a
                                  href="#"
                                  onClick={() =>
                                    handleSectorClick(row[column.key])
                                  }
                                  className="sector-link"
                                >
                                  {row[column.key]}
                                </a>
                              ) : null
                            ) : (
                              // Handle dynamic columns
                              <span
                                style={{
                                  color:
                                    row[column.key] < 0 ? "red" : "inherit",
                                }}
                              >
                                <NumberFormatter
                                  value={row[column.key]}
                                  isPEColumn={config.peFieldIds.has(column.key)}
                                />
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        <ScreenerPagination
          validCurrentPage={validCurrentPage}
          handlePageChange={handlePageChange}
          startPage={startPage}
          endPage={endPage}
          totalPages={totalPages}
        />
      </Col>
    </Row>
  );
};

ScreenerTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  pinnedRow: PropTypes.object, // Add this line to accept pinnedRow prop
  selectedTab: PropTypes.number.isRequired, // Add this line to accept selectedTab prop
  selectedOptions: PropTypes.array, // Define prop type for selectedOptions
  setSelectedOptions: PropTypes.func.isRequired, // Function to update selected options
};

export default ScreenerTable;
