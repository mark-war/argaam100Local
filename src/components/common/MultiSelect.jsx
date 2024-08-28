import React, { useState, useRef, useMemo, useCallback } from "react";
import { LANGUAGES, strings } from "../../utils/constants/localizedStrings";

const MultiSelect = ({
  options,
  selectedOptions,
  onChange,
  currentLanguage,
}) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const searchInputRef = useRef(null); // Ref for the search input

  // Memoize the mapping creation
  const optionMapping = useMemo(() => {
    const mapping = {};
    options.forEach((option) => {
      mapping[option.id] = option.name;
    });
    return mapping;
  }, [options]);

  // Function to toggle the selected option
  const toggleOption = useCallback(
    (optionId) => {
      const newSelectedOptions = selectedOptions.includes(optionId)
        ? selectedOptions.filter((id) => id !== optionId) // Remove if already selected
        : [...selectedOptions, optionId]; // Add if not selected

      onChange(newSelectedOptions); // Notify parent with updated selection
    },
    [onChange, selectedOptions]
  );

  // Normalization function to replace specified Arabic characters
  const normalizeArabic = (text) => {
    return text
      .replace(/\ا/g, "أ")
      .replace(/\أ/g, "ا")
      .replace(/\ى/g, "ي")
      .replace(/\ه/g, "ة")
      .replace(/\ا/g, "آ")
      .replace(/\عِ/g, "ع")
      .replace(/\آ/g, "ا")
      .replace(/\إ/g, "ا");
  };

  const onSearchChange = useCallback((event) => {
    const value = event.target.value;
    setSearchTerm(value);
  }, []);

  // Filter options based on the search term
  const filteredOptions = useMemo(() => {
    const normalizedValue =
      currentLanguage === LANGUAGES.AR
        ? normalizeArabic(searchTerm.toLowerCase())
        : searchTerm.toLowerCase();

    return options.filter((option) =>
      (currentLanguage === LANGUAGES.AR
        ? normalizeArabic(optionMapping[option.id].toLowerCase())
        : optionMapping[option.id].toLowerCase()
      ).includes(normalizedValue)
    );
  }, [options, optionMapping, searchTerm, currentLanguage]);

  return (
    <div className="dropdown-menu">
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={strings.search}
          className="search-input"
          ref={searchInputRef}
        />
      </div>
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option) => (
          <div key={option.id}>
            <li className="dropdown-item">
              <input
                type="checkbox"
                value={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => toggleOption(option.id)}
              />
              <span>{optionMapping[option.id]}</span>
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
