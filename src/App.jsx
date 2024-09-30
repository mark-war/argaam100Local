import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { resetState } from "./redux/features/screenerDataSlice.js";
import config from "./utils/config.js";
import useTabDataFetch from "./hooks/useTabDataFetch.jsx";
import usePageStructure from "./hooks/usePageStructure"; // New custom hook
import useFetchSectors from "./hooks/useFetchSectors"; // New custom hook
import { selectDefaultTab } from "./redux/selectors.js";
import useLanguage from "./hooks/useLanguage.jsx";

function App() {
  const dispatch = useDispatch();
  const { lang } = useParams();
  const selectedTab = useSelector(selectDefaultTab);

  // Use the custom hook to manage language setting
  useLanguage(lang, true);

  // Custom hook to handle page structure and configuration loading
  usePageStructure();

  // Custom hook to fetch Argaam sectors on mount
  useFetchSectors();

  // Combined keydown and reload logic into a single effect
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
    const handleResetState = () => {
      dispatch(resetState());
      window.location.reload();
    };

    // Add keydown listener
    window.addEventListener("keydown", handleKeyDown);

    // Conditionally add beforeunload listener
    if (config.refreshOnReload === 1) {
      window.addEventListener("beforeunload", handleResetState);
    }

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (config.refreshOnReload === 1) {
        window.removeEventListener("beforeunload", handleResetState);
      }
    };
  }, [handleKeyDown, dispatch]);

  // Use the custom hook to handle tab data fetching
  const { loading } = useTabDataFetch(
    selectedTab?.tabId,
    config.expirationInMinutes
  );

  return (
    <div className="App">
      {loading ? <div className="spinner"></div> : <AppRoutes />}
    </div>
  );
}

export default App;
