import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../redux/features/languageSlice.js";
import { strings, LANGUAGES } from "../../utils/constants/localizedStrings.js";
import config from "../../utils/config.js";
import LanguageSwitcher from "../common/LanguageSwitcher.jsx";
import LoadingScreen from "../common/LoadingScreen.jsx";
import { redirectLogin, resetUser } from "../../utils/authHelper.js";
import AskQuestion from "./AskQuestion.jsx";

const HeaderMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lang } = useParams(); // Access the current language from URL parameters
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef(null); // Create a ref for the dropdown element
  const dropdownMobileRef = useRef(null); // Create a ref for the dropdown element
  const pages = useSelector((state) => state.pages.pages); // Access pages from Redux store
  const user = useSelector((state) => state.user.user); // Access pages from Redux store
  const hasAccess = user?.HasScreenerChartsAccess == "true";

  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );

  const [visibleAskQuestion, setVisibleAskQuestion] = useState(false);

  const ScreenerLogo = lazy(() => import("../common/LazyImage.jsx"));

  const toggleDropdown = () => setIsOpen((prevState) => !prevState);

  const toggleMobileDropdown = () => setIsMobileOpen((prevState) => !prevState);

  const handleMenuInnerClick = () => {
    if (isMobileOpen) toggleMobileDropdown(); // This function should toggle the state to close the menu
  };

  // Handle click outside the dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
    if (
      dropdownMobileRef.current &&
      !dropdownMobileRef.current.contains(event.target)
    ) {
      setIsMobileOpen(false);
    }
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

  useEffect(() => {
    // Add event listener to handle clicks outside the dropdown
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount

  const getNavLinks = () => {
    const links = [];
    if (pages?.length) {
      pages.forEach((page) => {
        links.push({
          path: `/${lang}/${page.pageNameEn
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          name: lang === LANGUAGES.AR ? page.pageNameAr : page.pageNameEn,
          isSelected: page.isSelected, //index === 0
          page,
        });
      });
    }

    return links;
  };

  const navLinks = getNavLinks();

  const onLoginPress = () => {
    redirectLogin();
  };

  if (!pages) {
    return <LoadingScreen />; // Optional: Show loading screen if pages data is not available
  }

  return (
    <>
      {/* Mobile Nav Starts */}
      <div className={`mobile_nav ${isMobileOpen ? "mobile-active" : ""}`}>
        <div
          className="mobile_menu"
          onClick={user ?handleMenuInnerClick: ()=>onLoginPress()}
          ref={dropdownMobileRef}
        >
          <ul>
            {/* {user ? ( */}
              <li>
                <a href="#" className="dropdown-item">
                  <button className="btn borderless-transparent dropdown-toggle remove_after pr_0">
                    <img alt="Image" src="/assets/images/user.svg" />
                  </button>
                  <strong>{user?.Username}</strong>
                </a>
              </li>
            {/* ) : (
              <li>
                <a
                  href="#"
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    onLoginPress();
                  }}
                >
                  Login
                </a>
              </li>
            )} */}
            <li>
              <a href="#" className="dropdown-item">
                <img
                  alt="Image"
                  className="mr_10"
                  src="/assets/images/qmark.svg"
                />{" "}
                {strings.anyQuestions}
              </a>
            </li>
            {user ? (
              <li onClick={() => resetUser()}>
                <a href="#" className="dropdown-item">
                  <img
                    alt="Image"
                    className="mr_10"
                    src="/assets/images/logout.svg"
                  />{" "}
                  {strings.signOut}
                </a>
              </li>
            ) : null}
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
        </div>
        <div className="mobile_menu_bg" onClick={toggleMobileDropdown}></div>
      </div>
      {/* Mobile Nav Ends */}

      <nav className="navbar navbar-expand-md navbar-light sticky bg-light shadow_btm">
        <div className="container-fluid px-layout">
          <div className="d-flex container_inner w-100 align-items-center">
            <div className="flex-fill justify-content-center">
              {/* <Suspense fallback={<LoadingScreen />}>
                <ScreenerLogo />
              </Suspense> */}
              <NavLink
                className="navbar-brand"
                to={`/${lang}/screener`}
                // onClick={() => (window.location.href = `/${lang}/screener`)}
              >
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
            <div className="flex-fill justify_content_center sub_nav no-print">
              <ul className="center_nav navbar-nav align-items-center justify-content-center me-auto mb-2 mb-md-0">
                {/* {navLinks.map((link, index) => {
                  const isFreePage =
                    link?.page?.pageId == import.meta.env.VITE_FREEPAGEID;
                  return (
                    <li key={index} className="nav-item">
                      <NavLink
                        to={link.path}
                        onClick={(e) => {
                          if (hasAccess) return;
                          else {
                            if (isFreePage) return;
                            else {
                              e.preventDefault();
                              navigate(`/${selectedLanguage}/request`);
                            }
                          }
                        }}
                        className="nav-link"
                      >
                        {link.name}
                      </NavLink>
                    </li>
                  );
                })} */}
              </ul>
            </div>
            <div className="flex-fill justify-content-end no-print">
              <div className="justify_content_end w-100">
                <div className="d_flex justify_content_end">
                  <div className="d_flex nav_toggle_container">
                    <ul className="right_nav navbar-nav align-items-center">
                      <li className="nav-item">
                        <a
                          target="_blank"
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
                      <LanguageSwitcher /> {/* language switcher component */}
                    </ul>
                    <div
                      className="nav-item position-relative user_toggle"
                      ref={dropdownRef}
                    >
                      <button
                        onClick={user ?toggleDropdown: ()=> onLoginPress()}
                        className="btn borderless-transparent dropdown-toggle remove_after pr_0"
                      >
                        <img alt="Image" src="/assets/images/user.svg" />
                      </button>
                      {isOpen && (
                        <ul className="dropdown-menu show user_dropdown">
                          {/* {user ? ( */}
                            <li>
                              <a href="#" className="dropdown-item">
                                <strong>{user?.Username}</strong>
                              </a>
                            </li>
                          {/* ) : (
                            
                            <li>
                              <a
                                className="dropdown-item"
                                onClick={(e) => {
                                  // e.preventDefault();
                                  onLoginPress();
                                }}
                              >
                                Login
                              </a>
                            </li>
                          )} */}

                          {user != undefined &&
                          user != null &&
                          Object.keys(user).length !== 0 ? (
                            <>
                              <li>
                                <a
                                  href="#"
                                  className="dropdown-item"
                                  onClick={() => setVisibleAskQuestion(true)}
                                >
                                  <img
                                    alt="Image"
                                    className="mr_10"
                                    src="/assets/images/qmark.svg"
                                  />{" "}
                                  {strings.anyQuestions}
                                </a>
                              </li>
                            </>
                          ) : (
                            <></>
                          )}

                          {user ? (
                            <li>
                              <a
                                className="dropdown-item"
                                onClick={() => resetUser()}
                              >
                                <img
                                  alt="Image"
                                  className="mr_10"
                                  src="/assets/images/logout.svg"
                                />{" "}
                                {strings.signOut}
                              </a>
                            </li>
                          ) : null}
                        </ul>
                      )}
                      {/* Toggle Button */}
                      <div
                        className="nav_toggle"
                        onClick={toggleMobileDropdown}
                      >
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

      {visibleAskQuestion != undefined && visibleAskQuestion == true ? (
        <>
          <AskQuestion
            isOpen={visibleAskQuestion}
            onRequestClose={() => setVisibleAskQuestion(false)}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default HeaderMain;
