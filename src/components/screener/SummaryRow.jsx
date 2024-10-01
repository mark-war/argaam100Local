import React from "react";
import PropTypes from "prop-types";
import NumberFormatter from "../common/NumberFormatter";
import config from "../../utils/config";
import { strings, TABS } from "../../utils/constants/localizedStrings";

// Helper function to get value for the cell
const getValue = (row, columnKey, tabId) => {
  if (row[columnKey] !== undefined) {
    return row[columnKey];
  }

  if (columnKey === "fixed_sector") {
    return tabId === TABS.S_PERFORMANCE_AND_SIZE
      ? strings.total
      : strings.average;
  }

  if (columnKey === "fixed_company") {
    return strings.sector;
  }

  return ""; // Default to empty string if no condition is met
};

// Helper function to determine the CSS class for the table cell
const getTdClassName = (value, columnClassName) => {
  return typeof value === "number" || value === "-"
    ? `text-center ${columnClassName}`
    : columnClassName || "";
};

// Helper function to render individual columns
const renderColumn = (column, value, row) => (
  <td key={column.key} className={getTdClassName(value, column.className)}>
    <span
      style={{
        color: value < 0 ? "red" : "inherit",
      }}
    >
      <NumberFormatter
        value={value}
        isPEColumn={config.peFieldIds.has(column.key)}
      />
    </span>
  </td>
);

const SummaryRow = ({ row = {}, columns, tabId }) => {
  return (
    <tr className="total_row">
      {columns.map((column) => {
        if (column.hidden) {
          return null; // Skip hidden columns
        }

        const value = getValue(row, column.key, tabId);
        return renderColumn(column, value, row);
      })}
    </tr>
  );
};

// PropTypes for type-checking the props
SummaryRow.propTypes = {
  row: PropTypes.object.isRequired, // Summary data should be an object with key-value pairs
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      className: PropTypes.string,
      label: PropTypes.string, // Label can be used for display or debugging
      hidden: PropTypes.bool, // Indicates if the column is hidden
      type: PropTypes.string, // Indicates the type of data in the column
    })
  ).isRequired,
  tabId: PropTypes.number.isRequired, // Tab ID to determine whether to show "Total" or "Average"
};

export default SummaryRow;
