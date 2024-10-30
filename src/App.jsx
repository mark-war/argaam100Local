import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "./App.css";
import AppRoutes from "./components/routes/AppRoutes";
import useFetchSectors from "./hooks/useFetchSectors"; // New custom hook
import useLanguage from "./hooks/useLanguage.jsx";
import usePageStructure from "./hooks/usePageStructure"; // New custom hook
import {
  setrequestRedirectModal,
  setUser,
} from "./redux/features/userSlice.js";
import { redirectLogin, refreshToken, resetUser } from "./utils/authHelper.js";
import { isEmpty, parseJwt } from "./utils/helperFunctions.js";

function App() {
  const { lang } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  // Use the custom hook to manage language setting
  useLanguage(lang);

  // fetch page structure and configuration loading
  usePageStructure();

  // fetch Argaam sectors on mount
  useFetchSectors();

  useEffect(() => {
    debugger;
    if (!isEmpty(user)) {
      refreshToken()
        .then((hasExpired) => {
          debugger;
          // request redirect popup
          const urlParams = new URLSearchParams(window.location.search);
          const requestRedirect = urlParams.get("requestRedirect");
          window.history.replaceState(null, '', window.location.pathname);
          if (requestRedirect == "true") {
            dispatch(setrequestRedirectModal(true));
          }
        })
        .catch((err) => {
          debugger;
          resetUser(false);
          redirectLogin(true);
        });
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const refreshToken = urlParams.get("refreshToken");
      const uniqueIdentifier = urlParams.get("uniqueIdentifier");
      const removeAutoRedirect = urlParams.get("removeAutoRedirect");
      const email = urlParams.get("email");

      // console.log(token, "tokenn");
      if (!isEmpty(token)) {
        localStorage.setItem("jwtToken", token.replaceAll(" ", "+"));
        localStorage.setItem("refreshToken", refreshToken.replaceAll(" ", "+"));
        localStorage.setItem("uniqueIdentifier", uniqueIdentifier);

        urlParams.delete("token");
        urlParams.delete("refreshToken");
        urlParams.delete("uniqueIdentifier");
        
        // const splittokens = token.split(".");
        const parsedToken = parseJwt(token.replaceAll(" ", "+"));
        let parsedUser = {
          ...parsedToken,
        };
        dispatch(setUser(parsedUser));

        const requestRedirect = urlParams.get("requestRedirect");
        window.history.replaceState(null, '', window.location.pathname);
        if (requestRedirect == "true") {
          dispatch(setrequestRedirectModal(true));
          return;
        }
      } else if (!isEmpty(removeAutoRedirect)) {
        urlParams.delete("removeAutoRedirect");
        urlParams.delete("email");

        const requestRedirect = urlParams.get("requestRedirect");
        window.history.replaceState(null, '', window.location.pathname);
        if (requestRedirect == "true") {
          dispatch(setrequestRedirectModal(true));
          return;
        }
      }
    }
  }, []);

  return <AppRoutes />;
}

export default App;
