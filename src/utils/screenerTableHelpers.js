import { INDICATOR } from "./constants/localizedStrings";

// get the first dynamic column
export const getFirstDynamicColumn = (columns) => {
  return columns.find((col) => typeof col.key === "number" && !col.hidden);
};

// to compute total or average for the summary row
export const computeTotalOrAverage = (data, columnKey, indicator) => {
  let total = 0;
  let nonNumericCount = 0;

  for (let i = 0; i < data.length; i++) {
    const value = data[i][columnKey];
    if (typeof value === "number") {
      total += value;
    } else if (value === "-") {
      nonNumericCount++;
    }
  }

  // If all values are non-numeric, return "-"
  if (nonNumericCount === data.length) {
    return "-";
  }

  const average = total / (data.length - nonNumericCount); // Avoid counting non-numeric rows
  return indicator === INDICATOR.AVERAGE ? average : total;
};

// custom sorting for P/E columns
export const customSort = (data, key, direction) => {
  // Define the group for each value
  const getGroup = (value) => {
    if (value === "-" || value === undefined || value === null) return 3; // Dash values group
    if (value < 0) return 2; // Negative values group
    if (value >= 100) return 1; // Positives >= 100 group
    return 0; // Positives < 100 group
  };

  // Preallocate the groups array for efficiency
  const groups = [[], [], [], []];

  // Assign each data item to the correct group
  data.forEach((item) => {
    const group = getGroup(item[key]);
    groups[group].push(item);
  });

  // Sort only non-dash groups
  groups.forEach((group, index) => {
    if (group.length > 1 && index !== 3) {
      // Skip the dash group (index 3)
      group.sort((a, b) => {
        if (a[key] === "-" || b[key] === "-") return 0;
        return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
      });
    }
  });

  // Flatten the groups into a single array
  return groups.flat();
};
