import React, { Suspense, lazy, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import DefaultRedirect from "../common/DefaultRedirect";
import useLanguageSwitch from "../../hooks/useLanguageSwitch";
import LoadingScreen from "../common/LoadingScreen";
import ErrorBoundary from "../common/ErrorBoundary";
import LanguageProvider from "../../components/common/LanguageProvider";
import { RequestRedirect } from "../common/RequestRedirect";
import Request from "../Request";
import { TrialStatus } from "../common/TrialStatus";

const ScreenerTablesPage = lazy(() => import("../../pages/ScreenerTablesPage"));
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
            <Route path="screener" element={<ScreenerTablesPage />} />
            <Route path="top-10" element={<TopTenCompaniesPage />} />
            <Route path="request" element={<Request />} />
          </Route>
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RequestRedirect />
      <TrialStatus />
      <AppRoutes />
    </BrowserRouter>
  );
}
