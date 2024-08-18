import { createSelector } from "reselect";

const currentLanguageState = (state) => state.language.currentLanguage;
const fieldConfigurationsState = (state) => state.screener.fieldConfigurations;
const screenerDataState = (state) => state.screener.screenerData;

export const selectPages = (state) => state.apiData.pages || [];

export const selectSelectedTab = (state) => {
  const pages = selectPages(state);
  const selectedPage = pages.find((page) => page.isSelected) || {};
  const selectedSection =
    (selectedPage.sections || []).find((section) => section.isSelected) || {};
  return (selectedSection.tabs || []).find((tab) => tab.isSelected) || {};
};

export const selectFieldConfigurations = createSelector(
  [fieldConfigurationsState],
  (fieldConfigurations) => {
    // Return a copy or perform minimal transformation if needed
    return fieldConfigurations;
  }
);

export const selectCurrentLanguage = createSelector(
  [currentLanguageState],
  (currentLanguage) => {
    // Ensure that the result is processed if needed
    return currentLanguage;
  }
);

export const selectScreenerData = createSelector(
  [screenerDataState],
  (screenerData) => {
    return screenerData;
  }
);

// This is the selector that filters screenerData by tabId.
// export const selectScreenerDataByTabId = (tabId) =>
//   createSelector([screenerDataState], (screenerData) => {
//     return screenerData.filter((data) => data.tabId === tabId);
//   });
