import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import MultiSelectCheckbox from "./MultiSelect.jsx";
import { strings } from "../../utils/constants/localizedStrings.js";

const SectorDropdown = ({ selectedSectors, onChange }) => {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const sectors = useSelector(
    (state) => state.screener.sectors[currentLanguage]
  );
  const status = useSelector((state) => state.screener.loading);
  const error = useSelector((state) => state.screener.error);
  const [isSelect, setIsSelect] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(selectedSectors || []);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSelect(false); // Hide dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedOptions(selectedSectors || []);
  }, [selectedSectors]);

  const handleSelect = () => {
    setIsSelect(!isSelect);
  };

  const handleSelectedOptionsChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions); //pass selection from parent to child component
    onChange(newSelectedOptions); // Notify parent component of selection changes
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div className="sector_dropdown" ref={dropdownRef}>
      <div onClick={handleSelect} className="multi_select">
        <div
          className={
            isSelect ? "multi_select_toggle hover-class" : "multi_select_toggle"
          }
        >
          <img alt="Filter" src="/assets/images/filter.svg" /> {strings.sector}
        </div>
      </div>
      <div className="multi_select_container position-relative">
        {isSelect && (
          <MultiSelectCheckbox
            options={sectors}
            selectedOptions={selectedOptions}
            onChange={handleSelectedOptionsChange}
          />
        )}
      </div>
    </div>
  );
};

export default SectorDropdown;
