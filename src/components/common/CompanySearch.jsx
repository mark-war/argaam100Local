import React, { useState, useEffect, useCallback } from "react";
import { useFetchCompanyDataQuery } from "../../redux/features/apiSlice";
import config from "../../utils/config";
import { localized } from "../../utils/localization";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../../redux/selectors";
import { LANGUAGES, strings } from "../../utils/constants/localizedStrings";
import search_icon from "../../assets/images/search__icon.png";
import useIsMobile from "../../hooks/useIsMobile.js";

const SearchDropdown = ({ onCompanySelect }) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const { data } = useFetchCompanyDataQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedSectors, setExpandedSectors] = useState({});
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);
  const isMobile = useIsMobile(500);

  const normalizeArabic = (text) => {
    return text
      .replace(/[\u064B-\u065F]/g, "") // Remove diacritics
      .replace(/[أآإ]/g, "ا") // Normalize all forms of 'ا'
      .replace(/[يى]/g, "ي") // Normalize 'ي' and 'ى' to 'ي'
      .replace(/[هة]/g, "ة") // Normalize 'ه' and 'ة' to 'ة'
      .replace(/\s+/g, " ") // Normalize all spaces to a single space
      .trim(); // Remove leading/trailing spaces
  };

  const memoizedFilter = useCallback(() => {
    if (data) {
      const marketData = data.find(
        (item) => item.market.marketID === Number(config.defaultMarket)
      );

      if (marketData) {
        return marketData.sectorCompanies
          .map((sectorCompany) => {
            const filteredCompanies = sectorCompany.companies.filter(
              (company) => {
                // Extract relevant fields
                const stockSymbol = company.stockSymbol?.toLowerCase();
                const shortName = localized(
                  company,
                  "shortName",
                  currentLanguage
                ).toLowerCase();

                // Normalize search term
                const normalizedSearchTerm =
                  currentLanguage === LANGUAGES.AR
                    ? normalizeArabic(searchTerm.toLowerCase())
                    : searchTerm.toLowerCase();

                // Match conditions
                const isStockSymbolMatch =
                  stockSymbol && stockSymbol.includes(normalizedSearchTerm);

                const isShortNameMatch =
                  shortName &&
                  (currentLanguage === LANGUAGES.AR
                    ? normalizeArabic(shortName).includes(normalizedSearchTerm)
                    : shortName.includes(normalizedSearchTerm));

                return isStockSymbolMatch || isShortNameMatch;
              }
            );

            if (filteredCompanies.length > 0) {
              return {
                // market: localized(
                //   marketData.market,
                //   "marketName",
                //   currentLanguage
                // ),
                sector: localized(
                  sectorCompany.sector,
                  "sectorName",
                  currentLanguage
                ),
                companies: filteredCompanies,
              };
            } else {
              return null;
            }
          })
          .filter((sector) => sector !== null); // Remove empty sectors
      }
    }
    return [];
  }, [data, searchTerm, currentLanguage]);

  useEffect(() => {
    setFilteredOptions(memoizedFilter());
  }, [memoizedFilter]);

  const handleCompanySelect = (company) => {
    setSelectedOption(company);
    setSearchTerm(localized(company, "shortName", currentLanguage));

    onCompanySelect(company);

    if (!isMobile) setIsDropdownOpen(false);
    else setIsMobilePopupOpen(false);
  };

  const toggleMobilePopup = () => {
    setIsMobilePopupOpen((prev) => !prev);
    if (selectedOption && searchTerm === "") {
      setSearchTerm(localized(selectedOption, "shortName", currentLanguage)); // Revert to selected option if nothing new is chosen
    }
  };

  const handleOutsideClick = (e) => {
    if (
      e.target.className === "modal-backdrop" ||
      e.target.className === "modal-content" ||
      e.target.className.includes("dropdown-header") ||
      e.target.className === "dropdown-item" ||
      e.target.className === ""
    ) {
      setIsMobilePopupOpen(false);
    }
    setIsDropdownOpen(false);
    if (selectedOption && !isMobilePopupOpen) {
      setSearchTerm(localized(selectedOption, "shortName", currentLanguage)); // Revert to selected option if nothing new is chosen
    }
  };

  useEffect(() => {
    if (selectedOption) {
      setSearchTerm(localized(selectedOption, "shortName", currentLanguage));
    }
  }, [selectedOption, currentLanguage]);

  const handleDropdownFocus = () => {
    setSearchTerm("");
    setIsDropdownOpen(true);
  };

  const handleModalInputClick = () => {
    setSearchTerm(""); // Clear search term
    setIsMobilePopupOpen(true); // Open the dropdown
  };

  const handleDropdownBlur = () => {
    setTimeout(() => {
      if (!isDropdownClicked) {
        if (selectedOption) {
          setSearchTerm(
            localized(selectedOption, "shortName", currentLanguage)
          ); // Revert to selected option if nothing new is chosen
        }
        setIsDropdownOpen(false); // Close dropdown
        setIsMobilePopupOpen(false);
      }
      setIsDropdownClicked(false); // Reset dropdown click state
    }, 150);
  };

  const handleDropdownClick = (e) => {
    // fix for clicking on the edge of the market row
    if (
      e.target.className === "" &&
      e.target.firstElementChild &&
      !(
        e.target.offsetWidth > e.target.clientWidth ||
        e.target.offsetHeight > e.target.clientHeight
      )
    )
      setIsDropdownOpen(false);
    setIsDropdownClicked(true); // Mark dropdown as clicked
  };

  // TO BE USED IF REQUIRED TO TOGGLE SECTORS TO MINIMIZE AND EXPAND COMPANIES
  const toggleSector = (sectorName) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [sectorName]: !prev[sectorName],
    }));
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "auto" }}>
      <div className="top_search_bar" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder={strings.searchByCompany}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => handleDropdownFocus()}
          onBlur={() => handleDropdownBlur()}
          className="search_bar_dropdown"
        />
        <button
          type="button"
          id="dropdownMenuButton2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          className="dropdownMenuButton2 show"
          onClick={() => handleDropdownFocus()}
          onBlur={() => handleDropdownBlur()}
        ></button>
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "0",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "4px",
              maxHeight: "300px",
              overflowY: "auto",
              backgroundColor: "#fff",
              zIndex: "100",
            }}
            onMouseDown={(e) => handleDropdownClick(e)} // Detect dropdown clicks
          >
            {filteredOptions.length > 0 ? (
              <>
                {/* Display market name at the top */}
                {/* <div
                  className="dropdown-header expanded"
                  style={{
                    fontsize: "14px",
                    margin: "0px 5px",
                    padding: "8px",
                    backgroundColor: "#f7f7f7",
                  }}
                  onClick={(e) => handleOutsideClick(e)}
                >
                  {filteredOptions[0].market}
                </div> */}

                {/* Render sectors and their companies */}
                {filteredOptions.map((option) => (
                  <div key={option.sector}>
                    <div
                      style={{
                        padding: "10px",
                        fontWeight: "bold",
                        // cursor: "pointer",
                      }}
                      //onClick={() => toggleSector(option.sector)} // Toggle sector visibility
                      onClick={(e) => handleOutsideClick(e)}
                    >
                      {option.sector}
                    </div>

                    {/* Always expanded by default */}
                    {expandedSectors[option.sector] !== false && (
                      <div
                        className="dropdown-item"
                        style={{ paddingLeft: "20px" }}
                        onClick={(e) => handleOutsideClick(e)}
                      >
                        {option.companies.map((company) => (
                          <div
                            key={company.companyID}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              fontsize: "14px",
                            }}
                            onClick={() => handleCompanySelect(company)}
                          >
                            {company.stockSymbol} -{" "}
                            {localized(company, "shortName", currentLanguage)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ padding: "10px", color: "#888" }}>
                {strings.companyNotFound}
              </div>
            )}
          </div>
        )}
      </div>
      <a className="search_icon" onClick={toggleMobilePopup}>
        <img src={search_icon} alt="" />
      </a>
      {/* Modal for Mobile */}
      {isMobilePopupOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => handleOutsideClick(e)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 200,
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => handleOutsideClick(e)}
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -20%)",
              width: "90%",
              maxHeight: "60%",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              overflowY: "auto",
            }}
          >
            {/* Input Field Inside Modal */}
            <input
              type="text"
              placeholder={strings.searchByCompany}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleModalInputClick} // Clear search term when input is clicked
              className="search_bar_dropdown"
            />
            <button
              type="button"
              id="dropdownMenuButton2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              className="dropdownMenuButton2 show"
              onClick={handleModalInputClick}
            ></button>

            {/* Render Filtered Options */}
            {filteredOptions.length > 0 ? (
              <>
                {/* <div
                  className="dropdown-header expanded"
                  style={{
                    padding: "10px",
                    fontSize: "14px",
                    margin: "0px 5px",
                    backgroundColor: "#f7f7f7",
                  }}
                  onClick={(e) => handleOutsideClick(e)}
                >
                  {filteredOptions[0].market}
                </div> */}

                {filteredOptions.map((option) => (
                  <div key={option.sector}>
                    <div
                      style={{
                        padding: "10px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      // onClick={() => toggleSector(option.sector)}
                      onClick={(e) => handleOutsideClick(e)}
                    >
                      {option.sector}
                    </div>

                    {expandedSectors[option.sector] !== false && (
                      <div
                        className="dropdown-item"
                        style={{ paddingLeft: "20px" }}
                      >
                        {option.companies.map((company) => (
                          <div
                            key={company.companyID}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                            onClick={() => handleCompanySelect(company)}
                          >
                            {company.stockSymbol} -{" "}
                            {localized(company, "shortName", currentLanguage)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div style={{ padding: "10px", color: "#888" }}>
                {strings.companyNotFound}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchDropdown;
