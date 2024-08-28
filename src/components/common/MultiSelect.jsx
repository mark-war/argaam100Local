import React, { useState, useRef, useMemo, useCallback } from "react";
import { LANGUAGES, strings } from "../../utils/constants/localizedStrings";
import debounce from "lodash.debounce";

const MultiSelect = ({
  options,
  fullOptions,
  selectedOptions,
  onChange,
  currentLanguage,
}) => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [filteredOptions, setFilteredOptions] = useState(options); // State for filtered options
  const searchInputRef = useRef(null); // Ref for the search input

  // Memoize the mapping creation
  const optionMapping = useMemo(() => {
    const mapping = {};
    fullOptions.en.forEach((option, index) => {
      mapping[option] = fullOptions.ar[index];
      mapping[fullOptions.ar[index]] = option;
    });
    return mapping;
  }, [fullOptions]);

  const toggleOption = useCallback(
    (option) => {
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
    },
    [selectedOptions, optionMapping, onChange]
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

  // Debounced handler for search input changes
  const handleSearchChange = useMemo(
    () =>
      debounce((value) => {
        const normalizedValue =
          currentLanguage === LANGUAGES.AR
            ? normalizeArabic(value.toLowerCase())
            : value.toLowerCase();
        setFilteredOptions(
          options.filter((option) =>
            (currentLanguage === LANGUAGES.AR
              ? normalizeArabic(option.toLowerCase())
              : option.toLowerCase()
            ).includes(normalizedValue)
          )
        );
      }, 300),
    [options]
  );

  const onSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    handleSearchChange(value);
  };

  return (
    <div className="dropdown-menu">
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder={strings.search}
          className="search-input"
          ref={searchInputRef} // Attach ref here
        />
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
