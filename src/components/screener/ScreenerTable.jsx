import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { Table, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ScreenerPagination from "./ScreenerPagination";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow.jsx";
import { strings, TABS } from "../../utils/constants/localizedStrings";
import config from "../../utils/config.js";
import PinnedRow from "./PinnedRow.jsx";
import SummaryRow from "./SummaryRow.jsx";
import useLanguage from "../../hooks/useLanguage.jsx";
import {
  getFirstDynamicColumn,
  computeTotalOrAverage,
  customSort,
} from "../../utils/screenerTableHelpers.js";

const ScreenerTable = ({
  data,
  columns,
  pinnedRow,
  selectedTab,
  selectedOptions, // selected sectors
  setSelectedOptions, // to control selected options
}) => {
  const { lang } = useParams(); // Access the current language from URL parameters

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const initialSortSet = useRef(false);
  const itemsPerPage = config.screenerTableItemPerPage;

  // Set up language on component mount and language change
  useLanguage(lang);

  // Initialize sorting configuration for the first dynamic column
  useEffect(() => {
    const firstDynamicColumn = getFirstDynamicColumn(columns);
    if (firstDynamicColumn) {
      if (selectedTab === TABS.S_PE)
        setSortConfig({ key: firstDynamicColumn.key, direction: "asc" });
      else setSortConfig({ key: firstDynamicColumn.key, direction: "desc" });
      initialSortSet.current = true;
    }
  }, [columns, selectedTab]);

  // Handle sector filter click
  const handleSectorClick = (sector) => setSelectedOptions([sector]);

  // Filter data based on selected options (sectors)
  const filteredData = useMemo(() => {
    if (!selectedOptions.length) return data;
    return data.filter((row) => selectedOptions.includes(row.SectorID));
  }, [data, selectedOptions]);

  // Reset pagination when selectedTab or selectedOptions changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, selectedOptions]);

  // Handle page change
  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  // Handle sort action
  const handleSort = useCallback(
    (columnKey) => {
      const direction =
        sortConfig.key === columnKey && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      setSortConfig({ key: columnKey, direction });
    },
    [sortConfig]
  );

  const getSortedData = (data, sortConfig) => {
    if (sortConfig.key) {
      if (config.peFieldIds.has(sortConfig.key)) {
        return customSort(data, sortConfig.key, sortConfig.direction);
      }
      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.key] === "-" ? null : a[sortConfig.key];
        const bValue = b[sortConfig.key] === "-" ? null : b[sortConfig.key];

        if (aValue === null) return 1; // Place dash at the bottom
        if (bValue === null) return -1; // Place dash at the bottom

        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      });
    }
    return data;
  };

  const sortedData = useMemo(
    () => getSortedData(filteredData, sortConfig),
    [filteredData, sortConfig]
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const validCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  // Get paginated rows
  const currentRows = useMemo(() => {
    const indexOfLastRow = validCurrentPage * itemsPerPage;
    const indexOfFirstRow = indexOfLastRow - itemsPerPage;
    return sortedData.slice(indexOfFirstRow, indexOfLastRow);
  }, [sortedData, validCurrentPage, itemsPerPage]);

  // Pagination range calculation
  const paginationRange = 8; // Number of page numbers to show
  const startPage = Math.max(
    1,
    validCurrentPage - Math.floor(paginationRange / 2)
  );
  const endPage = Math.min(totalPages, startPage + paginationRange - 1);

  // Prepare summary data based on all columns, ensuring fixed columns are included with empty strings
  const summaryData = useMemo(() => {
    return columns.reduce((acc, column) => {
      if (column.fixed) {
        acc[column.key] = "";
      } else if (!column.hidden && typeof column.key === "number") {
        const value = computeTotalOrAverage(
          filteredData,
          column.key,
          column.indicator
        );
        acc[column.key] = value !== null ? value : "";
      }
      return acc;
    }, {});
  }, [columns, selectedOptions]); // Add dependencies here

  // to control the show and hide of the summary row
  const showSummaryRow = () => {
    return (
      selectedOptions.length === 1 &&
      Object.values(summaryData).some((value) => value !== "")
    );
  };

  return (
    <Row>
      <Col lg={12} className="mx-auto">
        <Card className="rounded border-0">
          <Card.Body className="px-layout bg-white rounded">
            <div className="table-responsive">
              <span>{strings.tableComment}</span>
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
                  {pinnedRow && <PinnedRow row={pinnedRow} columns={columns} />}
                  {currentRows.map((row, index) => (
                    <TableRow
                      key={index}
                      row={row}
                      columns={columns}
                      handleSectorClick={handleSectorClick}
                      config={config}
                    />
                  ))}
                  {showSummaryRow() && (
                    <SummaryRow
                      row={summaryData}
                      columns={columns}
                      tabId={selectedTab}
                    />
                  )}
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
  pinnedRow: PropTypes.object, // Add this line to accept pinnedRow prop
  selectedTab: PropTypes.number.isRequired, // Add this line to accept selectedTab prop
  selectedOptions: PropTypes.array, // Define prop type for selectedOptions
  setSelectedOptions: PropTypes.func.isRequired, // Function to update selected options
};

export default ScreenerTable;
