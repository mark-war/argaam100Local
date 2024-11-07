import React from "react";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import error from "../../assets/images/errorRed.gif";
import success from "../../assets/images/successGreen.gif";
import { settrialStatusModal } from "../../redux/features/userSlice";
import { strings } from "../../utils/constants/localizedStrings";
import bar from '../../assets/images/bar.png'
export const TrialStatus = () => {
  const dispatch = useDispatch();
  const trialStatus = useSelector((state) => state?.user?.trialStatus);
  const { visible, status } = trialStatus;
  const onReqClose = () =>
    dispatch(settrialStatusModal({ visible: false, status: 0 }));
  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );

  return (
    <Modal
      isOpen={visible}
      ariaHideApp={false}
      className={`${
        selectedLanguage == "en"
          ? "copylinkltr signin freetrial "
          : "copylinkrtl signin freetrial"
      }`}
      style={{
        content: {
          zIndex: 99999,
          width: "30%",
          height: "100px",
          direction: selectedLanguage == "en" ? "ltr" : "rtl",
          top: "50% !important",
        },
      }}
      onRequestClose={onReqClose}
    >
      <div className="cen_t mtb bnone free_trail_status">
        <img className="error_image" src={status == 1 || status == 3 ? success : error} />
        <img src={bar}/>
      </div>
      <h4 className="headText_tr mg_b2">
        {strings.formatString(
          status == 1
            ? strings.yougotfreetrial
            : status == 3
            ? strings.yougotfreetrialwith5
            : status == 0
            ? strings.youtrialexpired
            : "",
          <a className="salesTeam" href={`mailto:${strings.salesemail}`}>
            {strings.email}
          </a>,
          <h4
            className="headText_tr mg_b2"
            style={{ direction: "ltr", display: "inline-block" }}
          >
            {strings.companyphone}
          </h4>
        )}
      </h4>

      <div className="trailbt">
        <button onClick={onReqClose}>{strings.ok}</button>
      </div>
    </Modal>
  );
};
