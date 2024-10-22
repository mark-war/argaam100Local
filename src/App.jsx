import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";
import React, { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { resetState } from "./redux/features/screenerDataSlice.js";
import config from "./utils/config.js";
import useTabDataFetch from "./hooks/useTabDataFetch.jsx";
import usePageStructure from "./hooks/usePageStructure"; // New custom hook
import useFetchSectors from "./hooks/useFetchSectors"; // New custom hook
import { selectDefaultTab } from "./redux/selectors.js";
import useLanguage from "./hooks/useLanguage.jsx";
import { strings } from "./utils/constants/localizedStrings.js";
import { persistor } from "./redux/store.js";

function App() {
  // const dispatch = useDispatch();
  const { lang } = useParams();
  // const selectedTab = useSelector(selectDefaultTab);

  // Use the custom hook to manage language setting
  useLanguage(lang);

  // Custom hook to handle page structure and configuration loading
  usePageStructure();

  // Custom hook to fetch Argaam sectors on mount
  useFetchSectors();

  useEffect(() => {
    const purgePersistedStore = async () => {
      await persistor.purge(); // Purge the store on every load
      console.log("Persisted store purged.");
    };

    purgePersistedStore();
  }, []); // Empty dependency array ensures it only runs once on mount

  return <AppRoutes />;
}

export default App;
