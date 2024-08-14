import { LANGUAGES } from "./constants/localizedStrings";

export const localized = (item, key, currentLanguage) => {
  return currentLanguage === LANGUAGES.EN ? item[`${key}En`] : item[`${key}Ar`];
};
