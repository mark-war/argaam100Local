import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../../redux/selectors";
import SubSection from "./SubSection";

const TopCompaniesTable = ({
  selectedTab,
  data,
  isMultiple,
  onSubTabsChange,
}) => {
  const currentLanguage = useSelector(selectCurrentLanguage);

  const filterDataBySelectedTab = useCallback(
    (tab) => {
      return data.filter(
        (item) =>
          item.identifier.startsWith(tab) &&
          item.identifier.endsWith(currentLanguage)
      );
    },
    [data, currentLanguage]
  );

  const filteredData = useMemo(
    () => filterDataBySelectedTab(selectedTab),
    [selectedTab, filterDataBySelectedTab]
  );

  return (
    <div className="px-layout col_space mt-4 pt-1">
      <Row>
        {filteredData.map((subSection, index) => (
          <SubSection
            key={index}
            section={subSection}
            selectedTabKey={selectedTab}
            currentLanguage={currentLanguage}
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
