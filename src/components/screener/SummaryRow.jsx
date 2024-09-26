import React from "react";
import PropTypes from "prop-types";
import NumberFormatter from "../common/NumberFormatter";
import config from "../../utils/config";

const SummaryRow = ({ row = {}, columns }) => {
  return (
    <tr className="total_row">
      {columns.map((column) => {
        // Skip rendering if the column is hidden
        if (column.hidden) {
          return null; // Skip this column
        }

        // Safely access summaryData[column.key], default to "" if undefined
        const value = row[column.key] !== undefined ? row[column.key] : "";

        // Render the column
        return (
          <td key={column.key} className={`text-center ${column.className}`}>
            <span
              style={{
                color: row[column.key] < 0 ? "red" : "inherit",
              }}
            >
              <NumberFormatter
                value={value}
                isPEColumn={config.peFieldIds.has(column.key)}
              />
            </span>
          </td>
        );
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
};

export default SummaryRow;
