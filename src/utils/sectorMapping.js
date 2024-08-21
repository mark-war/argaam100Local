export const createMapping = (fullOptions) => {
  const mapping = {};
  fullOptions.en.forEach((option, index) => {
    mapping[option] = fullOptions.ar[index]; // Map English to Arabic
    mapping[fullOptions.ar[index]] = option; // Map Arabic to English
  });
  return mapping;
};
