import React, { Suspense, lazy, useEffect, useRef } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import DefaultRedirect from "../DefaultRedirect";
import useLanguageSwitch from "../../hooks/useLanguageSwitch";
import LoadingScreen from "../LoadingScreen";
import ErrorBoundary from "../ErrorBoundary";

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
          {/* Route to available Pages */}
          <Route path="/:lang/screener" element={<ScreenerTablesPage />} />
          <Route path="/:lang/top-10" element={<TopTenCompaniesPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
