import React, { useEffect, useState } from "react";
import HeaderMain from "./HeaderMain";
import FooterMain from "./FooterMain";
import { useSelector, useDispatch } from "react-redux";
import { strings } from "../../utils/constants/localizedStrings";
import { fetchPageStructure } from "../../services/screenerApi.js"; // Import your data fetching function
import { setApiData } from "../../redux/features/apiDataSlice.js";
import { setLanguage } from "../../redux/features/languageSlice.js";
import { useParams } from "react-router-dom";

export default function MainLayout({ children }) {
  const { lang } = useParams(); // Get language parameter from URL
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const dispatch = useDispatch();

  // Update the language if it's different from the current language
  useEffect(() => {
    if (lang && lang !== currentLanguage) {
      dispatch(setLanguage(lang));
      strings.setLanguage(lang); // Update strings for the new language
    }
  }, [lang, currentLanguage, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchPageStructure(); // Fetch data
        if (response && response.data && response.data.pages) {
          dispatch(setApiData(response.data.pages)); // Set data in Redux
        } else {
          console.error("Unexpected API response structure");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    loadData();
  }, [dispatch]);

  return (
    <>
      <HeaderMain />
      {children}
      <FooterMain />
    </>
  );
}
