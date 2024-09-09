import { localized } from "../../utils/localization";

const SubTab = (subTab) => {
  return (
    <li className="nav-item" key={subTab.subTab.originalIndex}>
      <button
        className={`nav-link cursor-pointer ${subTab.isActive ? "active" : ""}`}
        onClick={() => subTab.subTabClick(subTab.subTab.originalIndex)}
      >
        {localized(subTab.subTab, "tabName", subTab.currentLanguage)}
      </button>
    </li>
  );
};

export default SubTab;
