import React from "react";
import { useSelector } from "react-redux";
import RequestProductDetails from "./RequestProductDetails";
import { strings } from "../../utils/constants/localizedStrings";
import MainLayout from "../layout/MainLayout";
// import RequestProductDetails from "./RequestProductDetails";

export default function Request() {
  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );
  return (
    <MainLayout>
      <div className=" min__height">
      

        <div className={`about ${selectedLanguage == "en" ? "" : "rtl"}`}>
       
          <RequestProductDetails />
        </div>
      </div>
    </MainLayout>
  );
}
