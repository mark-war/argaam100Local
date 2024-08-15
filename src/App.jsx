import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFieldConfigurationData } from "./redux/features/fieldConfigurationSlice";
import { fetchScreenerData } from "./redux/features/fieldConfigurationSlice";

function App() {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const fieldConfigurations = useSelector(
    (state) => state.fieldConfiguration || []
  );

  useEffect(() => {
    dispatch(fetchFieldConfigurationData());
  }, [dispatch]);

  useEffect(() => {
    if (fieldConfigurations.length > 0) {
      dispatch(fetchScreenerData({ fieldConfigurations, currentLanguage }));
    }
  }, [dispatch, currentLanguage, fieldConfigurations]);

  return (
    <div className="App">
      <AppRoutes />
    </div>
  );
}

export default App;
