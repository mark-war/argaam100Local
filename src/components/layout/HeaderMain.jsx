import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../redux/features/languageSlice.js";
import { strings, LANGUAGES } from "../../utils/constants/localizedStrings.js";
import config from "../../utils/config.js";
import LanguageSwitcher from "../common/LanguageSwitcher.jsx";
import LoadingScreen from "../common/LoadingScreen.jsx";

const HeaderMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { lang } = useParams(); // Access the current language from URL parameters
  const [isOpen, setIsOpen] = useState(false);

  const pages = useSelector((state) => state.apiData.pages); // Access pages from Redux store

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleMenuInnerClick = (event) => {
    event.stopPropagation(); // Prevents the click from propagating to the container
  };

  useEffect(() => {
    if (config.supportedLanguages.includes(lang)) {
      if (!lang) {
        dispatch(setLanguage(lang));
      }
      strings.setLanguage(lang);
    } else {
      const defaultLanguage = config.defaultLanguage; // Fallback to default language
      dispatch(setLanguage(defaultLanguage));
      strings.setLanguage(defaultLanguage);
      navigate(`/${defaultLanguage}` + window.location.pathname.slice(3));
    }

    document.documentElement.lang = lang;
  }, [lang, dispatch, navigate]);

  const getNavLinks = () => {
    const links = [];

    // Check if pages is defined and an array
    if (pages?.length) {
      pages.forEach((page, index) => {
        links.push({
          path: `/${lang}/${page.pageNameEn
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          name: lang === LANGUAGES.AR ? page.pageNameAr : page.pageNameEn,
          isSelected: index === 0,
        });
      });
    }

    return links;
  };

  const navLinks = getNavLinks();

  if (!pages) {
    return <LoadingScreen />; // Optional: Show loading screen if pages data is not available
  }

  return (
    <>
      {/* Mobile Nav Starts */}
      <div
        className={`mobile_nav ${isOpen ? "mobile-active" : ""}`}
        onClick={toggleDropdown}
      >
        <div className="mobile_menu" onClick={handleMenuInnerClick}>
          <ul>
            <li>
              <a href="#" className="dropdown-item">
                <button className="btn borderless-transparent dropdown-toggle remove_after pr_0">
                  <img alt="Image" src="/assets/images/user.svg" />
                </button>
                <strong>Hager.Saeed@Argaam.com</strong>
              </a>
            </li>
            <li>
              <a href="#" className="dropdown-item">
                <img
                  alt="Image"
                  className="mr_10"
                  src="/assets/images/qmark.svg"
                />{" "}
                Any Questions
              </a>
            </li>
            <li>
              <a href="#" className="dropdown-item">
                <img
                  alt="Image"
                  className="mr_10"
                  src="/assets/images/logout.svg"
                />{" "}
                Sign Out
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                {strings.navLinkArgaam}
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                {strings.navLinkAbout}
              </a>
            </li>
            <LanguageSwitcher /> {/* Add the new component */}
          </ul>
        </div>
        <div className="mobile_menu_bg" onClick={toggleDropdown}></div>
      </div>
      {/* Mobile Nav Ends */}

      <nav className="navbar navbar-expand-md navbar-light sticky bg-light shadow_btm">
        <div className="container-fluid px-layout">
          <div className="d-flex container_inner w-100 align-items-center">
            <div className="flex-fill justify-content-center">
              <NavLink className="navbar-brand" to={`/${lang}/screener`}>
                {lang === LANGUAGES.AR ? (
                  <img
                    alt="Argaam Screener Logo"
                    src="/assets/images/argaam_screener_logo_ar.svg"
                  />
                ) : (
                  <img
                    alt="Argaam Screener Logo"
                    src="/assets/images/argaam_screener_logo_en.svg"
                  />
                )}
              </NavLink>
            </div>
            <div className="flex-fill justify_content_center sub_nav">
              <ul className="center_nav navbar-nav align-items-center justify-content-center me-auto mb-2 mb-md-0">
                {navLinks.map((link, index) => (
                  <li key={index} className="nav-item">
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-fill justify-content-end">
              <div className="justify_content_end w-100">
                <div className="d_flex justify_content_end">
                  <div className="d_flex nav_toggle_container">
                    <ul className="right_nav navbar-nav align-items-center">
                      <li className="nav-item">
                        <a
                          target="_blank" // This will open the link in a new tab
                          rel="noreferrer"
                          href="https://www.argaam.com/"
                          className="nav-link"
                        >
                          {strings.navLinkArgaam}
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="#" className="nav-link">
                          {strings.navLinkAbout}
                        </a>
                      </li>
                      <LanguageSwitcher /> {/* Add the new component */}
                    </ul>
                    <div className="nav-item position-relative user_toggle">
                      <button
                        onClick={toggleDropdown}
                        className="btn borderless-transparent dropdown-toggle remove_after pr_0"
                      >
                        <img alt="Image" src="/assets/images/user.svg" />
                      </button>
                      {isOpen && (
                        <ul className="dropdown-menu show user_dropdown">
                          <li>
                            <a href="#" className="dropdown-item">
                              <strong>Hager.Saeed@Argaam.com</strong>
                            </a>
                          </li>
                          <li>
                            <a href="#" className="dropdown-item">
                              <img
                                alt="Image"
                                className="mr_10"
                                src="/assets/images/qmark.svg"
                              />{" "}
                              Any Questions
                            </a>
                          </li>
                          <li>
                            <a href="#" className="dropdown-item">
                              <img
                                alt="Image"
                                className="mr_10"
                                src="/assets/images/logout.svg"
                              />{" "}
                              Sign Out
                            </a>
                          </li>
                        </ul>
                      )}
                      {/* Toggle Button */}
                      <div className="nav_toggle" onClick={toggleDropdown}>
                        <svg
                          fill="#000000"
                          width="30"
                          version="1.1"
                          id="Layer_1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 455 455"
                        >
                          <g strokeWidth="0"></g>
                          <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></g>
                          <g id="SVGRepo_iconCarrier">
                            {" "}
                            <g>
                              {" "}
                              <rect y="380" height="15" width="455"></rect>{" "}
                              <rect y="212.5" width="455" height="15"></rect>{" "}
                              <rect y="50.5" width="455" height="15"></rect>{" "}
                            </g>
                          </g>
                        </svg>
                      </div>
                      {/* Toggle Button */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default HeaderMain;
