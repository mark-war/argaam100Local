export const generateRankToBarWidth = (
  values = [],
  startWidth = 85,
  decrement = 5
) => {
  const rankToBarWidth = {};

  // Filter out undefined values and check if all values are undefined
  // const hasOnlyUndefinedOrZeroValues = values.every(
  //   (value) => value === undefined || value === null || value === 0
  // );

  // If all values are undefined, return an empty object (or handle as needed)
  // if (hasOnlyUndefinedOrZeroValues) {
  //   return {}; // or return null/undefined based on how you handle "no chart" scenario
  // }

  // Use absolute values for calculation (ignoring sign for width determination)
  const absoluteValues = values.map((value) => Math.abs(value));
  console.log(absoluteValues);
  // Initialize the previous value to null for comparison
  let previousValue = null;

  // Detect if the values are in strictly ascending order and are all positive
  const isAscending =
    absoluteValues.every((val, i, arr) => i === 0 || arr[i - 1] < val) &&
    absoluteValues.every((val) => val > 0); // Ensure all values are positive

  // Check if all values are equal (non-zero)
  const areAllValuesEqual = absoluteValues.every(
    (value) => value === absoluteValues[0]
  );
  console.log("ASC", isAscending);
  console.log("ALL VAL EQUAL", areAllValuesEqual);

  if (isAscending) {
    // If values are ascending, we want to start small and increase up to startWidth
    absoluteValues.forEach((value, index) => {
      if (index === 0) {
        // Set the first value to a small width, starting from the lowest possible width
        rankToBarWidth[index + 1] = `${Math.max(
          0,
          startWidth - (values.length - 1) * decrement
        )}%`;
      } else {
        // Increase the width incrementally for ascending values
        const previousWidth = parseInt(rankToBarWidth[index] || "0%");
        const currentWidth = previousWidth + decrement;
        rankToBarWidth[index + 1] = `${Math.min(currentWidth, startWidth)}%`;
      }
    });
  } else if (areAllValuesEqual) {
    // If all values are equal, set all bars to the same max width (startWidth)
    absoluteValues.forEach((value, index) => {
      rankToBarWidth[index + 1] = `${startWidth}%`;
      console.log("GOES HERE!");
    });
  } else {
    // For descending values (default behavior), start with the maximum width (startWidth) and decrement
    absoluteValues.forEach((value, index) => {
      if (index === 0) {
        // Set the first value to the startWidth
        rankToBarWidth[index + 1] = `${startWidth}%`; // +1 to match rank (1-indexed)
      } else {
        if (value === previousValue) {
          // If the value is the same as the previous, keep the same width
          rankToBarWidth[index + 1] = rankToBarWidth[index] || "0%";
        } else {
          // Decrement the width for different values
          const currentWidth =
            parseInt(rankToBarWidth[index] || "0%") - decrement;
          rankToBarWidth[index + 1] = `${Math.max(currentWidth, 0)}%`;
        }
      }
      // Update previousValue for the next iteration
      previousValue = value;
    });
  }

  return rankToBarWidth;
};
