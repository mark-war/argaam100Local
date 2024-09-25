import React from "react";
import PropTypes from "prop-types";
import NumberFormatter from "../common/NumberFormatter";
import { strings } from "../../utils/constants/localizedStrings";

const PinnedRow = ({ row, columns }) => {
  return (
    <tr>
      {columns.map((column) => {
        if (column.hidden) return null; // Skip rendering hidden columns

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
                <>
                  {/* Render company logo and name */}
                  <img
                    alt="Company Logo"
                    src={row.fixed_img}
                    className="logo_image"
                  />
                  <span>{row[column.key]}</span>
                </>
              ) : column.key === "fixed_sector" ? (
                row[column.key]
              ) : null
            ) : (
              <span
                style={{
                  color: row[column.key] < 0 ? "red" : "inherit",
                }}
              >
                <NumberFormatter
                  value={row[column.key]}
                  isPEColumn={column.key.includes(strings.pe)}
                />
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
};

PinnedRow.propTypes = {
  row: PropTypes.object.isRequired, // Object containing pinned row data
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
};

export default PinnedRow;
