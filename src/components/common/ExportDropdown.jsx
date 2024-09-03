import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  exportMultipleTabsToExcel,
  exportToExcel,
} from "../../utils/exportToExcel";
import { fetchScreenerData } from "../../redux/features/fieldConfigurationSlice";
import {
  selectCurrentLanguage,
  selectFieldConfigurations,
  selectLocalizedTabNameById,
  selectScreenerDataOfSelectedTab,
  selectTabIdsAndNamesForSection,
} from "../../redux/selectors";
import { SECTIONS } from "../../utils/constants/localizedStrings";

const ExportDropdown = (activeTabLink = {}) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const selectDataForTab = selectScreenerDataOfSelectedTab();
  const dataForSelectedTab = useSelector((state) =>
    selectDataForTab(state)(activeTabLink.activeTabLink, currentLanguage)
  );
  const fieldConfig = useSelector(selectFieldConfigurations);
  const activeTabName = useSelector(
    selectLocalizedTabNameById(activeTabLink.activeTabLink)
  );
  const tabIdsAndNames = useSelector(
    selectTabIdsAndNamesForSection(SECTIONS.STOCK_SCREENER)
  );

  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleExport = (option) => {
    setDropdownOpen(false); // Close dropdown after selection
    if (option === "current") {
      handleCurrentTabExport();
    } else {
      handleAllTabsExport();
    }
  };
  console.log("TAB ID: ", activeTabLink.activeTabLink);
  console.log("TAB NAME: ", activeTabLink.activeTabName);
  const handleCurrentTabExport = () => {
    exportToExcel(
      dataForSelectedTab,
      fieldConfig,
      activeTabLink.activeTabLink,
      currentLanguage,
      "ArgaamScreener",
      activeTabName
    );
  };

  const handleAllTabsExport = () => {
    const sectionTabs = tabIdsAndNames.map((tab) => tab.tabId);

    const filteredConfigurations = fieldConfig.filter((config) =>
      sectionTabs.includes(config.TabID)
    );

    dispatch(
      fetchScreenerData({ filteredConfigurations, currentLanguage })
    ).then((action) => {
      const updatedDataForSection = action.payload;
      exportMultipleTabsToExcel(
        updatedDataForSection,
        filteredConfigurations,
        tabIdsAndNames,
        currentLanguage,
        "ArgaamScreener_Multiple"
      );
    });
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <div className="export-dropdown">
      <a className="screen_icons" href="#" onClick={toggleDropdown}>
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
      {dropdownOpen && (
        <div className="export-dropdown-menu">
          <button onClick={() => handleExport("current")}>
            Export Current Tab
          </button>
          <button onClick={() => handleExport("all")}>Export All Tabs</button>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
