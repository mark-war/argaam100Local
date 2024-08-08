import React from "react";
import PropTypes from "prop-types";
import config from "../../utils/config";

/**
 * NumberFormatter Component
 *
 * Formats a given numeric value to a specified number of decimal places.
 * If the number is negative, it formats it with parentheses.
 */
const NumberFormatter = ({ value }) => {
  const decimals = config.decimals;
  // Function to format the value
  const formatValue = (value, decimals) => {
    if (typeof value === "number") {
      const formattedValue = value.toFixed(decimals);
      return value < 0
        ? `(${Math.abs(formattedValue).toFixed(decimals)})`
        : formattedValue;
    }
    return value;
  };

  // Render the formatted value
  return <span>{formatValue(value, decimals)}</span>;
};

// Define prop types
NumberFormatter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default NumberFormatter;
