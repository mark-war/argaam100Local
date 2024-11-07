import React from "react";
import { Button } from "react-bootstrap";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import { setrequestRedirectModal } from "../../redux/features/userSlice";
import { strings } from "../../utils/constants/localizedStrings";

export const RequestRedirect = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const visible = useSelector((state) => state?.modal?.requestRedirectModal);

  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );
  const onReqClose = () => {
    dispatch(setrequestRedirectModal(false));
    navigate(`/${selectedLanguage}/request`);
  };
  useScrollbarVisibility(visible);

  return (
    <Modal
      isOpen={visible}
      ariaHideApp={false}
      className={`${
        selectedLanguage == "en"
          ? "copylinkltr signin freetrial requestpop"
          : "copylinkrtl signin freetrial requestpop"
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
      <a
        onClick={() => dispatch(setrequestRedirectModal(false))}
        class="closeIcon"
      ></a>
      <h4 className="headText_tr mg_b2">{strings.requestRedirect}</h4>

      <div className="trailbt">
        <Button onClick={onReqClose}>Request Details</Button>
      </div>
    </Modal>
  );
};
