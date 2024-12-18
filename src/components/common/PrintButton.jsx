import React from "react";
import { printScreen } from "../../utils/printPage";
import { isEmpty } from "../../utils/helperFunctions";
import { showError } from "../../utils/toastutil";
import { strings } from "../../utils/constants/localizedStrings";
import { useDispatch, useSelector } from "react-redux";
import { settrialStatusModal } from "../../redux/features/userSlice";

const PrintButton = () => {
  const user = useSelector((state) => state.user.user);
  const hasAccess = user?.HasScreenerChartsAccess === "true";
  const dispatch = useDispatch();
  const checkAccess = () => {
    if (user?.CpUser === "true") return true;

    if (user?.IsScreenerTrialOrScreenerPackageExpired == "true") {
      dispatch(
        settrialStatusModal({
          visible: true,
          status: 0,
        })
      );
      return false;
    }

    if (!(!isEmpty(user) && hasAccess)) {
      showError(strings["analystuserexcelerror"]);
      return false;
    }
    return true;
  };

  const print = () => {
    if (!checkAccess()) {
      return;
    }

    printScreen();
  };

  return (
    <a className="screen_icons no-print" href="#" onClick={print}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="39"
        height="37"
        viewBox="0 0 39 37"
      >
        <g
          className="screen_icon_border"
          data-name="Rectangle 28005"
          fill="#fff"
          stroke="#8193b0"
          strokeWidth="0.3"
        >
          <rect width="39" height="37" rx="4" stroke="none"></rect>
          <rect
            x="0.15"
            y="0.15"
            width="38.7"
            height="36.7"
            rx="3.85"
            fill="none"
          ></rect>
        </g>
        <g
          className="screen_icon_svg"
          data-name="Group 119068"
          transform="translate(8.001 8)"
        >
          <g id="Group_115638" data-name="Group 115638">
            <path
              id="Path_94942"
              data-name="Path 94942"
              d="M165.642,348.1H171.4a.665.665,0,1,1,0,1.33h-5.763a.665.665,0,0,1,0-1.33Zm0-2.1H171.4a.665.665,0,1,1,0,1.33h-5.763a.665.665,0,0,1,0-1.33Z"
              transform="translate(-157.501 -336.688)"
              fill="#6d7f9b"
            ></path>
            <path
              id="Path_94943"
              data-name="Path 94943"
              d="M1.715,23.053H4.053V18.8a.735.735,0,0,1,.735-.735H17.257a.735.735,0,0,1,.735.735v4.253h2.338a1.716,1.716,0,0,1,1.715,1.715V32.16a1.716,1.716,0,0,1-1.715,1.715H17.991v3.944a.735.735,0,0,1-.735.735H4.787a.735.735,0,0,1-.735-.735V33.874H1.715A1.716,1.716,0,0,1,0,32.16V24.767A1.717,1.717,0,0,1,1.715,23.053Zm14.807-3.518h-11v3.518h11Zm-11,17.549h11V31.072h-11v6.012Zm-.735-9.717h1.87a.735.735,0,0,0,0-1.47H4.787a.735.735,0,0,0,0,1.47Z"
              transform="translate(0 -18.065)"
              fill="#6d7f9b"
            ></path>
          </g>
        </g>
      </svg>
    </a>
  );
};

export default PrintButton;
