import React, { useCallback, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import SubTab from "./SubTab";
import SubTabCard from "./SubTabCard";
import { localized } from "../../utils/localization";
import { useDispatch } from "react-redux";
import {
  addNewTopTenItem,
  fetchSubTabData,
} from "../../redux/features/topTenMultiTabSlice";

const SubSection = ({
  section,
  selectedTabKey,
  currentLanguage,
  isMultiple,
  onSubTabsChange,
  subSectionIndex,
}) => {
  const dispatch = useDispatch();
  const [activeSubTab, setActiveSubTab] = useState(() => {
    const activeTab = section.subTabs.find((tab) => tab.isSelected === "1");
    return activeTab.originalIndex;
  });

  const sortedSubTabs = [...section.subTabs].sort(
    (a, b) => Number(a.displaySeq) - Number(b.displaySeq)
  );
  const [loading, setLoading] = useState({});

  useEffect(() => {
    setActiveSubTab(0); // Reset to the first tab (index 0) when selectedTabKey changes or current language changes
  }, [selectedTabKey, currentLanguage]);

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

  const sectionKey = Number(section.identifier.split("-")[1]);

  const handleSubTabClick = useCallback(
    (newSubTabIndex) => {
      setActiveSubTab(newSubTabIndex);

      onSubTabsChange(subSectionIndex, newSubTabIndex);

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
    <Col lg={6} key={sectionKey}>
      <div className="tabs_inner_nav row px-3">
        <div className="col-6">
          <p className="sub_heading">
            {localized(section, "fieldName", currentLanguage)}{" "}
            <span className="unit">
              {localized(section, "unitName", currentLanguage)}
            </span>{" "}
            <span className="notes">
              {localized(section, "notes", currentLanguage)}
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
