import React from "react";
import { Pagination } from "react-bootstrap";
import { strings } from "../../utils/constants/localizedStrings";

const ScreenerPagination = ({
  validCurrentPage,
  handlePageChange,
  startPage,
  endPage,
  totalPages,
}) => {
  return (
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
              <path d="M 11.55 6.68 L 1.11 6.68 L 6.33 0.76 L 11.55 6.68 Z" />
              <path d="M 6.33 1.51 L 2.22 6.18 L 10.44 6.18 L 6.33 1.51 M 6.33 0 L 12.66 7.18 L 0 7.18 L 6.33 0 Z" />
            </g>
          </svg>
          <span className="mr-4">{strings.prev}</span>
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
          <span>{strings.next}</span>
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
              <path d="M 11.55 6.68 L 1.11 6.68 L 6.33 0.76 L 11.55 6.68 Z" />
              <path d="M 6.33 1.51 L 2.22 6.18 L 10.44 6.18 L 6.33 1.51 M 6.33 0 L 12.66 7.18 L 0 7.18 L 6.33 0 Z" />
            </g>
          </svg>
        </Pagination.Next>
      </Pagination>
    </div>
  );
};

export default ScreenerPagination;
