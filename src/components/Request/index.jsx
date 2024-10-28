import React from "react";
import { useSelector } from "react-redux";
// import RequestProductDetails from "./RequestProductDetails";

export default function Request() {
  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );
  return (
    <div className={`about ${selectedLanguage == "en" ? "" : "rtl"}`}>
      {/* <RequestProductDetails /> */}
    </div>
  );
}
