import { createSelector } from "reselect";
import { localized } from "../utils/localization";

const currentLanguageState = (state) => state.language.currentLanguage;
const fieldConfigurationsState = (state) => state.screener.fieldConfigurations;
const screenerDataState = (state) => state.screener.screenerData;
const argaamSectorsState = (state) => state.argaamSectors.sectors || [];

export const selectPages = (state) => state.apiData.pages || [];

// Memoized selector for selected page
const selectSelectedPage = createSelector(
  [selectPages],
  (pages) => pages.find((page) => page.isSelected) || {}
);

// Memoized selector for selected section
const selectSelectedSection = createSelector(
  [selectSelectedPage],
  (selectedPage) =>
    (selectedPage.sections || []).find((section) => section.isSelected) || {}
);

// Memoized selector for selected tab
export const selectSelectedTab = createSelector(
  [selectSelectedSection],
  (selectedSection) =>
    (selectedSection.tabs || []).find((tab) => tab.isSelected) || {}
);

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

// Updated localized sectors selector
export const selectLocalizedSectors = createSelector(
  [argaamSectorsState, currentLanguageState],
  (argaamSectors, currentLanguage) => {
    return argaamSectors.map((sector) => ({
      id: sector.ARGAAMSECTORID,
      name: localized(sector, "ARGAAMSECTORNAME", currentLanguage, true),
    }));
  }
);
