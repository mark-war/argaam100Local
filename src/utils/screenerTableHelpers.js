import { INDICATOR } from "./constants/localizedStrings";

// Extracted function to get the first dynamic column
export const getFirstDynamicColumn = (columns) => {
  return columns.find((col) => typeof col.key === "number" && !col.hidden);
};

// Extracted function to compute total or average
export const computeTotalOrAverage = (data, columnKey, indicator) => {
  const total = data.reduce(
    (sum, row) =>
      typeof row[columnKey] === "number" ? sum + row[columnKey] : sum,
    0
  );
  const average = total / data.length;

  return indicator === INDICATOR.AVERAGE ? average : total;
};

// Extracted function for custom sorting
export const customSort = (data, key, direction) => {
  // Define the group for each value
  const getGroup = (value) => {
    if (value === "-" || value === undefined || value === null) return 3; // Dash values (last group)
    if (value < 0) return 2; // Negatives (last group)
    if (value >= 100) return 1; // Positives >= 100 (second group)
    return 0; // Positives < 100 (first group)
  };

  // Define the fixed group order
  const groupOrder = [0, 1, 2, 3]; // Fixed order: positives < 100, positives >= 100, negatives

  // Separate data into groups
  const groups = groupOrder.reduce((acc, group) => {
    acc[group] = [];
    return acc;
  }, {});

  data.forEach((item) => {
    const group = getGroup(item[key]);
    groups[group].push(item);
  });

  // Sort each group based on the direction
  Object.keys(groups).forEach((group) => {
    groups[group].sort((a, b) => {
      // Treat dash values as equal within their group
      if (a[key] === "-" || b[key] === "-") return 0;
      return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
    });
  });

  // Combine the groups into a single array
  return groupOrder.flatMap((group) => groups[group]);
};
