import React from "react";
import PropTypes from "prop-types";
import config from "../../utils/config";
import { strings } from "../../utils/constants/localizedStrings";

/**
 * NumberFormatter Component
 *
 * Formats a given numeric value to a specified number of decimal places.
 * If the number is negative, it formats it with parentheses.
 */
const NumberFormatter = ({ value, isPEColumn = false }) => {
  const decimals = config.decimals;

  // Function to format the value
  const formatValue = (value, decimals, isPEColumn) => {
    if (isPEColumn) {
      if (value < 0) {
        return strings.neg;
      }
      if (value > 100) {
        return strings.moreThan100;
      }
      if (typeof value === "number") {
        const formattedValue = value.toFixed(decimals);
        return value < 0
          ? `(${Math.abs(formattedValue).toFixed(decimals)})`
          : formattedValue;
      }
      return value;
    }

    if (typeof value === "number") {
      const formattedValue = value.toFixed(decimals);
      return value < 0
        ? `(${Math.abs(formattedValue).toFixed(decimals)})`
        : formattedValue;
    }
    return value;
  };

  // Render the formatted value
  return <span>{formatValue(value, decimals, isPEColumn)}</span>;
};

// Define prop types
NumberFormatter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default NumberFormatter;
