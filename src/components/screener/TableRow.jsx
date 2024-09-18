import { useParams } from "react-router-dom";
import NumberFormatter from "../common/NumberFormatter";
import { LANGUAGES } from "../../utils/constants/localizedStrings";

const argaamUrl = (companyID = "") => {
  const { lang } = useParams(); // Access the current language from URL parameters
  const baseUrl =
    lang === LANGUAGES.AR
      ? `https://www.argaam.com/ar/company/companyoverview/marketid/3/companyid/${companyID}/`
      : `https://www.argaam.com/en/tadawul/tasi/`;

  return baseUrl;
};

const renderFixedCompanyColumn = (row, column, argaamUrl) => (
  <a
    target="_blank"
    rel="noreferrer"
    href={`${argaamUrl(row.CompanyID)}${row[column.key]}`}
    className="company-link"
  >
    <img alt="" src={row.fixed_img} className="logo_image" />
    <span>{row[column.key]}</span>
  </a>
);

const renderFixedCodeColumn = (row, column) => (
  <span className="bg_tag">{row[column.key]}</span>
);

const renderFixedSectorColumn = (row, column, handleSectorClick) => (
  <a
    href="#"
    onClick={() => handleSectorClick(row.SectorID)}
    className="sector-link"
  >
    {row[column.key]}
  </a>
);

const TableRow = ({ row, columns, handleSectorClick, config }) => (
  <tr>
    {columns.map((column) => {
      if (column.hidden) return null;

      const isFixedColumn =
        typeof column.key === "string" && column.key.startsWith("fixed_");
      const tdClassName = isFixedColumn
        ? column.key === "fixed_company"
          ? "td_img"
          : column.className
        : `text-center ${column.className}`;

      return (
        <td key={column.key} className={tdClassName}>
          {isFixedColumn ? (
            column.key === "fixed_company" ? (
              renderFixedCompanyColumn(row, column, argaamUrl)
            ) : column.key === "fixed_code" ? (
              renderFixedCodeColumn(row, column)
            ) : column.key === "fixed_sector" ? (
              renderFixedSectorColumn(row, column, handleSectorClick)
            ) : null
          ) : (
            <span
              style={{
                color: row[column.key] < 0 ? "red" : "inherit",
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
);

export default TableRow;
