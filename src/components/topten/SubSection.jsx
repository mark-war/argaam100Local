import React, { useCallback, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import SubTab from "./SubTab";
import SubTabCard from "./SubTabCard";
import { localized } from "../../utils/localization";
import { useDispatch, useSelector } from "react-redux";
import {
  addNewTopTenItem,
  fetchSubTabData,
} from "../../redux/features/topTenMultiTabSlice";
import { strings, TABS } from "../../utils/constants/localizedStrings";
import { selectCurrentLanguage } from "../../redux/selectors";
import ReactModal from "react-modal";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import Tooltip from "../common/Tooltip";

function PopupTooltip({ isOpen, onRequestClose, type, isTopGrowthRevenueChart }) {
  const lang = useSelector(selectCurrentLanguage);
  const isTopGrowthChart = type === "Top Growth Companies";
  const isTopLoosingChart = type === "Top Losing Companies";


  const getTextList = () => {
    if (isTopGrowthChart) {
      if (isTopGrowthRevenueChart) {
        return [
          strings.growthtooltiptext6,
          strings.growthtooltiptext7,
        ];
      } else {
        return [
          // strings.growthtooltiptext5,
          strings.growthtooltiptext6,
          strings.growthtooltiptext7,
          strings.growthtooltiptext8,
        ];
      }
    } else if(isTopLoosingChart) {
      return [
        // strings.loosinggrowthtooltiptext5,
        strings.loosinggrowthtooltiptext6,
        strings.loosinggrowthtooltiptext7,
        strings.loosinggrowthtooltiptext8,
      ];
    }else{
      return [];
    }
  }

  const textList = getTextList();

  useScrollbarVisibility(isOpen);
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={isOpen}
      className={
        lang == "en" ? "copylinkltr growthcom" : "copylinkrtl growthcom"
      }
      onRequestClose={onRequestClose}
      style={{
        content: {
          zIndex: 99999,
          width: "30%",
          height: "100px",
          direction: lang == "en" ? " ltr" : " rtl",
          top: "50% !important",
        },
      }}
    >
      <a className="closeIcon closeIconfill" onClick={onRequestClose}></a>

      {/* {isTopGrowthChart && (
        <h2 className="growthHead">{strings.definitions}</h2>
      )} */}
      <div className="topgrowthcompanies">
        {/* {isTopGrowthChart && (
          <>
            <span className="bar"></span>
            <p>{strings.growthtooltiptext1}</p>
            <p>{strings.growthtooltiptext2}</p>
            <p>{strings.growthtooltiptext3}</p>
           
          </>
        )} */}
        {/* <h5>{strings.growthtooltiptext4}</h5>{" "} */}
        <ul>
          {textList.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </div>
    </ReactModal>
  );
}

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


  let sortedSubTabs = [...section.subTabs].sort(
    (a, b) => Number(a.displaySeq) - Number(b.displaySeq)
  );



  const [loading, setLoading] = useState({});
  const [modalOpen, setmodalOpen] = useState(false);
  const note = localized(section, "notes", currentLanguage);
  const tabNote =
    sortedSubTabs[activeSubTab]?.[
    currentLanguage == "en" ? "tabNoteEn" : "tabNoteAr"
    ];

  // useEffect(() => {
  //   setActiveSubTab(0); // Reset to the first tab (index 0) when selectedTabKey changes or current language changes
  // }, [selectedTabKey, currentLanguage]);

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

  const isTopGrowthChart = section?.fieldNameEn === "Top Growth Companies";
  const isTopLoosingChart = section?.fieldNameEn === "Top Losing Companies";
  const isTopGrowthRevenueChart = section?.tabID == "12" && section?.pkey == "35" ? true : false;


  // Render the sub-section's content based on whether it has multiple tabs
  return (
    <Col lg={6} key={sectionKey}>
      <div className="tabs_inner_nav row px-3">
        <div className="col-6 col-sm-7">
          <p className="sub_heading">
            <span className="first_heading">{localized(section, "fieldName", currentLanguage)}{" "}</span>
            {selectedTabKey === TABS.T_RANKING && (activeSubTab !== 1 && activeSubTab !== 0) ? null : (
              <span className="unit">
                {localized(section, "unitName", currentLanguage)}
              </span>
            )}
            {(isTopGrowthChart || isTopLoosingChart) && (
              <>
                <PopupTooltip
                  isOpen={modalOpen}
                  type={section?.fieldNameEn}
                  isTopGrowthRevenueChart={isTopGrowthRevenueChart}
                  onRequestClose={() => setmodalOpen(false)}
                />
                    <div className="textComment_iconPane"
               style={{ position: "relative", display: "inline-block" }}>
                 <i
                  data-tooltip-id={"tooltip"}
                  className="textComment_icon"
                  onClick={() => setmodalOpen(true)}
                ></i> </div>
              </>
            )}

            {note ? (
              <Tooltip tooltipText={note}>
                <i className="textComment_icon"></i>
              </Tooltip>
            ) : null}

            {tabNote && (
              <span
                className={`notes ${isTopGrowthChart || isTopLoosingChart ? 'growth-loose-note' : ''}`}
                title={tabNote}
              >
                {tabNote}
              </span>
            )}



          </p>
        </div>
        <div className="col-6 col-sm-5">
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
