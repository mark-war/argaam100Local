import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/store";
import LoadingScreen from "./components/common/LoadingScreen";
import { getAccessToken, redirectLogin } from "./utils/authHelper";
import { isEmpty } from "./utils/helperFunctions";

const renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    // <React.StrictMode>
    <AppIn />
    // </React.StrictMode>
  );
};

const AppIn = () => {
  const [startApp, setstartApp] = useState(false);

  useEffect(() => {
    const accessToken = getAccessToken();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const removeAutoRedirect = urlParams.get("removeAutoRedirect");
    if (isEmpty(token) && isEmpty(removeAutoRedirect) && isEmpty(accessToken)) {
      redirectLogin(true);
    } else {
      setstartApp(true);
    }
  }, []);

  if (!startApp) {
    return;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

renderApp();
reportWebVitals();
