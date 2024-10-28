import React, { useEffect, useMemo, useState } from "react";
import { useFormContext, useController } from "react-hook-form";
import Form from "react-bootstrap/Form";
import { isEmpty } from "../../utils/helperFunctions";
import { strings } from "../../utils/constants/localizedStrings";
import { countryCodes } from "../../utils/constants/phoneCodes";
const PhoneInput = ({ name, label }) => {
  const { control, formState } = useFormContext();
  const {
    field: { value, onChange, onBlur },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    defaultValue: { countryCode: "", phoneNumber: "" },
    rules: {
      validate: (value) => {
        const isValidCountryCode =
          value?.countryCode === "" || /^\+\d{1,3}$/.test(value?.countryCode);
        const isValidPhoneNumber = /^\d+$/.test(value?.phoneNumber);

        if (!isValidCountryCode || !isValidPhoneNumber) {
          return 'strings.entervalidphone';
        }

        if (value?.phoneNumber?.split("")[0] == '0'){
          return 'strings.invalidphonenoerror'
        }

        return true;
      },
    },
  });

  const lang = strings.getLanguage();
  const [show, setshow] = useState(false);
  const [input, setinput] = useState("");

  const filteredCodes = useMemo(() => {
    if (input === "") return countryCodes;

    const filteredCodes = countryCodes.filter((country) => {
      return (
        country[lang == "en" ? "CountryNameEn" : "CountryNameAr"]
          .toLowerCase()
          .includes(input.toLowerCase()) ||
        country.CountryCode.toLowerCase().includes(input.toLowerCase())
      );
    });

    if (filteredCodes.length > 0) {
      return filteredCodes;
    } else {
      return [];
    }
  }, [countryCodes, input]);

  return (
    <>
      <div className="dropdown_con">
        <Form.Control
          type="text"
          placeholder={'strings.countrycode'}
          onFocus={() => setshow(true)}
          onBlur={() => setshow(false)}
          autoComplete="nope"
          onChange={(e) => setinput(e.target.value)}
          value={
            show
              ? input
              : isEmpty(value?.countryCode)
              ? ""
              : `${value.countryCode}${
                  !isEmpty(value?.countryCode)
                    ? ` | ` +
                      countryCodes?.find(
                        (i) => i?.CountryCode == value?.countryCode
                      )[lang == "en" ? "CountryNameEn" : "CountryNameAr"]
                    : ""
                }`
          }
        />

        <div id="myDropdown" className={`dropdown-content ${show ? "show" : ""}`}>
          {filteredCodes.map((i, ind) => {
            return (
              <a
                onMouseDown={() => {
                  onChange({ ...value, countryCode: i.CountryCode });
                }}
              >
                ({i.CountryCode}){" "}
                {i[lang == "en" ? "CountryNameEn" : "CountryNameAr"]}
              </a>
            );
          })}
        </div>
      </div>

      <Form.Control
        type="text"
        value={value.phoneNumber}
        onKeyDown={(event) => {
          // Allow backspace
          if (event.key === "Backspace") {
            return;
          }

          // Allow Ctrl (Cmd) key for paste operations
          if ((event.ctrlKey || event.metaKey) && event.key === "v") {
            return;
          }

          // Allow only numeric input
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
        onPaste={(event) => {
          const pastedText = event.clipboardData.getData("text/plain");
          if (!/^\d+$/.test(pastedText)) {
            event.preventDefault();
          }
        }}
        onChange={(e) => onChange({ ...value, phoneNumber: e.target.value })}
        onBlur={onBlur}
        placeholder={'strings.phonenumber'}
        maxLength={10}
        // autoComplete="off"
      />
    </>
  );
};

export default PhoneInput;
