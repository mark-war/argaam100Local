import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchScreenerData,
  resetTabData,
} from "../redux/features/screenerDataSlice";
import {
  selectFieldConfigurations,
  selectCurrentLanguage,
  selectPages,
} from "../redux/selectors";
import { fetchTopTenData } from "../redux/features/topTenSingleTabSlice";
import { fetchMultipleTabTopTenData } from "../redux/features/topTenMultiTabSlice";
import { PAGES, SECTIONS, TABS } from "../utils/constants/localizedStrings";
import { fetchPageStructure } from "../services/screenerApi";
import { setPages } from "../redux/features/pageSlice";

const useTabDataFetch = (
  tabId,
  expirationTimeInMinutes = 0,
  selectedSectorId = null
) => {
  const dispatch = useDispatch();
  const pages = useSelector(selectPages);
  const fieldConfigurations = useSelector(selectFieldConfigurations);
  const currentLanguage = useSelector(selectCurrentLanguage);

  const [loading, setLoading] = useState(false); // Add loading state
  const [localCache, setLocalCache] = useState({});
  const hasFetchedData = useRef(false);
  const previousLanguage = useRef(currentLanguage);

  const loadData = useCallback(async () => {
    // Check if we've already reloaded
    const hasReloaded = localStorage.getItem("hasReloaded");

    try {
      if (!hasReloaded) {
        console.log("Attempting to reload.");

        // Add log before the API call
        console.log("Fetching page structure from API...");
        const response = await fetchPageStructure();

        // Add log after getting the response
        console.log("API Response:", response);

        if (response?.data?.pages) {
          console.log(
            "Successfully received pages from API:",
            response.data.pages
          );
          dispatch(setPages(response.data.pages));
          localStorage.setItem("hasReloaded", "true"); // Set the flag after successful fetch
        } else {
          console.error("Unexpected API response structure, reloading...");
          window.location.reload(); // Reload without nocache
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      window.location.reload(); // Reload on error
    }
  }, [dispatch]);

  useEffect(() => {
    if (!pages || pages.length === 0) {
      console.log("Pages are empty or not loaded yet, attempting to load.");
      loadData(); // Call the loadData function to fetch the pages again.
    }
  }, [pages, loadData]);

  useEffect(() => {
    hasFetchedData.current = false;
  }, [tabId]);

  useEffect(() => {
    if (previousLanguage.current !== currentLanguage) {
      hasFetchedData.current = false;
      previousLanguage.current = currentLanguage;
    }
  }, [currentLanguage]);

  const screenerTabs = useMemo(() => {
    if (!pages || pages.length === 0) {
      console.log("Pages data is not available yet.");
      return [];
    }
    const screenerPage = pages.find((page) => page.pageId === PAGES.SCREENER);

    if (!screenerPage) {
      console.log("Screener page not found.");
      return [];
    }

    const screenerSection = screenerPage.sections.find(
      (section) => section.sectionId === SECTIONS.STOCK_SCREENER
    );

    if (!screenerSection) {
      console.log("Screener section not found.");
      return [];
    }

    return screenerSection.tabs.map((tab) => tab.tabId);
  }, [pages]);

  useEffect(() => {
    if (fieldConfigurations.length > 0 && tabId) {
      const cacheKey = `${tabId}_${currentLanguage}${
        selectedSectorId ? `_${selectedSectorId}` : ""
      }`;

      // Check if we need to fetch data based on local cache
      const cacheEntry = localCache[cacheKey] || {
        needsFetch: true,
        timestamp: 0,
      };

      const isExpired = (cacheEntry) => {
        if (expirationTimeInMinutes === 0) return false; // No expiration
        const currentTime = Date.now();
        const expirationTime = expirationTimeInMinutes * 60 * 1000;
        return currentTime - cacheEntry.timestamp > expirationTime;
      };

      if (
        ((cacheEntry.needsFetch || isExpired(cacheEntry)) &&
          !hasFetchedData.current) ||
        (selectedSectorId &&
          (!localCache[`${tabId}_${currentLanguage}_${selectedSectorId}`] ||
            localCache[`${tabId}_${currentLanguage}_${selectedSectorId}`]
              .needsFetch))
      ) {
        console.log("Fetching data...");

        dispatch(resetTabData({ tabId })); // Reset data for the current tab

        // Use the filtered configurations passed as a parameter
        const filteredConfigurations = fieldConfigurations.filter(
          (config) => config.TabID === tabId
        );

        setLoading(true); // Set loading to true when fetching starts

        if (screenerTabs.includes(tabId)) {
          // to make sure that the dispatch of screener data with specific selectedSectorId only happens when the tabId is Financial Ratio
          selectedSectorId =
            tabId === TABS.S_FINANCIAL_RATIO ? selectedSectorId : null;
          dispatch(
            fetchScreenerData({
              filteredConfigurations,
              currentLanguage,
              selectedSectorId,
            })
          ).then(() => {
            console.log("Data fetch complete");
            setLoading(false); // Set loading to false when fetching completes

            // Update local cache after fetch
            setLocalCache((prevCache) => ({
              ...prevCache,
              [cacheKey]: { needsFetch: false, timestamp: Date.now() },
            }));
          });
        } else if (
          //FOR TOP TEN PAGE TABS WITH HISTORICAL EVOLUTION
          tabId !== TABS.T_STOCK_PERFORMANCE &&
          tabId !== TABS.T_GROWTH_AND_DIVIDENDS
        ) {
          dispatch(
            fetchTopTenData({ filteredConfigurations, currentLanguage })
          ).then(() => {
            setLoading(false); // Set loading to false when fetching completes

            // Update local cache after fetch
            setLocalCache((prevCache) => ({
              ...prevCache,
              [cacheKey]: { needsFetch: false, timestamp: Date.now() },
            }));
          });
        } else {
          //REST OF THE TOP TEN PAGE TABS
          dispatch(
            fetchMultipleTabTopTenData({
              filteredConfigurations,
              currentLanguage,
            })
          ).then(() => {
            setLoading(false); // Set loading to false when fetching completes

            // Update local cache after fetch
            setLocalCache((prevCache) => ({
              ...prevCache,
              [cacheKey]: { needsFetch: false, timestamp: Date.now() },
            }));
          });
        }

        hasFetchedData.current = true; // Set the flag to prevent re-dispatch
      } else {
        console.log(
          "Data already exists for this tab and language, skipping fetch."
        );
      }
    }
  }, [
    dispatch,
    currentLanguage,
    tabId,
    expirationTimeInMinutes,
    selectedSectorId,
  ]);

  useEffect(() => {
    const handleRefresh = () => {
      loadData(); // Fetch data again
    };

    window.addEventListener("popstate", handleRefresh); // Listen for back/forward navigation
    return () => {
      window.removeEventListener("popstate", handleRefresh);
    };
  }, []);

  return { loading }; // Return the loading state
};

export default useTabDataFetch;
