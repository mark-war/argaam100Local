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
  isPEColumn = false
  // showPercentage = false
) => {
  if (isPEColumn) {
    if (value < 0) return strings.neg;
    if (value > 100) return strings.moreThan100;
  }

  let formattedValue =
    typeof value === "number" ? formatNumber(value, decimals) : value;

  // Append percentage symbol if showPercentage is true
  // if (showPercentage) {
  //   formattedValue = `${formattedValue}%`;
  // }
  return formattedValue;
};

const NumberFormatter = ({
  value,
  isPEColumn = false,
  selectedTab = null,
  activeSection = null,
  unit = null,
  // showPercentage = false,
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
        ? `(${Math.abs(value).toFixed(2)})` // Add parentheses for negative numbers
        : // : value; // Return formatted number
          parseFloat(value).toFixed(2);

    // if (showPercentage) {
    //   formattedValue = `${formattedValue}%`;
    // }

    return (
      //  <span
      //    style={{
      //      color: Number(value) < 0 ? "red" : "inherit",
      //    }}
      //  >
      //   <span
      //   style={{
      //     color:
      //       activeSection === 30
      //         ? "green"
      //         : Number(value) < 0
      //         ? "red"
      //         : "inherit",
      //   }}
      // >
      <span>
        {formattedValue}
        {unit}
      </span>
    );
  }

  // Memoize the formatted value to avoid unnecessary recalculations
  const formattedValue = useMemo(
    () => formatValue(value, decimals, isPEColumn),
    [value, decimals, isPEColumn]
    // () => formatValue(value, decimals, isPEColumn, showPercentage),
    // [value, decimals, isPEColumn, showPercentage]
  );

  return (
    <span
      style={{
        color: Number(value) < 0 ? "red" : "inherit",
      }}
    >
      {formattedValue}
      {unit}
    </span>
  );
};

NumberFormatter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isPEColumn: PropTypes.bool,
  // showPercentage: PropTypes.bool, // Add the new prop type validation
};

export default NumberFormatter;
