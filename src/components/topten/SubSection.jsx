import React, { useCallback, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { SUBSECTIONS } from "../../utils/constants/localizedStrings";
import SubTab from "./SubTab";
import SubTabCard from "./SubTabCard";
import { localized } from "../../utils/localization";
import { useDispatch } from "react-redux";
import {
  addNewTopTenItem,
  fetchSubTabData,
} from "../../redux/features/topTenMultiTabSlice";

const SubSection = ({ section, currentLanguage, isMultiple }) => {
  const dispatch = useDispatch();
  const [activeSubTab, setActiveSubTab] = useState(() => {
    const activeTab = section.subTabs.find((tab) => tab.isSelected === "1");
    return activeTab.originalIndex;
  });

  const sortedSubTabs = [...section.subTabs].sort(
    (a, b) => Number(a.displaySeq) - Number(b.displaySeq)
  );
  const [loading, setLoading] = useState({});

  const withPercentageLabels = [
    SUBSECTIONS.THE_HIGHEST,
    SUBSECTIONS.THE_LOWEST,
    SUBSECTIONS.RET_SH,
    SUBSECTIONS.IND_OVER_SH,
    SUBSECTIONS.NET_PROF_MARGIN,
    SUBSECTIONS.TOT_PROF_MARGIN,
    SUBSECTIONS.HIGHEST_RET,
  ];

  useEffect(() => {
    setActiveSubTab(0); // Reset to the first tab (index 0) when selectedTabKey changes
  }, [section.identifier.split("-")[0]]);

  const fetchAndUpdateData = (encryptedConfigJson, identifier, index) => {
    setLoading((prevLoading) => ({
      ...prevLoading,
      [identifier]: true, // Track loading per identifier
    }));

    return dispatch(fetchSubTabData({ encryptedConfigJson }))
      .unwrap()
      .then((newData) => {
        // Dispatch action to add new data at the specific index
        dispatch(
          addNewTopTenItem({
            sectionId: identifier,
            index,
            newItem: newData,
          })
        );
      })
      .catch((error) => {
        console.error("Failed to fetch sub-tab data:", error);
      })
      .finally(() => {
        // Ensure identifier exists in state before updating
        setLoading((prevLoading) => {
          if (prevLoading[identifier] !== undefined) {
            return {
              ...prevLoading,
              [identifier]: false,
            };
          }
          return prevLoading;
        });
      });
  };

  const handleSubTabClick = useCallback(
    (newSubTabIndex) => {
      setActiveSubTab(newSubTabIndex);

      if (isMultiple && !section.data[newSubTabIndex]) {
        const encryptedConfigJson =
          section.subTabs[newSubTabIndex].encryptedConfigJson;
        const identifier = section.identifier;
        fetchAndUpdateData(encryptedConfigJson, identifier, newSubTabIndex);
      }
    },
    [section.data]
  );

  // Render the sub-section's content based on whether it has multiple tabs
  return (
    <Col lg={6} key={section.key}>
      <div className="tabs_inner_nav row px-3">
        <div className="col-6">
          <p className="sub_heading">
            {localized(section, "fieldName", currentLanguage)}{" "}
            <span>
              {withPercentageLabels.includes(Number(section.key)) ? "%" : ""}
            </span>
          </p>
        </div>
        <div className="col-6">
          <div className="flex-fill justify-content-end">
            <ul className="tabs_nav tabs_inner navbar-nav align-items-center flex-row justify-content-end">
              {sortedSubTabs.map((subTab) => {
                return (
                  <SubTab
                    key={subTab.originalIndex} // Add a unique key here
                    subTab={subTab}
                    currentLanguage={currentLanguage}
                    isActive={activeSubTab === subTab.originalIndex}
                    subTabClick={handleSubTabClick}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <SubTabCard
        section={section}
        withHistoricalTab={true}
        isHistoricalTab={!isMultiple && activeSubTab === 1 ? true : false}
        currentLanguage={currentLanguage}
        isMultiple={isMultiple}
        loadingState={loading}
        activeSubTab={activeSubTab}
      />
    </Col>
  );
};

export default SubSection;
