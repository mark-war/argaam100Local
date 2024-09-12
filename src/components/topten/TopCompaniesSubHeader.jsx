import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { localized } from "../../utils/localization";
import { printScreen } from "../../utils/printPage";
import { PAGES } from "../../utils/constants/localizedStrings";
import ExportDropdown from "../common/ExportDropdown";

const TopCompaniesSubHeader = ({
  title,
  tabLinksArray,
  activeTabLink,
  handleActiveTabLink,
  activeSubTabs,
}) => {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  console.log("ACTIVE SUB TABS: ", activeSubTabs);
  return (
    <div className="shadow_btm sub_header top_companies">
      {/* Info Starts */}
      <div className="d-flex mt-4 mb-2 border_gray px-layout">
        <div className="flex-fill heading_lg">
          <strong>{title}</strong>
        </div>
        <div className="d-flex">
          <a className="screen_icons" href="#" onClick={printScreen}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="39"
              height="37"
              viewBox="0 0 39 37"
            >
              <g
                className="screen_icon_border"
                data-name="Rectangle 28005"
                fill="#fff"
                stroke="#8193b0"
                strokeWidth="0.3"
              >
                <rect width="39" height="37" rx="4" stroke="none"></rect>
                <rect
                  x="0.15"
                  y="0.15"
                  width="38.7"
                  height="36.7"
                  rx="3.85"
                  fill="none"
                ></rect>
              </g>
              <g
                className="screen_icon_svg"
                data-name="Group 119068"
                transform="translate(8.001 8)"
              >
                <g id="Group_115638" data-name="Group 115638">
                  <path
                    id="Path_94942"
                    data-name="Path 94942"
                    d="M165.642,348.1H171.4a.665.665,0,1,1,0,1.33h-5.763a.665.665,0,0,1,0-1.33Zm0-2.1H171.4a.665.665,0,1,1,0,1.33h-5.763a.665.665,0,0,1,0-1.33Z"
                    transform="translate(-157.501 -336.688)"
                    fill="#6d7f9b"
                  ></path>
                  <path
                    id="Path_94943"
                    data-name="Path 94943"
                    d="M1.715,23.053H4.053V18.8a.735.735,0,0,1,.735-.735H17.257a.735.735,0,0,1,.735.735v4.253h2.338a1.716,1.716,0,0,1,1.715,1.715V32.16a1.716,1.716,0,0,1-1.715,1.715H17.991v3.944a.735.735,0,0,1-.735.735H4.787a.735.735,0,0,1-.735-.735V33.874H1.715A1.716,1.716,0,0,1,0,32.16V24.767A1.717,1.717,0,0,1,1.715,23.053Zm14.807-3.518h-11v3.518h11Zm-11,17.549h11V31.072h-11v6.012Zm-.735-9.717h1.87a.735.735,0,0,0,0-1.47H4.787a.735.735,0,0,0,0,1.47Z"
                    transform="translate(0 -18.065)"
                    fill="#6d7f9b"
                  ></path>
                </g>
              </g>
            </svg>
          </a>
          <ExportDropdown
            activeTabLink={activeTabLink}
            pageId={PAGES.TOPTEN}
            activeSubTabs={activeSubTabs}
          />
        </div>
      </div>
      {/* Info Ends */}

      {/* Tab Filter Starts */}

      {/* <ul className="tabs_nav navbar-nav align-items-center flex-row">
                  <li className="nav-item"><a href="/pe" className="nav-link active"><span>P/E</span></a></li>
                  <li className="nav-item"><a href="/financial-ratios" className="nav-link"><span>Financial Ratios</span></a></li>
                  <li className="nav-item"><a href="/performance-and-size" className="nav-link"><span>Performance And Size</span></a></li>
             </ul> */}

      <div className="d-flex border_gray sub_heading_tabs_container px-layout pb-0">
        <div className="sub_heading_tabs">
          <div className="tabs_nav navbar-nav align-items-center flex-row">
            {tabLinksArray?.map((tabItem, index) => (
              <li className="nav-item mb-2" key={index}>
                <Link
                  to="" // For P/E
                  className={`nav-link ${
                    activeTabLink === tabItem.tabLinkId ? "active" : ""
                  }`}
                  onClick={() =>
                    handleActiveTabLink(
                      tabItem.tabLinkId,
                      tabItem.defaultSubTab
                    )
                  }
                >
                  <span>{localized(tabItem, "name", currentLanguage)}</span>
                </Link>
              </li>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Filter Ends */}
    </div>
  );
};

export default TopCompaniesSubHeader;
