import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPageStructure, fetchArgaamSectors } from "./services/screenerApi";
import { fetchFieldConfigurationData } from "./redux/features/fieldConfigurationSlice";
import { selectDefaultTab } from "./redux/selectors";
import { useParams } from "react-router-dom";
import { setPages } from "./redux/features/pageSlice.js";
import { strings } from "./utils/constants/localizedStrings";
import { setLanguage } from "./redux/features/languageSlice.js";
import useTabDataFetch from "./hooks/useTabDataFetch.jsx";
import { resetState } from "./redux/features/screenerDataSlice.js";
import config from "./utils/config.js";
import { setArgaamSectors } from "./redux/features/sectorSlice.js"; // Adjust the path to your slice

function App() {
  const dispatch = useDispatch();
  const currentLanguage = (state) => state.language.currentLanguage;
  const selectedTab = useSelector(selectDefaultTab);
  const { lang } = useParams();

  // Update language and page title without useEffect
  if (lang && lang !== currentLanguage) {
    dispatch(setLanguage(lang));
    strings.setLanguage(lang);
  }

  // Set dynamic page title based on language and selected tab
  document.title = strings.title;

  // Keydown event handler (no need for a separate useEffect for listener management)
  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey && event.key === "/") {
        event.preventDefault();
        dispatch(resetState());
        window.location.reload();
      }
    },
    [dispatch]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset state on reload based on config
  const handleResetState = useCallback(
    () => dispatch(resetState()),
    [dispatch]
  );

  if (config.refreshOnReload === 1) {
    window.addEventListener("beforeunload", handleResetState);
    React.useEffect(
      () => () => {
        window.removeEventListener("beforeunload", handleResetState);
      },
      [handleResetState]
    );
  }

  // Fetch page structure and field configuration only when component loads
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

  // Fetch Argaam sectors data on component mount
  const fetchSectors = useCallback(async () => {
    try {
      const fetchedSectors = await fetchArgaamSectors();
      dispatch(setArgaamSectors(fetchedSectors));
    } catch (error) {
      console.error("Error fetching Argaam sectors:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchSectors();
  }, [fetchSectors]);

  // Use the custom hook to handle tab data fetching
  const { loading } = useTabDataFetch(
    selectedTab.tabId,
    config.expirationInMinutes
  );

  return (
    <div className="App">
      {loading ? (
        <div className="spinner"></div> // Your loading spinner
      ) : (
        <AppRoutes />
      )}
    </div>
  );
}

export default App;
