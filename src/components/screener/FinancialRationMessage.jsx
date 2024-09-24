import PropTypes from "prop-types";
import { strings, SECTORS } from "../../utils/constants/localizedStrings";

const FinancialRatioMessage = ({ onChange }) => {
  const handleFinancialRatioClick = (sector) => {
    const updatedSelectedSectors = sector;
    onChange(updatedSelectedSectors);
  };
  return (
    <div>
      {strings.finRatioMsg}
      <span
        className="ratio_msg"
        onClick={() => handleFinancialRatioClick([SECTORS.BANKING])}
      >
        {/* 8 */} {strings.banks}
      </span>
      ,
      <span
        className="ratio_msg"
        onClick={() => handleFinancialRatioClick([SECTORS.INSURANCE])}
      >
        {/* 15 */} {strings.insurance}
      </span>
      ,
      <span
        className="ratio_msg"
        onClick={() => handleFinancialRatioClick([SECTORS.REITS])}
      >
        {/* 238 */} {strings.reits}
      </span>
      , {strings.and}
      <span
        className="ratio_msg"
        onClick={() => handleFinancialRatioClick([SECTORS.FINANCING])}
      >
        {/* 240 */} {strings.financing}
      </span>
      .
    </div>
  );
};

FinancialRatioMessage.propTypes = {
  onChange: PropTypes.func.isRequired, // Required prop to update the parent
};

export default FinancialRatioMessage;
