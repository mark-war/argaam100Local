export const generateRankToBarWidth = (
  values = [],
  startWidth = 85,
  decrement = 5
) => {
  const rankToBarWidth = {};

  // Initialize the previous value to null for comparison
  let previousValue = null;

  values.forEach((value, index) => {
    if (index === 0) {
      // Set the first value to the startWidth
      rankToBarWidth[index + 1] = `${startWidth}%`; // +1 to match rank (1-indexed)
    } else {
      if (value === previousValue) {
        // If the value is the same as the previous, keep the same width
        rankToBarWidth[index + 1] = rankToBarWidth[index] || "0%";
      } else {
        // If the value is different, decrement the width
        const currentWidth =
          parseInt(rankToBarWidth[index] || "0%") - decrement;
        rankToBarWidth[index + 1] = `${Math.max(currentWidth, 0)}%`;
      }
    }
    // Update previousValue for the next iteration
    previousValue = value;
  });

  return rankToBarWidth;
};
