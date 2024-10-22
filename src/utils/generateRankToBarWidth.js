import { TABS } from "./constants/localizedStrings";

export const generateRankToBarWidth = (values = [], selectedTab) => {
  const rankToBarWidth = {};
  const absoluteValues = values.map((value) => Math.abs(value));
  const maxValue = Math.max(...absoluteValues);
  const minWidth = 15;

  const scalingFactors = {
    [TABS.T_RANKING]: 0.1,
    [TABS.T_ARR_MULTIPLE]: 0.95,
    [TABS.T_STOCK_PERFORMANCE]: 0.4, // New scaling factor for NEW_TAB
    // Add more mappings as needed
  };

  const scalingFactor = scalingFactors[selectedTab] || 0.5;

  // Check if all values are null or undefined
  const allValuesNullOrUndefined = values.every(
    (value) =>
      value === null || value === undefined || value === 0 || value === ""
  );

  // If all values are null or undefined, set 100% width for all ranks
  if (allValuesNullOrUndefined) {
    values.forEach((_, index) => {
      const rank = index + 1;
      rankToBarWidth[rank] = "100%";
    });
    return rankToBarWidth;
  }

  // Determine scale start rank based on significant drops
  let scaleStartRank = 2;
  for (let i = 1; i < absoluteValues.length; i++) {
    const prev = absoluteValues[i - 1];
    const curr = absoluteValues[i];
    if (curr !== 0) {
      const percentageChange = (prev / curr) * 100;
      if (percentageChange > 100) {
        scaleStartRank = i + 1;
        break;
      }
    }
  }

  // Calculate bar widths
  absoluteValues.forEach((value, index) => {
    const rank = index + 1;
    if (maxValue > 0) {
      let barWidth;
      if (rank < scaleStartRank) {
        barWidth = (value / maxValue) * 100;
      } else {
        const normalizedValue = value / maxValue;
        barWidth = Math.max(
          100 * Math.pow(normalizedValue, scalingFactor),
          minWidth
        );
      }
      rankToBarWidth[rank] = `${barWidth}%`;
    } else {
      rankToBarWidth[rank] = "0%";
    }
  });

  return rankToBarWidth;
};
