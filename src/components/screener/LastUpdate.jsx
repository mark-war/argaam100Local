import { useCallback } from "react";
import { strings } from "../../utils/constants/localizedStrings";
import PropTypes from "prop-types";

const LastUpdate = ({ currentLanguage }) => {
  const getCurrentDateFormatted = useCallback(() => {
    const today = new Date();
    return today.toLocaleDateString(
      currentLanguage === "ar" ? "ar-SA" : "en-GB",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        calendar: "gregory", // Ensure the Gregorian calendar is used
        numberingSystem: "latn", // Use Western Arabic numerals (0-9)
      }
    );
  }, [currentLanguage]);

  const dateNow = getCurrentDateFormatted();

  return (
    <div className="flex-fill text_right mt-2 no-print">
      <p className="font-20 mb-0 date">
        {strings.date} {dateNow}
      </p>
    </div>
  );
};

LastUpdate.propTypes = {
  currentLanguage: PropTypes.string.isRequired,
};

export default LastUpdate;
