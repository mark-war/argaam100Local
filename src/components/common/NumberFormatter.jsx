import React, { useMemo } from "react";
import PropTypes from "prop-types";
import config from "../../utils/config";
import { strings, TABS } from "../../utils/constants/localizedStrings";

// Function to format the number with commas and decimals
const formatNumber = (number, decimals) => {
  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Math.abs(number));

  return number < 0
    ? `(${formattedValue})` // Add parentheses for negative numbers
    : formattedValue; // Return formatted number
};

// Function to format the value
const formatValue = (
  value,
  decimals = 2,
  isPEColumn = false,
  showPercentage = false
) => {
  if (isPEColumn) {
    if (value < 0) return strings.neg;
    if (value > 100) return strings.moreThan100;
  }

  let formattedValue =
    typeof value === "number" ? formatNumber(value, decimals) : value;

  // Append percentage symbol if showPercentage is true
  if (showPercentage) {
    formattedValue = `${formattedValue}%`;
  }
  return formattedValue;
};

const NumberFormatter = ({
  value,
  isPEColumn = false,
  selectedTab = null,
  activeSection = null,
  showPercentage = false,
}) => {
  const decimals =
    selectedTab === TABS.T_RANKING ||
    activeSection === 32 ||
    activeSection === 33
      ? 0
      : config.decimals || 2;

  if (activeSection === 30 || activeSection === 31) {
    let formattedValue =
      value < 0
        ? `(${Math.abs(value)})` // Add parentheses for negative numbers
        : value; // Return formatted number

    if (showPercentage) {
      formattedValue = `${formattedValue}%`;
    }

    return (
      <span
        style={{
          color: Number(value) < 0 ? "red" : "inherit",
        }}
      >
        {formattedValue}
      </span>
    );
  }

  // Memoize the formatted value to avoid unnecessary recalculations
  const formattedValue = useMemo(
    () => formatValue(value, decimals, isPEColumn, showPercentage),
    [value, decimals, isPEColumn, showPercentage]
  );

  return (
    <span
      style={{
        color: Number(value) < 0 ? "red" : "inherit",
      }}
    >
      {formattedValue}
    </span>
  );
};

NumberFormatter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isPEColumn: PropTypes.bool,
  showPercentage: PropTypes.bool, // Add the new prop type validation
};

export default NumberFormatter;
