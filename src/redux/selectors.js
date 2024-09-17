import { createSelector } from "reselect";
import { localized } from "../utils/localization";
import config from "../utils/config";
import memoize from "lodash.memoize";

const currentLanguageState = (state) => state.language.currentLanguage;
const fieldConfigurationsState = (state) =>
  state.fieldConfig.fieldConfigurations;
const screenerDataState = (state) => state.screener.screenerData;
const toptenDataState = (state) => state.topten.toptenData;
const toptenDataMultipleState = (state) =>
  state.toptenMultiple.toptenDataMultiple;
const argaamSectorsState = (state) => state.argaamSectors.sectors || [];

export const selectPages = (state) => state.pages.pages || [];
export const selectCurrentLanguage = (state) => state.language.currentLanguage;

// Memoized selector for selected page
const selectDefaultPage = createSelector(
  [selectPages],
  (pages) => pages.find((page) => page.isSelected) || {}
);

// Memoized selector for selected section
const selectDefaultSection = createSelector(
  [selectDefaultPage],
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
  [selectDefaultSection],
  (selectedSection) =>
    (selectedSection.tabs || []).find((tab) => tab.isSelected) || {}
);

// New selector to get localized tab name by tabId
export const selectDefaultLocalizedTabNameById = (tabId) =>
  createSelector(
    [selectDefaultSection, currentLanguageState],
    (defaultSection, currentLanguage) => {
      // Find the tab that matches the provided tabId
      const tab =
        (defaultSection.tabs || []).find((t) => t.tabId === tabId) || {};
      return localized(tab, "tabName", currentLanguage);
    }
  );

export const selectLocalizedTabNameById = (pageId, sectionId, tabId) =>
  createSelector(
    [selectPages, currentLanguageState],
    (pages, currentLanguage) => {
      const page = pages ? pages.find((page) => page.pageId === pageId) : null;
      if (!page) return "";
      const section = page.sections
        ? page.sections.find((section) => section.sectionId === sectionId)
        : null;
      if (!section) return "";
      const tab = section.tabs
        ? section.tabs.find((tab) => tab.tabId === tabId)
        : null;
      return !tab ? "" : localized(tab, "tabName", currentLanguage);
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
    return memoize((selectedTabId, currentLanguage) => {
      return screenerData.filter(
        (data) =>
          data.identifier.startsWith(`${selectedTabId}-`) &&
          data.identifier.endsWith(`-${currentLanguage}`)
      );
    });
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

// Selector to get sub-tab data from the store
export const selectSubTabData = () =>
  createSelector([toptenDataMultipleState], (toptenDataMultiple) => {
    return (subTabIdentifier) => {
      const subTab = toptenDataMultiple.find((item) =>
        item.subTabs.some((sub) => sub.encryptedConfigJson === subTabIdentifier)
      );
      return (
        subTab?.subTabs.find(
          (sub) => sub.encryptedConfigJson === subTabIdentifier
        ) || {}
      );
    };
  });

// Selector to get the data for a specific identifier
export const selectDataByIdentifier = (identifier) =>
  createSelector([toptenDataMultipleState], (toptenDataMultiple) => {
    // Find the entry for the given identifier
    const entry = toptenDataMultiple.find(
      (item) => item.identifier === identifier
    );

    if (entry) {
      // Transform data into a more usable format if needed
      return entry.data.map((subTabData, index) => ({
        originalIndex: index,
        data: subTabData,
      }));
    }

    return [];
  });

// Selector to get data for a specific sub-tab
export const selectDataForSubTab = (identifier, tabIndex) =>
  createSelector([toptenDataMultipleState], (toptenDataMultiple) => {
    // Find the entry for the given identifier
    const entry = toptenDataMultiple.find(
      (item) => item.identifier === identifier
    );

    // Return data for the specific tab
    if (entry) return entry.data[tabIndex] || [];

    return [];
  });

export const selectDataForSingleSubTab = (identifier) =>
  createSelector([toptenDataState], (toptenData) => {
    // Find the entry for the given identifier
    const entry = toptenData.find((item) => item.identifier === identifier);

    // Return data for the specific tab
    if (entry) return [...entry.data[0]];

    return [];
  });

export const selectFieldConfigurations = createSelector(
  [fieldConfigurationsState],
  (fieldConfigurations) => {
    return [...fieldConfigurations];
  }
);

export const selectScreenerData = createSelector(
  [screenerDataState],
  (screenerData) => {
    return [...screenerData];
  }
);

export const selectTopTenData = createSelector(
  [toptenDataState],
  (toptenData) => {
    return [...toptenData];
  }
);

export const selectTopTenDataMultiple = createSelector(
  [toptenDataMultipleState],
  (toptenDataMultiple) => {
    return [...toptenDataMultiple];
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

export const selectCurrentLanguage_ = createSelector(
  [currentLanguageState],
  (currentLanguage) => {
    return currentLanguage ? currentLanguage : config.defaultLanguage;
  }
);

export const selectSubSectionsSubTabs = (tabId, lang) =>
  createSelector([toptenDataMultipleState], (topTenMultipleData) => {
    const sectionTabData = topTenMultipleData.filter(
      (tabData) =>
        tabData.identifier.startsWith(tabId) &&
        tabData.identifier.endsWith(lang)
    );

    // Iterate through sectionTabData (expecting 4 items)
    const results = sectionTabData.map((item) => {
      const sectionId = item.identifier;
      const subTabs = item.subTabs; // Array of subTabs
      const data = item.data; // Array of data, matching length of subTabs

      // Return the mapped result
      return {
        sectionId,
        mappedData: subTabs.map((subTab, index) => ({
          subTab,
          data: data[index],
        })),
      };
    });

    return results;
  });
