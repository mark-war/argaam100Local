import { LANGUAGES } from "./constants/localizedStrings";

export const localized = (item, key, currentLanguage, isCaps = false) => {
  if (isCaps)
    return currentLanguage === LANGUAGES.EN
      ? item[`${key}EN`]
      : item[`${key}AR`];
  return currentLanguage === LANGUAGES.EN ? item[`${key}En`] : item[`${key}Ar`];
};
