import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import MultiSelectCheckbox from "./MultiSelect.jsx";
import { strings } from "../../utils/constants/localizedStrings.js";

const SectorDropdown = ({ selectedSectors, onChange }) => {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage
  );
  const langSectors = useSelector(
    (state) => state.screener.sectors[currentLanguage]
  );
  const sectors = useSelector((state) => state.screener.sectors);
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
  }, [dropdownRef]);

  useEffect(() => {
    setSelectedOptions(selectedSectors || []);
  }, [selectedSectors]);

  useEffect(() => {
    if (isSelect && dropdownRef.current) {
      const input = dropdownRef.current.querySelector(".search-input");
      if (input) {
        input.focus(); // Focus on the search textbox when dropdown is opened
      }
    }
  }, [isSelect]);

  // const handleSelect = () => {
  //   setIsSelect(!isSelect);
  // };

  const handleSelect = () => {
    setIsSelect((prev) => !prev);
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
            options={langSectors}
            fullOptions={sectors}
            selectedOptions={selectedOptions}
            onChange={handleSelectedOptionsChange}
          />
        )}
      </div>
    </div>
  );
};

export default SectorDropdown;
