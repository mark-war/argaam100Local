import { Link, useNavigate, useParams } from "react-router-dom";
import { PAGES } from "../../utils/constants/localizedStrings";
import SectorDropdown from "../common/SectorDropdown";
import { localized } from "../../utils/localization";
import { useCallback } from "react";
import ExportDropdown from "../common/ExportDropdown";
import PrintButton from "../common/PrintButton";
import useLanguage from "../../hooks/useLanguage";
import { useDispatch, useSelector } from "react-redux";
import { settrialStatusModal } from "../../redux/features/userSlice";

const PageSubHeader = ({
  tabLinksArray,
  activeTabLink,
  handleActiveTabLink,
  onSelectedOptionsChange, // Pass this as a prop to handle changes in parent
  selectedOptions, // Pass selectedOptions here
  setSelectedOptions, // Receive setSelectedOptions here
}) => {
  const { lang } = useParams();
  const dispatch = useDispatch();
  const currentLanguage = useLanguage(lang);
  const user = useSelector((state) => state.user.user); // Access pages from Redux store
  const hasAccess = user?.HasScreenerChartsAccess == "true";

  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );

  const handleSelectedOptionsChange = useCallback(
    (newSelectedOptions) => {
      setSelectedOptions(newSelectedOptions);
      if (onSelectedOptionsChange) {
        onSelectedOptionsChange(newSelectedOptions);
      }
    },
    [setSelectedOptions, onSelectedOptionsChange]
  );
  const navigate = useNavigate();
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
                    onClick={(e) => {
                      e.preventDefault();
                      const isFreePage =
                        tabItem.tabLinkId == import.meta.env.VITE_FREEPAGESUBID;
                      if (hasAccess) {
                        handleActiveTabLink(tabItem.tabLinkId);
                      } else {
                        if (isFreePage) {
                          handleActiveTabLink(tabItem.tabLinkId);
                        } else {
                          if (
                            user?.IsScreenerTrialOrScreenerPackageExpired ==
                            "true"
                          ) {
                            dispatch(
                              settrialStatusModal({
                                visible: true,
                                status: 0,
                              })
                            );
                          } else {
                            e.preventDefault();
                            navigate(`/${selectedLanguage}/request`);
                          }
                        }
                      }
                    }}
                  >
                    <span>{localized(tabItem, "name", currentLanguage)}</span>
                  </Link>
                </li>
              ))}
          </div>
        </div>
        <div className="d-flex justify-content-end select_container flex-fill text_right P_relative">
          {/* Sector Dropdown */}
          <SectorDropdown
            selectedSectors={selectedOptions}
            onChange={handleSelectedOptionsChange}
          />

          <div className="d_flex no-print">
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
