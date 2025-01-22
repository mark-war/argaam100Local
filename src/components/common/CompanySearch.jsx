import React, { useState, useEffect, useCallback } from "react";
import { useFetchCompanyDataQuery } from "../../redux/features/apiSlice";
import config from "../../utils/config";
import { localized } from "../../utils/localization";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../../redux/selectors";
import { LANGUAGES, strings } from "../../utils/constants/localizedStrings";
import search_icon from "../../assets/images/search__icon.png";

const SearchDropdown = ({ onCompanySelect }) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const { data } = useFetchCompanyDataQuery();
  const [searchTerm, setSearchTerm] = useState("");
  // const [searchTerm2, setSearchTerm2] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedSectors, setExpandedSectors] = useState({});
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);

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

  // Populate filtered options based on the data and search term
  // useEffect(() => {
  //   if (data) {
  //     // filter the result to TASI market only
  //     const marketData = data.find(
  //       (item) => item.market.marketID === Number(config.defaultMarket)
  //     );
  //     if (marketData) {
  //       const options = marketData.sectorCompanies.map((sectorCompany) => {
  //         const filteredCompanies = sectorCompany.companies.filter((company) =>
  //           `${company.stockSymbol} ${localized(
  //             company,
  //             "shortName",
  //             currentLanguage
  //           )}`
  //             .toLowerCase()
  //             .trim()
  //             .includes(
  //               currentLanguage === LANGUAGES.AR
  //                 ? normalizeArabic(searchTerm.toLowerCase())
  //                 : searchTerm.toLowerCase()
  //             )
  //         );

  //         return {
  //           market: localized(marketData.market, "marketName", currentLanguage),
  //           sector: localized(
  //             sectorCompany.sector,
  //             "sectorName",
  //             currentLanguage
  //           ),
  //           companies: filteredCompanies,
  //         };
  //       });

  //       setFilteredOptions(
  //         options.filter((option) => option.companies.length > 0)
  //       );
  //     }
  //   }
  // }, [data, searchTerm, currentLanguage]);

  const memoizedFilter = useCallback(() => {
    if (data) {
      const marketData = data.find(
        (item) => item.market.marketID === Number(config.defaultMarket)
      );

      if (marketData) {
        return marketData.sectorCompanies
          .map((sectorCompany) => {
            const filteredCompanies = sectorCompany.companies.filter(
              (company) =>
                `${company.stockSymbol} ${localized(
                  company,
                  "shortName",
                  currentLanguage
                )}`
                  .toLowerCase()
                  .includes(
                    currentLanguage === LANGUAGES.AR
                      ? normalizeArabic(searchTerm.toLowerCase())
                      : searchTerm.toLowerCase()
                  )
            );
            return {
              market: localized(
                marketData.market,
                "marketName",
                currentLanguage
              ),
              sector: localized(
                sectorCompany.sector,
                "sectorName",
                currentLanguage
              ),
              companies: filteredCompanies,
            };
          })
          .filter((option) => option.companies.length > 0);
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
    setIsDropdownOpen(false);
    setIsMobilePopupOpen(false);
  };

  const toggleMobilePopup = () => {
    setIsMobilePopupOpen((prev) => !prev);
  };

  const handleOutsideClick = (e) => {
    if (
      e.target.className === "modal-backdrop" ||
      e.target.className.includes("dropdown-header") ||
      e.target.className === "dropdown-item" ||
      e.target.className === ""
    ) {
      setIsMobilePopupOpen(false);
    }
    setIsDropdownOpen(false);
    if (selectedOption) {
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
    setIsDropdownOpen(true); // Open the dropdown
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

  const handleDropdownClick = () => {
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
          onFocus={handleDropdownFocus}
          onBlur={handleDropdownBlur}
          className="search_bar_dropdown"
        />
        <button
          type="button"
          id="dropdownMenuButton2"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          className="dropdownMenuButton2 show"
          onClick={handleDropdownFocus}
          onBlur={handleDropdownBlur}
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
            onMouseDown={handleDropdownClick} // Detect dropdown clicks
          >
            {filteredOptions.length > 0 ? (
              <>
                {/* Display market name at the top */}
                <div
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
                </div>

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
              onClick={handleModalInputClick} // Clear search term when input is clicked
              className="search_bar_dropdown"
              style={{
                width: "100%",
                marginBottom: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
            <button
              type="button"
              id="dropdownMenuButton2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              className="dropdownMenuButton2 show"
              onClick={() => handleSearch()}
            ></button>

            {/* Render Filtered Options */}
            {filteredOptions.length > 0 ? (
              <>
                <div
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
                </div>

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
