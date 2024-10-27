import React from "react";

const TasiDash = ({ width = 30, height = 3, color = "#e27922" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 30 3"
  >
    <path
      d="M27,0H0"
      transform="translate(1.5 1.5)"
      fill="none"
      stroke={color}
      strokeLinecap="square"
      strokeWidth="3"
    />
  </svg>
);

export default TasiDash;
