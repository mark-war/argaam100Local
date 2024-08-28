export const createSectorMapping = (options) => {
  const mapping = {};
  options.forEach((option) => {
    mapping[option.id] = option.name;
  });
  return mapping;
};
