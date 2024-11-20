import React from "react";
import { NavLink } from "react-bootstrap";
import { LANGUAGES } from "../../utils/constants/localizedStrings";
import { useParams } from "react-router-dom";
import Argaam100LogoAr from "../../assets/images/argaam_100_AR.svg";
import Argaam100LogoEn from "../../assets/images/argaam_100_EN.svg";

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
          src={Argaam100LogoAr}
        />
      ) : (
        <img
          alt="Argaam Screener Logo"
          src={Argaam100LogoEn}
        />
      )}
    </NavLink>
  );
};

export default LazyImage;
