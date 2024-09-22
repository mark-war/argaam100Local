import { TABS } from "./constants/localizedStrings";

export const generateRankToBarWidth = (
  values = [],
  startWidth = 85,
  decrement = 5,
  selectedTab
) => {
  // object container for the bar chart value
  const rankToBarWidth = {};
  // Initialize the previous value to null for comparison
  let previousValue = null;
  startWidth = 100;
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

  // Detect if the values are in strictly ascending order and are all positive
  const isAscending =
    absoluteValues.every((val, i, arr) => i === 0 || arr[i - 1] < val) &&
    absoluteValues.every((val) => val > 0); // Ensure all values are positive

  // Check if all values are equal (non-zero)
  const areAllValuesEqual = absoluteValues.every(
    (value) => value === absoluteValues[0]
  );

  if (selectedTab === TABS.T_ARR_MULTIPLE) {
    startWidth = 100;
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
          const currentWidth = parseFloat(rankToBarWidth[index] || "0%");

          /* 
          //USING LOG APPROACH//
          rankToBarWidth[index + 1] = `${Math.log(currentWidth) * 6}%`;
          */

          if (selectedTab === TABS.T_RANKING) {
            const difference = previousValue - value;
            const percentageDifference = (difference / value) * 100; // Percentage difference

            // Determine the decrement based on the percentage difference
            decrement =
              percentageDifference >= 100
                ? 30
                : percentageDifference >= 75
                ? 10
                : percentageDifference >= 50
                ? 5
                : percentageDifference >= 25
                ? 3
                : percentageDifference >= 10
                ? 2
                : 1;

            // Calculate the new width, ensuring it doesn't go below 0
            const updatedWidth = Math.max(currentWidth - decrement, 0);

            // Update the next value in the rankToBarWidth array
            rankToBarWidth[index + 1] = `${updatedWidth}%`;
          } else {
            const startIndex = Math.max(index - 10, 0); // Ensure we don't go below 0
            let sumOfDifferences = 0;

            // Calculate the sum of the differences between consecutive values
            for (let i = startIndex; i < index; i++) {
              const diff = values[i] - values[i + 1];
              sumOfDifferences += diff;
            }

            // Calculate the average difference
            const averageDifference = sumOfDifferences / 10;
            if (averageDifference < 100000) {
              decrement = 5; // Use a smaller decrement if the average difference is small
            } else {
              const difference = previousValue - value;
              const percentageDifference = (difference / value) * 100; // Percentage difference

              // Determine the decrement based on the percentage difference
              decrement =
                percentageDifference >= 100
                  ? 30
                  : percentageDifference >= 75
                  ? 10
                  : percentageDifference >= 50
                  ? 5
                  : percentageDifference >= 25
                  ? 3
                  : percentageDifference >= 10
                  ? 2
                  : 1;
            }

            // Calculate the new width, ensuring it doesn't go below 0
            const updatedWidth = Math.max(currentWidth - decrement, 0);

            // Update the next value in the rankToBarWidth array
            rankToBarWidth[index + 1] = `${updatedWidth}%`;
          }
        }
      }
      // Update previousValue for the next iteration
      previousValue = value;
    });
  }

  return rankToBarWidth;
};
