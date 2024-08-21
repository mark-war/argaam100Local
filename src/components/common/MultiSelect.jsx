import React, { useState, useRef } from "react";
import { strings } from "../../utils/constants/localizedStrings";

const MultiSelect = ({ options, fullOptions, selectedOptions, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredOptions, setFilteredOptions] = useState(options); // State for filtered options
  const searchInputRef = useRef(null); // Ref for the search input

  // Create a mapping between English and Arabic options
  const createMapping = () => {
    const mapping = {};
    fullOptions.en.forEach((option, index) => {
      mapping[option] = fullOptions.ar[index];
      mapping[fullOptions.ar[index]] = option;
    });
    return mapping;
  };

  const optionMapping = createMapping();

  const toggleOption = (option) => {
    const currentIndex = selectedOptions.indexOf(option);
    const newSelectedOptions = [...selectedOptions];
    const correspondingOption = optionMapping[option];

    if (currentIndex === -1) {
      newSelectedOptions.push(option);
      if (
        correspondingOption &&
        !newSelectedOptions.includes(correspondingOption)
      ) {
        newSelectedOptions.push(correspondingOption);
      }
    } else {
      newSelectedOptions.splice(currentIndex, 1);
      if (correspondingOption) {
        const correspondingIndex =
          newSelectedOptions.indexOf(correspondingOption);
        if (correspondingIndex !== -1) {
          newSelectedOptions.splice(correspondingIndex, 1);
        }
      }
    }

    onChange(newSelectedOptions);
  };

  // Handle search input changes
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter options based on search term
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Clear selected options and focus the search input
  const clearSelection = () => {
    onChange([]);
    setSearchTerm(""); // Optionally clear the search term
    setFilteredOptions(options); // Reset filtered options to show all
    if (searchInputRef.current) {
      searchInputRef.current.focus(); // Focus the search input
    }
  };

  return (
    <div className="dropdown-menu">
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={strings.search}
          className="search-input"
          ref={searchInputRef} // Attach ref here
        />
        <button type="button" onClick={clearSelection} className="clear-button">
          ✕
        </button>
      </div>
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option) => (
          <div key={option}>
            <li className="dropdown-item">
              <input
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
              />
              <span>{option}</span>
            </li>
          </div>
        ))
      ) : (
        <div className="no-results">{strings.notFound}</div>
      )}
    </div>
  );
};

export default MultiSelect;
