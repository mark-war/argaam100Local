import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScreenerTablesPage from "../../pages/ScreenerTablesPage";
import TopTenCompaniesPage from "../../pages/TopTenCompaniesPage";
import DefaultRedirect from "../DefaultRedirect";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route Redirecting to default language Screener */}
        <Route path="/" element={<DefaultRedirect />} />
        {/* <Route path="/:lang" element={<DefaultRedirect />} /> */}
        {/* Route to available Pages */}
        <Route path="/:lang/screener" element={<ScreenerTablesPage />} />
        <Route path="/:lang/top-10" element={<TopTenCompaniesPage />} />
      </Routes>
    </BrowserRouter>
  );
}
