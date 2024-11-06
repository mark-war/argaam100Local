import React, { useState } from "react";
import Modal from "react-modal";
import { useSelector } from "react-redux";

import { PostQuestionaierScreener } from "../../services/screenerApi";
import getLangID, { isEmptyEntity } from "../../utils/helpers/GlobalHelper";
import useScrollbarVisibility from "../../hooks/useScrollbarVisibility";
import { strings } from "../../utils/constants/localizedStrings";
import { showSuccess } from "../../utils/toastutil";


export default function AskQuestion({ onRequestClose, isOpen }) {

  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );


  const user = useSelector((state) => state.user.user);
  const [text, settext] = useState("");


  const handleAnyQuestionSubmit = () => {
    const body = {
      userId: user?.UserId,
      comment: text?.trim(),
      languageId: getLangID(selectedLanguage),
    }
    PostQuestionaierScreener(body)
      .then((res) => {
        showSuccess(strings.susbmittedsuccess);
        settext("");
        onRequestClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };





  const handleInputMessageChange = (value) => {
    // Remove leading/trailing spaces
    const trimmedValue = value?.trimStart();
    settext(trimmedValue);
  };

  useScrollbarVisibility(isOpen);

  return (
    <>
      <Modal
        isOpen={isOpen}
        className={`askquestion copylinkltr ${
          selectedLanguage == "en" ? "ltr" : "rtl"
        }`}
        style={{
          content: {
            zIndex: 99999,
            width: "70% !important",
            height: "100px",
            direction: selectedLanguage == "en" ? "ltr" : "rtl",
            top: "50% !important",
          },
        }}
        onRequestClose={onRequestClose}
      >
        <div className="d-flex justify-content-between">
          <a
            href="#"
            className="closeIcon"
            onClick={(e) => {
              e.preventDefault();
              onRequestClose();
            }}
          ></a>
          <h1>{strings.writeatexthere}</h1>
        </div>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={text}
          onChange={(val) => handleInputMessageChange(val.target.value)}
        />
        <a
          href=""
          className={`post button ${isEmptyEntity(text) ? "disabled" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            if (!isEmptyEntity(text)) {
              handleAnyQuestionSubmit();
            }
          }}
        >
          {strings.send}
        </a>
        <a className="cleartext button" onClick={() => settext("")}>
          {strings.clear}
        </a>
      </Modal>
    </>
  );
}
