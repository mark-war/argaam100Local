import React, { useState, useEffect } from "react";
import { useFetchCompanyDataQuery } from "../../redux/features/apiSlice";
import config from "../../utils/config";
import { localized } from "../../utils/localization";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../../redux/selectors";
import { strings } from "../../utils/constants/localizedStrings";

const SearchDropdown = ({ onCompanySelect }) => {
  const currentLanguage = useSelector(selectCurrentLanguage);
  const { data } = useFetchCompanyDataQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedSectors, setExpandedSectors] = useState({});
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);
  console.log("currentLanguage", currentLanguage);
  // Populate filtered options based on the data and search term
  useEffect(() => {
    console.log("data", data);
    if (data) {
      // filter the result to TASI market only
      const marketData = data.find(
        (item) => item.market.marketID === Number(config.defaultMarket)
      );
      if (marketData) {
        const options = marketData.sectorCompanies.map((sectorCompany) => {
          const filteredCompanies = sectorCompany.companies.filter((company) =>
            `${company.stockSymbol} ${localized(
              company,
              "shortName",
              currentLanguage
            )}`
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          );

          return {
            market: localized(marketData.market, "marketName", currentLanguage),
            sector: localized(
              sectorCompany.sector,
              "sectorName",
              currentLanguage
            ),
            companies: filteredCompanies,
          };
        });

        setFilteredOptions(
          options.filter((option) => option.companies.length > 0)
        );
      }
    }
  }, [data, searchTerm, currentLanguage]);

  const handleCompanySelect = (company) => {
    setSelectedOption(company);
    setSearchTerm(localized(company, "shortName", currentLanguage));
    onCompanySelect(company);
    setIsDropdownOpen(false);
  };

  const handleDropdownFocus = () => {
    setSearchTerm("");
    setIsDropdownOpen(true);
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
      }
      setIsDropdownClicked(false); // Reset dropdown click state
    }, 150);
  };

  const handleDropdownClick = () => {
    setIsDropdownClicked(true); // Mark dropdown as clicked
  };

  const toggleSector = (sectorName) => {
    setExpandedSectors((prev) => ({
      ...prev,
      [sectorName]: !prev[sectorName],
    }));
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "auto" }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder={strings.searchByCompany}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={handleDropdownFocus}
          onBlur={handleDropdownBlur}
          className="search_bar_dropdown"
        />
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
                  style={{
                    padding: "10px",
                    backgroundColor: "#f7f7f7",
                    fontWeight: "bold",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {filteredOptions[0].market}
                </div>

                {/* Render sectors and their companies */}
                {filteredOptions.map((option) => (
                  <div key={option.sector}>
                    <div
                      style={{
                        padding: "10px",
                        backgroundColor: "#f7f7f7",
                        fontWeight: "bold",
                        borderBottom: "1px solid #ddd",
                        // cursor: "pointer",
                      }}
                      //onClick={() => toggleSector(option.sector)} // Toggle sector visibility
                    >
                      {option.sector}
                    </div>

                    {/* Always expanded by default */}
                    {expandedSectors[option.sector] !== false && (
                      <div style={{ paddingLeft: "20px" }}>
                        {option.companies.map((company) => (
                          <div
                            key={company.companyID}
                            style={{
                              padding: "8px",
                              cursor: "pointer",
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
                No matching companies found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchDropdown;
