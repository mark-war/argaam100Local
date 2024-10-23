import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import LoadingScreen from "./components/common/LoadingScreen";

// Function to detect if it's the first load
const isInitialLoad = () => {
  const firstLoadFlag = localStorage.getItem("isFirstLoad");
  if (!firstLoadFlag) {
    localStorage.setItem("isFirstLoad", "true");
    return true;
  }
  return false;
};

// Clear the persisted store if it's the first load
const clearPersistedStoreIfFirstLoad = async () => {
  if (isInitialLoad()) {
    await persistor.purge();
    console.log("Persisted store has been purged on initial load.");
  }
};

const renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
};

// Call the function to clear the store, then render the app
clearPersistedStoreIfFirstLoad().then(() => {
  renderApp(); // Ensure rendering happens only after the purge
});

reportWebVitals();
