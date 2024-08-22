import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPageStructure } from "./services/screenerApi";
import { fetchFieldConfigurationData } from "./redux/features/fieldConfigurationSlice";
import { selectSelectedTab } from "./redux/selectors";
import { useParams } from "react-router-dom";
import { setApiData } from "./redux/features/apiDataSlice.js";
import { strings } from "./utils/constants/localizedStrings";
import { setLanguage } from "./redux/features/languageSlice.js";
import useTabDataFetch from "./hooks/useTabDataFetch.jsx";
import { resetState } from "./redux/features/fieldConfigurationSlice.js";
import config from "./utils/config.js";

function App() {
  const dispatch = useDispatch();
  const currentLanguage = (state) => state.language.currentLanguage;
  const selectedTab = useSelector(selectSelectedTab);
  const { lang } = useParams();

  // Set dynamic page title
  useEffect(() => {
    const title = strings.title;
    document.title = title;
  }, [currentLanguage, selectedTab]);

  // Add event listener for key combination to reset state
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "/") {
        // Check for Ctrl+R combination
        event.preventDefault(); // Prevent the default browser refresh action
        dispatch(resetState()); // Dispatch the resetState action
        window.location.reload(); // Reload the page to re-initialize the app
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dispatch]);

  //for refreshing data fetch
  useEffect(() => {
    if (config.refreshOnReload === 1) {
      const handleResetState = () => {
        dispatch(resetState());
      };
      window.addEventListener("beforeunload", handleResetState());

      return () => {
        window.removeEventListener("beforeunload", handleResetState());
      };
    }
  }, [dispatch]);

  useEffect(() => {
    if (lang && lang !== currentLanguage) {
      dispatch(setLanguage(lang));
      strings.setLanguage(lang);
    }
  }, [lang, currentLanguage, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchPageStructure();
        if (response && response.data && response.data.pages) {
          dispatch(setApiData(response.data.pages));
        } else {
          console.error("Unexpected API response structure");
        }
        await dispatch(fetchFieldConfigurationData()).unwrap();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, [dispatch]);

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
