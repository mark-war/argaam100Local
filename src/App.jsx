import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import usePageStructure from "./hooks/usePageStructure"; // New custom hook
import useFetchSectors from "./hooks/useFetchSectors"; // New custom hook
import useLanguage from "./hooks/useLanguage.jsx";
import store, { persistor } from "./redux/store.js";

function App() {
  const { lang } = useParams();

  // Use the custom hook to manage language setting
  useLanguage(lang);

  // fetch page structure and configuration loading
  usePageStructure();

  // fetch Argaam sectors on mount
  useFetchSectors();

  // ensures that the persisted data and local storage is cleared on initial mount
  useEffect(() => {
    const purgePersistedStore = async () => {
      store.dispatch({ type: "RESET_ALL_STATE" });
      await persistor.purge(); // Purge the store on initial load or every reload/refresh
      console.log("Persisted store purged.");
    };

    purgePersistedStore();
  }, []); // Empty dependency array ensures it only runs once on mount

  return <AppRoutes />;
}

export default App;
