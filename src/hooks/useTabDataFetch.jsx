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

const useTabDataFetch = (tabId, expirationTimeInMinutes = 0) => {
  const dispatch = useDispatch();
  const pages = useSelector(selectPages);
  const fieldConfigurations = useSelector(selectFieldConfigurations);
  const currentLanguage = useSelector(selectCurrentLanguage);

  const [loading, setLoading] = useState(false); // Add loading state
  const [localCache, setLocalCache] = useState({});
  const hasFetchedData = useRef(false);
  const previousLanguage = useRef(currentLanguage);

  const loadData = useCallback(async () => {
    try {
      const response = await fetchPageStructure();
      if (response?.data?.pages) {
        dispatch(setPages(response.data.pages));
      } else {
        console.error("Unexpected API response structure");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!pages || pages.length === 0) loadData();
  }, [dispatch, pages]);

  useEffect(() => {
    hasFetchedData.current = false;
  }, [tabId]);

  useEffect(() => {
    if (previousLanguage.current !== currentLanguage) {
      hasFetchedData.current = false;
      previousLanguage.current = currentLanguage;
    }
  }, [currentLanguage]);

  //ADDED TO SEEMLESSLY WORK ON THE ADDED TAB(S) IN THE SCREENER PAGE
  const screenerTabs = useMemo(() => {
    if (!pages || pages.length === 0) {
      console.log("Pages data is not available yet.");
      return [];
    }
    const screenerPage = pages.find((page) => page.pageId === PAGES.SCREENER);
    const screenerSection = screenerPage.sections.find(
      (section) => section.sectionId === SECTIONS.STOCK_SCREENER
    );

    return screenerSection.tabs.map((tab) => tab.tabId) || [];
  }, [pages]);

  useEffect(() => {
    if (fieldConfigurations.length > 0 && tabId) {
      const cacheKey = `${tabId}_${currentLanguage}`;

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
        (cacheEntry.needsFetch || isExpired(cacheEntry)) &&
        !hasFetchedData.current
      ) {
        console.log("Fetching data...");

        dispatch(resetTabData({ tabId })); // Reset data for the current tab

        // Use the filtered configurations passed as a parameter
        const filteredConfigurations = fieldConfigurations.filter(
          (config) => config.TabID === tabId
        );

        setLoading(true); // Set loading to true when fetching starts

        if (screenerTabs.includes(tabId)) {
          dispatch(
            fetchScreenerData({ filteredConfigurations, currentLanguage })
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
  }, [dispatch, currentLanguage, tabId, expirationTimeInMinutes]);

  return { loading }; // Return the loading state
};

export default useTabDataFetch;
