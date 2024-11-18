import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { Row } from "react-bootstrap";
import SubSection from "./SubSection";
import useLanguage from "../../hooks/useLanguage";
import { useParams } from "react-router-dom";

const TopCompaniesTable = ({
  selectedTab,
  data,
  isMultiple,
  onSubTabsChange,
}) => {
  const { lang } = useParams(); // Access the current language from URL parameters

  useLanguage(lang);

  const filterDataBySelectedTab = useCallback(
    (tab) => {
      return data.filter(
        (item) =>
          item.identifier.startsWith(tab) && item.identifier.endsWith(lang)
      );
    },
    [data, lang]
  );

  const filteredData = useMemo(
    () => filterDataBySelectedTab(selectedTab),
    [selectedTab, filterDataBySelectedTab]
  );

  return (
    <div className="px-layout col_space pt-1">
      <Row>
        {filteredData.map((subSection, index) => (
          <SubSection
            key={index}
            section={subSection}
            selectedTabKey={selectedTab}
            currentLanguage={lang}
            isMultiple={isMultiple}
            onSubTabsChange={onSubTabsChange}
            subSectionIndex={index} // Pass the index as subSectionIndex
          />
        ))}
      </Row>
    </div>
  );
};

TopCompaniesTable.propTypes = {
  selectedTab: PropTypes.number.isRequired, // Specify that selectedTab is a required string
  data: PropTypes.arrayOf(PropTypes.object).isRequired, // Specify that data is a required array of objects
  isMultiple: PropTypes.bool.isRequired,
};

export default TopCompaniesTable;
