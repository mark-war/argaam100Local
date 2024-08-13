import React, { useState, useRef } from "react";
import { strings } from "../../utils/constants/localizedStrings";

const MultiSelect = ({ options, selectedOptions, onChange }) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredOptions, setFilteredOptions] = useState(options); // State for filtered options
  const searchInputRef = useRef(null); // Ref for the search input

  const toggleOption = (option) => {
    const currentIndex = selectedOptions.indexOf(option);
    const newSelectedOptions = [...selectedOptions];

    if (currentIndex === -1) {
      newSelectedOptions.push(option);
    } else {
      newSelectedOptions.splice(currentIndex, 1);
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
          X
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
        <div className="no-results">No results found</div>
      )}
    </div>
  );
};

export default MultiSelect;
