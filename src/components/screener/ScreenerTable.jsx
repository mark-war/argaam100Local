import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Table, Pagination, Row, Col, Card } from "react-bootstrap";
import TableHeader from "./TableHeader";
import { useSelector } from "react-redux";

const ScreenerTable = ({
  data,
  columns,
  itemsPerPage,
  pinnedRow,
  selectedTab,
  selectedOptions, // selected sectors
  setSelectedOptions, // to control selected options
  decimals = 2, // Add a prop to configure decimal places
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const initialSortSet = useRef(false);
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );

  // Function to find the first dynamic column
  const getFirstDynamicColumn = () => {
    return columns.find((col) => !col.key.startsWith("fixed_"));
  };

  // Initialize sorting configuration for the first dynamic column when data is loaded or tab is changed
  useEffect(() => {
    const firstDynamicColumn = getFirstDynamicColumn();
    if (firstDynamicColumn) {
      setSortConfig({ key: firstDynamicColumn.key, direction: "asc" });
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
      if (value < 0) return 2; // Negatives (last group)
      if (value >= 100) return 1; // Positives >= 100 (second group)
      return 0; // Positives < 100 (first group)
    };

    // Define the fixed group order
    const groupOrder = [0, 1, 2]; // Fixed order: positives < 100, positives >= 100, negatives

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
      if (sortConfig.key.toLowerCase().includes("p/e")) {
        return customSort(filteredData, sortConfig.key, sortConfig.direction);
      } else {
        return [...filteredData].sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }
    }
    return filteredData;
  }, [filteredData, sortConfig]);

  // Calculate total pages
  const totalPages = Math.ceil(
    (filteredData.length + (pinnedRow ? 1 : 0)) / itemsPerPage
  );

  // Ensure currentPage is within bounds
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  // Get paginated rows
  const getPaginatedRows = () => {
    const indexOfLastRow =
      validCurrentPage * itemsPerPage - (pinnedRow ? 1 : 0);
    const indexOfFirstRow = indexOfLastRow - itemsPerPage + (pinnedRow ? 1 : 0);
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

  // Function to format values to the specified number of decimal places
  const formatValue = (value) => {
    if (typeof value === "number") {
      const formattedValue = value.toFixed(decimals);
      return value < 0
        ? `(${Math.abs(formattedValue).toFixed(decimals)})`
        : formattedValue;
    }
    return value;
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
                  {/* Render the pinned row if it exists */}
                  {pinnedRow && (
                    <tr>
                      {columns.map((column) => {
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
                                {formatValue(pinnedRow[column.key])}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )}
                  {currentRows.map((row, index) => (
                    <tr key={index}>
                      {columns.map((column) => {
                        // Check if the column is a fixed column
                        const isFixedColumn = column.key.startsWith("fixed_");
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
                                  href={`https://www.argaam.com/${currentLanguage}/tadawul/tasi/${
                                    row[column.key]
                                  }`} // to replace with link to Argaam company page using company id
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
                                {formatValue(row[column.key])}
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

        <div className="pagination px-layout justify-content-end">
          <Pagination>
            <Pagination.Prev
              disabled={validCurrentPage === 1}
              onClick={() => handlePageChange(validCurrentPage - 1)}
              className="custom-prev-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7.175"
                height="12.657"
                viewBox="0 0 7.175 12.657"
              >
                <g
                  id="Polygon_31"
                  data-name="Polygon 31"
                  transform="translate(0 12.657) rotate(-90)"
                  fill="#193168"
                >
                  {/* <path
                    d="M 11.54963779449463 6.675000190734863 L 1.107739448547363 6.675000190734863 L 6.328688621520996 0.7558746337890625 L 11.54963779449463 6.675000190734863 Z"
                    stroke="none"
                  />
                  <path
                    d="M 6.328688621520996 1.511727809906006 L 2.215461730957031 6.175000190734863 L 10.44191551208496 6.175000190734863 L 6.328688621520996 1.511727809906006 M 6.328688621520996 0 L 12.65737819671631 7.175000190734863 L -9.5367431640625e-07 7.175000190734863 L 6.328688621520996 0 Z"
                    stroke="none"
                    fill="#193168"
                  /> */}
                  <path d="M 11.55 6.68 L 1.11 6.68 L 6.33 0.76 L 11.55 6.68 Z" />
                  <path d="M 6.33 1.51 L 2.22 6.18 L 10.44 6.18 L 6.33 1.51 M 6.33 0 L 12.66 7.18 L 0 7.18 L 6.33 0 Z" />
                </g>
              </svg>
              <span className="mr-4">Previous</span>
            </Pagination.Prev>
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
              <Pagination.Item
                key={startPage + index}
                active={startPage + index === validCurrentPage}
                onClick={() => handlePageChange(startPage + index)}
              >
                {startPage + index}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              className="custom-next-btn"
            >
              <span>Next</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 7.175 12.657"
                height="12.657"
                width="7.175"
              >
                <g
                  xmlns="http://www.w3.org/2000/svg"
                  transform="matrix(-1 0 0 -1 7.175 12.657)"
                >
                  {/* <path
                    d="M 11.54963779449463 6.675000190734863 L 1.107739448547363 6.675000190734863 L 6.328688621520996 0.7558746337890625 L 11.54963779449463 6.675000190734863 Z"
                    fill="#193168"
                    stroke="none"
                  />
                  <path
                    d="M 6.328688621520996 1.511727809906006 L 2.215461730957031 6.175000190734863 L 10.44191551208496 6.175000190734863 L 6.328688621520996 1.511727809906006 M 6.328688621520996 0 L 12.65737819671631 7.175000190734863 L -9.5367431640625e-07 7.175000190734863 L 6.328688621520996"
                    fill="#193168"
                    stroke="none"
                  /> */}
                  <path d="M 11.55 6.68 L 1.11 6.68 L 6.33 0.76 L 11.55 6.68 Z" />
                  <path d="M 6.33 1.51 L 2.22 6.18 L 10.44 6.18 L 6.33 1.51 M 6.33 0 L 12.66 7.18 L 0 7.18 L 6.33 0 Z" />
                </g>
              </svg>
            </Pagination.Next>
          </Pagination>
        </div>
      </Col>
    </Row>
  );
};

ScreenerTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  pinnedRow: PropTypes.object, // Add this line to accept pinnedRow prop
  selectedTab: PropTypes.number.isRequired, // Add this line to accept selectedTab prop
  selectedOptions: PropTypes.array, // Define prop type for selectedOptions
  setSelectedOptions: PropTypes.func.isRequired, // Function to update selected options
  decimals: PropTypes.number, // Add PropTypes validation for the decimals prop
};

export default ScreenerTable;
