import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import MultiSelectCheckbox from "./MultiSelect.jsx";
import { strings } from "../../utils/constants/localizedStrings.js";
import PropTypes from "prop-types";

const SectorDropdown = ({ selectedSectors, onChange }) => {
  const { lang, langSectors, sectors, status, error } = useSelector(
    (state) => ({
      lang: state.language.currentLanguage,
      langSectors: state.screener.sectors[state.language.currentLanguage],
      sectors: state.screener.sectors,
      status: state.screener.loading,
      error: state.screener.error,
    })
  );

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

  useEffect(() => {
    if (isSelect && dropdownRef.current) {
      const input = dropdownRef.current.querySelector(".search-input");
      if (input) input.focus(); // Focus on the search textbox when dropdown is opened
    }
  }, [isSelect]);

  const handleSelect = () => setIsSelect((prev) => !prev);

  const handleSelectedOptionsChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions); //pass selection from parent to child component
    onChange(newSelectedOptions); // Notify parent component of selection changes
  };

  const handleRefresh = () => {
    setSelectedOptions([]); // Clear the selected options
    onChange([]); // Notify parent component of the cleared selection
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <>
      {selectedOptions.length > 0 && (
        <button
          //TODO: add refresh icon
          onClick={handleRefresh} // Handle refresh click
          className="clear-button reset__button"
        >
          <span>{strings.reset}</span>
          <img
            width="15"
            src="https://tools.argaam.com/content/images/refresh.png"
          />
        </button>
      )}
      <div className="sector_dropdown" ref={dropdownRef}>
        <div onClick={handleSelect} className="multi_select">
          <div
            className={`multi_select_toggle ${isSelect ? "hover-class" : ""}`}
          >
            <img alt="Filter" src="/assets/images/filter.svg" />{" "}
            {strings.sector}
          </div>
        </div>
        <div className="multi_select_container position-relative">
          {isSelect && (
            <MultiSelectCheckbox
              options={langSectors}
              fullOptions={sectors}
              selectedOptions={selectedOptions}
              onChange={handleSelectedOptionsChange}
              currentLanguage={lang}
            />
          )}
        </div>
      </div>
    </>
  );
};

SectorDropdown.propTypes = {
  selectedSectors: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

export default SectorDropdown;
