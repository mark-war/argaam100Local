import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  exportMultipleTabsToExcel,
  exportMultipleTabsToExcelTopTen,
  exportToExcel,
  exportToExcelTopTen,
} from "../../utils/exportToExcel";
import { fetchScreenerData } from "../../redux/features/screenerDataSlice";
import {
  selectCurrentLanguage,
  selectFieldConfigurations,
  selectDefaultLocalizedTabNameById,
  selectScreenerDataOfSelectedTab,
  selectTabIdsAndNamesForSection,
  selectTopTenData,
  selectLocalizedTabNameById,
  selectTopTenDataMultiple,
  // selectSubSectionsSubTabs,
} from "../../redux/selectors";
import {
  LANGUAGES,
  PAGES,
  SECTIONS,
  strings,
  TABS,
} from "../../utils/constants/localizedStrings";
// import {
//   addNewTopTenItem,
//   fetchMultipleTabTopTenData,
//   fetchSubTabData,
// } from "../../redux/features/topTenMultiTabSlice";

const ExportDropdown = (activeTabLink = {}) => {
  const currentPageId = activeTabLink.pageId;
  const selectedTab = activeTabLink.activeTabLink;
  const activeSubTabs = activeTabLink.activeSubTabs;

  const currentLanguage = useSelector(selectCurrentLanguage);
  const selectDataForTab = selectScreenerDataOfSelectedTab();
  const dataForSelectedTab = useSelector((state) =>
    selectDataForTab(state)(selectedTab, currentLanguage)
  );
  const fieldConfig = useSelector(selectFieldConfigurations);
  const activeTabName = useSelector(
    selectDefaultLocalizedTabNameById(selectedTab)
  );

  const activeTabNameScreener = useSelector(
    selectLocalizedTabNameById(
      PAGES.SCREENER,
      SECTIONS.STOCK_SCREENER,
      selectedTab
    )
  );

  const activeTabNameTopTen = useSelector(
    selectLocalizedTabNameById(
      PAGES.TOPTEN,
      SECTIONS.TOPTEN_COMPANIES,
      selectedTab
    )
  );

  const tabIdsAndNames = useSelector(
    selectTabIdsAndNamesForSection(
      currentPageId === PAGES.SCREENER
        ? SECTIONS.STOCK_SCREENER
        : SECTIONS.TOPTEN_COMPANIES
    )
  );
  const topTenData = useSelector(selectTopTenData);
  const topTenDataMultiple = useSelector(selectTopTenDataMultiple);

  // const mappedTopTenData = useSelector(
  //   selectSubSectionsSubTabs(selectedTab, currentLanguage)
  // );

  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown

  const fieldConfigMap = useMemo(() => {
    const map = {};
    fieldConfig.forEach((field) => {
      map[field.Pkey] = {
        nameEn: field.FieldNameEn,
        nameAr: field.FieldNameAr,
        unitEn: field.UnitNameEn,
        unitAr: field.UnitNameAr,
      };
    });
    return map;
  }, [fieldConfig]);

  const isMultiple =
    selectedTab === TABS.T_STOCK_PERFORMANCE ||
    selectedTab === TABS.T_GROWTH_AND_DIVIDENDS;

  const filterAndMapData = (data) => {
    if (!activeTabLink) return [];

    return data
      .filter(
        (item) =>
          item.identifier.startsWith(selectedTab) &&
          item.identifier.endsWith(`-${currentLanguage}`)
      )
      .map((item) => {
        const fieldId = item.identifier.split("-")[1];
        return {
          ...item,
          fieldNameEn: fieldConfigMap[fieldId]?.nameEn || fieldId,
          fieldNameAr: fieldConfigMap[fieldId]?.nameAr || fieldId,
          unitNameEn: fieldConfigMap[fieldId]?.unitEn || "",
          unitNameAr: fieldConfigMap[fieldId]?.unitAr || "",
        };
      });
  };

  const getFilteredData = (isMultiple) => {
    const data = isMultiple ? topTenDataMultiple : topTenData;
    return filterAndMapData(data);
  };

  const structuredTopTenData = getFilteredData(isMultiple);

  const handleExport = (option) => {
    setDropdownOpen(false); // Close dropdown after selection
    if (option === "current") {
      handleCurrentTabExport();
    } else {
      handleAllTabsExport();
    }
  };

  const handleCurrentTabExport = () => {
    if (currentPageId === PAGES.SCREENER) {
      exportToExcel(
        dataForSelectedTab,
        fieldConfig,
        selectedTab,
        currentLanguage,
        activeTabNameScreener,
        activeTabName
      );
    } else {
      exportToExcelTopTen(
        structuredTopTenData,
        currentLanguage,
        activeTabNameTopTen,
        activeTabNameTopTen,
        isMultiple,
        activeSubTabs
      );

      //fetchMissingTopTenMultiple(mappedTopTenData); //TODO: if required, should refactor this for isMultiple true
    }
  };

  // const fetchMissingTopTenMultiple = (mappedTopTenData) => {
  //   mappedTopTenData.map((subSection) => {
  //     subSection.mappedData.map((subTabItem, subTabIndex) => {
  //       if (subTabItem.data === undefined) {
  //         const encryptedConfigJson = subTabItem.subTab.encryptedConfigJson;
  //         dispatch(fetchSubTabData({ encryptedConfigJson }))
  //           .unwrap()
  //           .then((newData) => {
  //             // Dispatch action to add new data at the specific index
  //             dispatch(
  //               addNewTopTenItem({
  //                 sectionId: subSection.sectionId,
  //                 index: subTabIndex,
  //                 newItem: newData,
  //               })
  //             );
  //           })
  //           .catch((error) => {
  //             console.error("Failed to fetch sub-tab data:", error);
  //           });
  //       }
  //     });
  //     const filteredConfigurations = fieldConfig.filter(
  //       (config) => config.TabID === subSection.sectionId.split("-")[0]
  //     );
  //     dispatch(
  //       fetchMultipleTabTopTenData(filteredConfigurations, currentLanguage)
  //     )
  //       .unwrap()
  //       .then((latestTopTenData) => {
  //         exportToExcelTopTen(
  //           latestTopTenData,
  //           currentLanguage,
  //           "ArgaamScreener_TopTen",
  //           activeTabNameTopTen
  //         );
  //       });
  //   });

  //   exportToExcelTopTen(
  //     updatedDataForSectionTopTen,
  //     currentLanguage,
  //     "ArgaamScreener_TopTen",
  //     activeTabNameTopTen
  //   );
  // };

  const handleAllTabsExport = () => {
    if (currentPageId === PAGES.SCREENER) {
      const sectionTabs = tabIdsAndNames
        ?.sort((a, b) => a.displaySeq - b.displaySeq)
        .map((tab) => tab.tabId);
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
          "Screener"
        );
      });
    } else exportMultipleTabsToExcelTopTen();
  };

  // Function to handle the toggle of the dropdown
  const toggleDropdown = (event) => {
    event.stopPropagation(); // Prevent the click event from bubbling up
    setDropdownOpen((prev) => !prev);
  };

  // Use useEffect to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Bind the event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="export-dropdown no-print" ref={dropdownRef}>
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
        <div
          className="export-dropdown-menu"
          style={
            currentPageId === PAGES.TOPTEN && currentLanguage === LANGUAGES.EN
              ? { top: "50px" }
              : currentPageId === PAGES.TOPTEN &&
                currentLanguage === LANGUAGES.AR
              ? { top: "65px" }
              : {}
          }
        >
          <button onClick={() => handleExport("current")}>
            {strings.exportCurrent}
          </button>
          {/* <button
            className={currentPageId === PAGES.TOPTEN ? "disabled" : ""}
            onClick={() => handleExport("all")}
          >
            {strings.exportAllTabs}
          </button> */}
          {currentPageId !== PAGES.TOPTEN && (
            <button onClick={() => handleExport("all")}>
              {strings.exportAllTabs}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
