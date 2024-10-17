import { Link, useParams } from "react-router-dom";
import { PAGES, TABS } from "../../utils/constants/localizedStrings";
import SectorDropdown from "../common/SectorDropdown";
import { localized } from "../../utils/localization";
import { useCallback } from "react";
import ExportDropdown from "../common/ExportDropdown";
import FinancialRatioMessage from "./FinancialRationMessage";
import LastUpdate from "./LastUpdate";
import PrintButton from "../common/PrintButton";
import useLanguage from "../../hooks/useLanguage";

const PageSubHeader = ({
  title,
  tabLinksArray,
  activeTabLink,
  handleActiveTabLink,
  onSelectedOptionsChange, // Pass this as a prop to handle changes in parent
  selectedOptions, // Pass selectedOptions here
  setSelectedOptions, // Receive setSelectedOptions here
}) => {
  const { lang } = useParams();
  const currentLanguage = useLanguage(lang);

  const handleSelectedOptionsChange = useCallback(
    (newSelectedOptions) => {
      setSelectedOptions(newSelectedOptions);
      if (onSelectedOptionsChange) {
        onSelectedOptionsChange(newSelectedOptions);
      }
    },
    [setSelectedOptions, onSelectedOptionsChange]
  );

  return (
    <div className="shadow_btm sub_header">
      {/* <div className="d-flex mt-4 mb-2 border_gray section_heading px-layout">
        <div className="flex-fill heading_lg">
          <strong>{title}</strong>
        </div>
        {activeTabLink !== TABS.S_FINANCIAL_RATIO && (
          <LastUpdate currentLanguage={currentLanguage} />
        )}
      </div> */}
      <div className="d-flex border_gray sub_heading_tabs_container px-layout pb-0">
        <div className="sub_heading_tabs">
          <div className="tabs_nav navbar-nav align-items-center flex-row">
            {tabLinksArray
              ?.sort((a, b) => a.displaySeq - b.displaySeq)
              .map((tabItem) => (
                <li className="nav-item" key={tabItem.tabLinkId}>
                  <Link
                    to="" // TODO: add a route for each tab on this...
                    className={`nav-link ${
                      activeTabLink === tabItem.tabLinkId ? "active" : ""
                    }`}
                    onClick={() => handleActiveTabLink(tabItem.tabLinkId)}
                  >
                    <span>{localized(tabItem, "name", currentLanguage)}</span>
                  </Link>
                </li>
              ))}
            {activeTabLink === TABS.S_FINANCIAL_RATIO && (
              <FinancialRatioMessage
                onChange={handleSelectedOptionsChange} // Pass the handler to update selected sectors
              />
            )}
          </div>
        </div>
        <div className="d-flex justify-content-end select_container flex-fill text_right">
          {/* Sector Dropdown */}
          <SectorDropdown
            selectedSectors={selectedOptions}
            onChange={handleSelectedOptionsChange}
          />

          <div className="d_flex">
            <PrintButton />
            <ExportDropdown
              activeTabLink={activeTabLink}
              pageId={PAGES.SCREENER}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSubHeader;
