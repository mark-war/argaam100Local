import React, { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { Table, Row, Col, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ScreenerPagination from "./ScreenerPagination";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow.jsx";
import { setLanguage } from "../../redux/features/languageSlice.js";
import { TABS, strings } from "../../utils/constants/localizedStrings";
import config from "../../utils/config.js";
import PinnedRow from "./PinnedRow.jsx";

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
  const { lang } = useParams(); // Access the current language from URL parameters

  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const initialSortSet = useRef(false);

  // Set up language on component mount and language change
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

  // Find the first dynamic column
  const getFirstDynamicColumn = () =>
    columns.find((col) => typeof col.key === "number" && !col.hidden);

  // Initialize sorting configuration for the first dynamic column
  useEffect(() => {
    const firstDynamicColumn = getFirstDynamicColumn();
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
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
        // Treat dash values as equal within their group
        if (a[key] === "-" || b[key] === "-") return 0;
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      });
    });

    // Combine the groups into a single array
    return groupOrder.flatMap((group) => groups[group]);
  };

  // Handle sort action
  const handleSort = (columnKey) => {
    const direction =
      sortConfig.key === columnKey && sortConfig.direction === "asc"
        ? "desc"
        : "asc";
    setSortConfig({ key: columnKey, direction });
  };

  // Sort the filtered data based on the current sort configuration
  const sortedData = useMemo(() => {
    if (sortConfig.key) {
      if (config.peFieldIds.has(sortConfig.key)) {
        return customSort(filteredData, sortConfig.key, sortConfig.direction);
      }
      return [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key] === "-" ? null : a[sortConfig.key];
        const bValue = b[sortConfig.key] === "-" ? null : b[sortConfig.key];

        if (aValue === null) return 1; // Place dash at the bottom
        if (bValue === null) return -1; // Place dash at the bottom

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;

        return 0;
      });
    }
    return filteredData;
  }, [filteredData, sortConfig]);

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
