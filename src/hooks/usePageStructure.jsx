import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { fetchPageStructure } from "../services/screenerApi";
import { setPages } from "../redux/features/pageSlice";
import { fetchFieldConfigurationData } from "../redux/features/fieldConfigurationSlice";

const usePageStructure = () => {
  const dispatch = useDispatch();

  const loadData = useCallback(async () => {
    try {
      const response = await fetchPageStructure();
      if (response?.data?.pages) {
        dispatch(setPages(response.data.pages));
      } else {
        console.error("Unexpected API response structure");
      }
      await dispatch(fetchFieldConfigurationData()).unwrap();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);
};

export default usePageStructure;
