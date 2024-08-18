import React from "react";
import useLanguageDetection from "../../hooks/useLanguageDetection";
import { Outlet } from "react-router-dom";

const LanguageProvider = () => {
  useLanguageDetection();
  return <Outlet />; // Renders child routes
};

export default LanguageProvider;
