import PropTypes from "prop-types";

// Reusable Table Header Component
const TableHeader = ({ columns, onSort, sortConfig }) => {
  const getSortIcon = (columnName) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return (
        <>
          <img alt="Sort Asc" src="/assets/images/arrow_up.svg" />
          <img alt="Sort Desc" src="/assets/images/arrow_down.svg" />
        </>
      );
    }

    if (sortConfig.direction === "asc") {
      return (
        <>
          <img alt="Sort Asc Active" src="/assets/images/arrow_up_active.svg" />
          <img alt="Sort Desc" src="/assets/images/arrow_down.svg" />
        </>
      );
    }

    return (
      <>
        <img alt="Sort Asc" src="/assets/images/arrow_up.svg" />
        <img
          alt="Sort Desc Active"
          src="/assets/images/arrow_down_active.svg"
        />
      </>
    );
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => {
          // Skip rendering this column if it is marked as hidden
          if (column.hidden) return null;
          const isFixedColumn =
            typeof column.key === "string" && column.key.startsWith("fixed_");
          return isFixedColumn ? (
            <th key={column.key} className={`${column.className}`}>
              {column.label}
            </th>
          ) : (
            <th
              key={column.key}
              className={`cursor_pointer text-center`}
              onClick={() => onSort(column.key)}
            >
              {getSortIcon(column.key)}
              {column.label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

TableHeader.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string,
    })
  ).isRequired,
  onSort: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    direction: PropTypes.string,
  }),
};

export default TableHeader;
