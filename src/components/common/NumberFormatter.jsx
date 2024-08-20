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
  const decimals = config.decimals || 2;

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
        return formatNumber(value, decimals);
      }
      return value;
    }

    if (typeof value === "number") {
      return formatNumber(value, decimals);
    }
    return value;
  };

  // Helper function to format the number with commas and decimals
  const formatNumber = (number, decimals) => {
    // Format the number with commas and specified decimals
    const formattedValue = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(Math.abs(number));

    return number < 0
      ? `(${formattedValue})` // Add parentheses for negative numbers
      : formattedValue; // Return formatted number
  };

  // Render the formatted value
  return <span>{formatValue(value, decimals, isPEColumn)}</span>;
};

// Define prop types
NumberFormatter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isPEColumn: PropTypes.bool,
};

export default NumberFormatter;
