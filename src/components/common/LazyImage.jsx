import React from "react";
import { NavLink } from "react-bootstrap";
import { LANGUAGES } from "../../utils/constants/localizedStrings";
import { useParams } from "react-router-dom";

const LazyImage = () => {
  const { lang } = useParams(); // Access the current language from URL parameters
  return (
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
  );
};

export default LazyImage;
