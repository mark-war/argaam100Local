import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { fetchScreenerData } from "../redux/features/fieldConfigurationSlice";
import {
  selectFieldConfigurations,
  selectCurrentLanguage,
  selectScreenerData,
} from "../redux/selectors";

const useTabDataFetch = (tabId) => {
  const dispatch = useDispatch();
  const fieldConfigurations = useSelector(selectFieldConfigurations);
  const currentLanguage = useSelector(selectCurrentLanguage);
  const screenerData = useSelector(selectScreenerData);

  const [loading, setLoading] = useState(false); // Add loading state
  const hasFetchedData = useRef(false);

  useEffect(() => {
    hasFetchedData.current = false;
  }, [tabId]);

  useEffect(() => {
    if (fieldConfigurations.length > 0 && tabId) {
      // Check if the data for the current tab and language already exists
      const existingData = screenerData?.find(
        (data) =>
          data.identifier.startsWith(tabId) &&
          data.identifier.endsWith(currentLanguage)
      );

      if (!existingData && !hasFetchedData.current) {
        const filteredConfigurations = fieldConfigurations.filter(
          (config) => config.TabID === tabId
        );

        setLoading(true); // Set loading to true when fetching starts

        dispatch(
          fetchScreenerData({ filteredConfigurations, currentLanguage })
        ).then(() => {
          setLoading(false); // Set loading to false when fetching completes
        });

        hasFetchedData.current = true; // Set the flag to prevent re-dispatch
      } else {
        console.log(
          "Data already exists for this tab and language, skipping fetch."
        );
      }
    }
  }, [dispatch, currentLanguage, fieldConfigurations, tabId, screenerData]);

  return { loading }; // Return the loading state
};

export default useTabDataFetch;
