import React, { Suspense, lazy, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import DefaultRedirect from "../common/DefaultRedirect";
import useLanguageSwitch from "../../hooks/useLanguageSwitch";
import LoadingScreen from "../common/LoadingScreen";
import ErrorBoundary from "../common/ErrorBoundary";
import LanguageProvider from "../../components/common/LanguageProvider";
import { RequestRedirect } from "../common/RequestRedirect";
import Request from "../Request";
import { TrialStatus } from "../common/TrialStatus";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { selectPages } from "../../redux/selectors";

// const ScreenerTablesPage = lazy(() => import("../../pages/ScreenerTablesPage"));
const TopTenCompaniesPage = lazy(() =>
  import("../../pages/TopTenCompaniesPage")
);

function AppRoutes() {
  const location = useLocation();
  const { lang } = useParams();
  const { switchLanguage } = useLanguageSwitch();
  const previousLang = useRef(lang);

  useEffect(() => {
    // Check if the language segment in the URL has changed
    if (previousLang.current && lang !== previousLang.current) {
      switchLanguage(previousLang.current, location.pathname);
      previousLang.current = lang; // Update the previous language
    }
  }, [lang, location, switchLanguage]);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Default Route Redirecting to default language Screener */}
          <Route path="/" element={<DefaultRedirect />} />
          <Route path="/:lang" element={<DefaultRedirect />} />
          <Route path="/:lang" element={<LanguageProvider />}>
            {/* <Route path="screener" element={<ScreenerTablesPage />} /> */}
            <Route
              // path={`argaam-50`}
              path={`argaam-100/:tabName`}
              element={
                <LockedPages>
                  <TopTenCompaniesPage />
                </LockedPages>
              }
            />
            <Route path="request" element={<Request />} />
          </Route>
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

// function LockedPages({ children }) {
//   const user = useSelector((state) => state.user.user);
//   const hasAccess = user?.HasArgaam100ChartsAccess === "true";

//   // if (!hasAccess) {
//   //   return <Navigate to={`/en/request`} replace />;
//   // }

//   return children;
// }

function LockedPages({ children }) {
  const { lang, tabName } = useParams(); // take the language and tab name from the url parameter
  const user = useSelector((state) => state.user.user);
  const pages = useSelector(selectPages); // select the page object

  // find the selected tab based on the tab name parameter
  const selectedTab = pages
    .flatMap((page) => page.sections)
    .flatMap((section) => section.tabs)
    .find(
      (tab) => tab.tabNameEn.toLowerCase() === tabName.replaceAll("-", " ")
    );

  // find the default tab based on the isSelected property
  const defaultTab = pages
    .flatMap((page) => page.sections)
    .flatMap((section) => section.tabs)
    .find((tab) => tab.isSelected);

  // flag to check if user has access
  const hasAccess = user?.HasArgaam100ChartsAccess === "true";

  // if the selected tab is not equal to the free page sub id config then redirect to default
  if (selectedTab) {
    const isFreePage =
      String(selectedTab?.tabId) === import.meta.env.VITE_FREEPAGESUBID;
    if (!isFreePage && !hasAccess) {
      return (
        <Navigate
          to={`/${lang}/argaam-100/${defaultTab?.tabNameEn.toLowerCase()}`}
          replace
        />
      );
    }
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <RequestRedirect />
      <TrialStatus />
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
  );
}
