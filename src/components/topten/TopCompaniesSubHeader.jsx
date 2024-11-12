import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { localized } from "../../utils/localization";
import { PAGES } from "../../utils/constants/localizedStrings";
import ExportDropdown from "../common/ExportDropdown";
import PrintButton from "../common/PrintButton";
import { selectCurrentLanguage } from "../../redux/selectors";

const TopCompaniesSubHeader = ({
  title,
  tabLinksArray,
  activeTabLink,
  handleActiveTabLink,
  activeSubTabs,
}) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const user = useSelector((state) => state.user.user); // Access pages from Redux store
  const hasAccess = user?.HasScreenerChartsAccess == "true";
  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );
  const navigate= useNavigate()

  console.log(tabLinksArray)
  return (
    <div className="shadow_btm sub_header top_companies">
      {/* <div className="d-flex mt-4 mb-2 border_gray px-layout">
        <div className="flex-fill heading_lg">
          <strong>{title}</strong>
        </div>
        <div className="d-flex no-print">
          <PrintButton />
          <ExportDropdown
            activeTabLink={activeTabLink}
            pageId={PAGES.TOPTEN}
            activeSubTabs={activeSubTabs}
          />
        </div>
      </div> */}
      <div className="d-flex border_gray sub_heading_tabs_container px-layout pb-0">
        <div className="sub_heading_tabs">
          <div className="tabs_nav navbar-nav align-items-center flex-row">
            {tabLinksArray?.map((tabItem, index) => (
              <li className="nav-item" key={index}>
                <Link
                  to=""
                  className={`nav-link ${
                    activeTabLink === tabItem.tabLinkId ? "active" : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const isFreePage =
                      tabItem.tabLinkId == import.meta.env.VITE_FREEPAGESUBID;
                    if (hasAccess) {
                      handleActiveTabLink(
                        tabItem.tabLinkId,
                        tabItem.defaultSubTab
                      );
                    } else {
                      if (isFreePage) {  
                        handleActiveTabLink(
                          tabItem.tabLinkId,
                          tabItem.defaultSubTab
                        );
                      } else {
                        e.preventDefault();
                        navigate(`/${selectedLanguage}/request`);
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
        <div className="d-flex justify-content-end flex-fill text_right select_container P_relative">
          <div className="d-flex no-print">
            <PrintButton />
            <ExportDropdown
              activeTabLink={activeTabLink}
              pageId={PAGES.TOPTEN}
              activeSubTabs={activeSubTabs}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCompaniesSubHeader;
