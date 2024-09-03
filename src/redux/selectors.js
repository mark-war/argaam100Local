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

// Memoized Selector to find a section by its ID
const selectSectionById = (sectionId) =>
  createSelector([selectPages], (pages) => {
    // Iterate through all pages to find the section with the provided sectionId
    for (const page of pages) {
      const section = (page.sections || []).find(
        (section) => section.sectionId === sectionId
      );
      if (section) {
        return section;
      }
    }
    return {}; // Return an empty object if no section is found
  });

// Memoized selector for selected tab
export const selectDefaultTab = createSelector(
  [selectSelectedSection],
  (selectedSection) =>
    (selectedSection.tabs || []).find((tab) => tab.isSelected) || {}
);

// New selector to get localized tab name by tabId
export const selectLocalizedTabNameById = (tabId) =>
  createSelector(
    [selectSelectedSection, currentLanguageState],
    (selectedSection, currentLanguage) => {
      // Find the tab that matches the provided tabId
      const tab =
        (selectedSection.tabs || []).find((t) => t.tabId === tabId) || {};
      return localized(tab, "tabName", currentLanguage);
    }
  );

// to get tab ids and localized tab names for a section
export const selectTabIdsAndNamesForSection = (sectionId) =>
  createSelector(
    [selectSectionById(sectionId), currentLanguageState],
    (selectedSection, currentLanguage) => {
      return (selectedSection.tabs || []).map((tab) => ({
        tabId: tab.tabId,
        tabName: localized(tab, "tabName", currentLanguage),
      }));
    }
  );

// Create a memoized selector that takes the selected tab ID as an argument for screener data
export const selectScreenerDataOfSelectedTab = () =>
  createSelector([screenerDataState], (screenerData) => {
    return (selectedTabId, currentLanguage) => {
      return screenerData.filter(
        (data) =>
          data.identifier.startsWith(`${selectedTabId}-`) &&
          data.identifier.endsWith(`-${currentLanguage}`)
      );
    };
  });

// Create a memoized selector that takes the section ID as an argument for screener data
export const selectScreenerDataOfSection = () =>
  createSelector([screenerDataState, selectPages], (screenerData, pages) => {
    return (sectionId, currentLanguage) => {
      // Find the section by its ID from the pages
      const section = pages
        .flatMap((page) => page.sections || [])
        .find((sec) => sec.sectionId === sectionId);
      if (!section || !section.tabs) {
        return []; // Return an empty array if no section or no tabs are found
      }

      // Iterate over the tabs of the found section and collect screener data for each tab
      return section.tabs.flatMap((tab) =>
        screenerData.filter(
          (data) =>
            data.identifier.startsWith(`${tab.tabId}-`) &&
            data.identifier.endsWith(`-${currentLanguage}`)
        )
      );
    };
  });

export const selectFieldConfigurations = createSelector(
  [fieldConfigurationsState],
  (fieldConfigurations) => {
    // Return a copy or perform minimal transformation if needed
    return fieldConfigurations;
  }
);

export const selectScreenerData = createSelector(
  [screenerDataState],
  (screenerData) => {
    return screenerData;
  }
);

export const selectLocalizedSectors = createSelector(
  [argaamSectorsState, currentLanguageState],
  (argaamSectors, currentLanguage) => {
    return argaamSectors.map((sector) => ({
      id: sector.ARGAAMSECTORID,
      name: localized(sector, "ARGAAMSECTORNAME", currentLanguage, true),
    }));
  }
);

export const selectCurrentLanguage = createSelector(
  [currentLanguageState],
  (currentLanguage) => {
    return currentLanguage;
  }
);
