import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  fetchScreenerData,
  resetTabData,
} from "../redux/features/fieldConfigurationSlice";
import {
  selectFieldConfigurations,
  selectCurrentLanguage,
} from "../redux/selectors";

const useTabDataFetch = (tabId, expirationTimeInMinutes = 0) => {
  const dispatch = useDispatch();
  const fieldConfigurations = useSelector(selectFieldConfigurations);
  const currentLanguage = useSelector(selectCurrentLanguage);

  const [loading, setLoading] = useState(false); // Add loading state
  const [localCache, setLocalCache] = useState({});
  const hasFetchedData = useRef(false);
  const previousLanguage = useRef(currentLanguage);

  useEffect(() => {
    hasFetchedData.current = false;
  }, [tabId]);

  useEffect(() => {
    if (previousLanguage.current !== currentLanguage) {
      hasFetchedData.current = false;
      previousLanguage.current = currentLanguage;
    }
  }, [currentLanguage]);

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
    fieldConfigurations,
    tabId,
    expirationTimeInMinutes,
    localCache,
  ]);

  return { loading }; // Return the loading state
};

export default useTabDataFetch;
