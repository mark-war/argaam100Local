export const generateRankToBarWidth = (
  totalRanks = 10,
  startWidth = 75,
  decrement = 5
) => {
  const rankToBarWidth = {};

  for (let i = 1; i <= totalRanks; i++) {
    rankToBarWidth[i] = `${startWidth - (i - 1) * decrement}%`;
  }

  return rankToBarWidth;
};
