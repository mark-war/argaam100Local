import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { strings, TABS } from "../../utils/constants/localizedStrings";
import SectorDropdown from "../common/SectorDropdown";
import { selectCurrentLanguage } from "../../redux/selectors";
import { localized } from "../../utils/localization";
import { setLanguage } from "../../redux/features/languageSlice";
import { useEffect, useCallback } from "react";

const PageSubHeader = ({
  title,
  tabLinksArray,
  activeTabLink,
  handleActiveTabLink,
  onSelectedOptionsChange, // Pass this as a prop to handle changes in parent
  selectedOptions, // Pass selectedOptions here
  setSelectedOptions, // Receive setSelectedOptions here
}) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const langParam = params.get("lang");

    if (langParam && langParam !== currentLanguage) {
      dispatch(setLanguage(langParam));
    }
  }, [location.search, currentLanguage, dispatch]);

  const getCurrentDateFormatted = useCallback(() => {
    const today = new Date();
    return today.toLocaleDateString(
      currentLanguage === "ar" ? "ar-SA" : "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        calendar: "gregory", // Ensure the Gregorian calendar is used
        numberingSystem: "latn", // Use Western Arabic numerals (0-9)
      }
    );
  }, [currentLanguage]);

  const dateNow = getCurrentDateFormatted();

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
      <div className="d-flex mt-4 mb-2 border_gray section_heading px-layout">
        <div className="flex-fill heading_lg">
          <strong>{title}</strong>
        </div>
        {/* Conditionally render the last update section when the selected tab is Financial Ratio. */}
        {activeTabLink !== TABS.S_FINANCIAL_RATIO && (
          <div className="flex-fill text_right mt-2">
            <p className="font-20 mb-0 date">
              {strings.date} {dateNow}
            </p>
          </div>
        )}
      </div>
      <div className="d-flex border_gray sub_heading_tabs_container px-layout pb-0">
        <div className="sub_heading_tabs">
          <div className="tabs_nav navbar-nav align-items-center flex-row">
            {tabLinksArray?.map((tabItem) => (
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
          </div>
        </div>
        <div className="d-flex justify-content-end select_container flex-fill text_right">
          {/* Sector Dropdown */}
          <SectorDropdown
            selectedSectors={selectedOptions}
            onChange={handleSelectedOptionsChange}
          />
          {/* <div className="d_flex">
            <a className="screen_icons" href="#">
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
            <a className="screen_icons" href="#">
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
                  <rect width="39" height="37" rx="4" stroke="none" />
                  <rect
                    x="0.15"
                    y="0.15"
                    width="38.7"
                    height="36.7"
                    rx="3.85"
                    fill="none"
                  />
                </g>
                <g
                  className="screen_icon_svg"
                  data-name="svgexport-10 (9)"
                  transform="translate(10.002 8.001)"
                >
                  <path
                    id="Path_65084"
                    data-name="Path 65084"
                    d="M2.828,2.813,14.952,1.082a.482.482,0,0,1,.551.477V21.664a.482.482,0,0,1-.55.477L2.827,20.41A.964.964,0,0,1,2,19.456V3.768a.964.964,0,0,1,.828-.955Zm13.638.119h3.858a.964.964,0,0,1,.964.964V19.327a.964.964,0,0,1-.964.964H16.467Zm-6.558,8.68,2.7-3.858H10.294l-1.543,2.2-1.543-2.2H4.893l2.7,3.858-2.7,3.858H7.208l1.543-2.2,1.543,2.2h2.315Z"
                    transform="translate(-1.999 -1.077)"
                    fill="#6d7f9b"
                  />
                </g>
              </svg>
            </a>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PageSubHeader;
