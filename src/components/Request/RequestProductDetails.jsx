import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
// import ArrowRight from "../../../../assets/images/EN_img/arrow-right.svg";
import { Button } from "bootstrap";
// import { strings } from "../../../../constants/localizedStrings";
// import PrivacyPolicy from "../../../User/PrivacyPolicy";
import { settrialStatusModal } from "../../redux/features/userSlice";
import { SubmitRequest } from "../../services/screenerApi";
import { redirectLogin, refreshToken } from "../../utils/authHelper";
import { isEmpty } from "../../utils/helperFunctions";
import PhoneInput from "../common/PhoneInput";
import { strings } from "../../utils/constants/localizedStrings";
import PrivacyPolicy from "../common/PrivacyPolicy";

export default function RequestProductDetails() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    (state) => state?.language?.currentLanguage
  );
  const methods = useForm({
    defaultValues: {
      userEmail: user?.Email,
      contactNo: user?.Phone,
      firstName: user?.FirstName,
      lastName: user?.LastName,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;
  const [checked, setchecked] = useState(false);
  const [privacymodal, setprivacymodal] = useState(false);

  useEffect(() => {
    if (!isEmpty(user)) {
      reset({
        userEmail: user?.Email,
        contactNo: user?.Phone,
        firstName: user?.FirstName,
        lastName: user?.LastName,
      });
    } else {
      reset({
        userEmail: "",
        contactNo: "",
        firstName: "",
        lastName: "",
      });
    }
  }, [user]);

  const Submit = (body) => {
    SubmitRequest(body)
      .then((res) => {
        reset();
        alert("strings.requestsubmitted");
        refreshToken();
        navigate(`/${selectedLanguage}`);
        if (res == 1) {
          dispatch(settrialStatusModal({ visible: true, status: 1 }));
        } else if (res == 3) {
          dispatch(settrialStatusModal({ visible: true, status: 3 }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Required = () => <span style={{ color: "red" }}>*</span>;

  const onSubmit = (data) => {
    if (checked) {
      const body = {
        ...data,
        ...(!isEmpty(user) && {
          userID: user.UserId,
        }),
        ...(isEmpty(user) && {
          contactNo:
            data.contactNo.countryCode + "-" + data.contactNo.phoneNumber,
        }),
      };
      Submit(body);
    }
  };

  return (
    <section className="product-details-form" id="product-details-form">
      <div className="container">
        <div className="sec-heading">
          <h2>{'strings.requestproductdetails'}</h2>
        </div>
        <div className="row">
          <div className="col-lg-7 offset-lg-1">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                  <div className="col-lg-6">
                    <Form.Group className="form-group" controlId="firstName">
                      <Form.Label>
                        {'strings.firstname'}
                        <Required />
                      </Form.Label>
                      <Form.Control
                        type="text"
                        {...register("firstName", {
                          required: 'strings.pleaseenterfirstname',
                        })}
                      />

                      {errors.firstName && (
                        <p className="errorMsg">{errors.firstName.message}</p>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group className="form-group" controlId="lastName">
                      <Form.Label>
                        {'strings.lastname'}
                        <Required />
                      </Form.Label>
                      <Form.Control
                        type="text"
                        {...register("lastName", {
                          required: 'strings.pleaseenterlastname',
                        })}
                      />

                      {errors.lastName && (
                        <p className="errorMsg">{errors.lastName.message}</p>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group className="form-group" controlId="userEmail">
                      <Form.Label>
                        {'strings.emailaddress'}
                        <Required />
                      </Form.Label>
                      <Form.Control
                        type="email"
                        disabled={!isEmpty(user)}
                        {...register("userEmail", {
                          required: 'strings.pleaseenteremail',
                          pattern: {
                            value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                            message: 'strings.pleaseentervalidemail',
                          },
                        })}
                      />{" "}
                      {errors.userEmail && (
                        <p className="errorMsg">{errors.userEmail.message}</p>
                      )}
                    </Form.Group>
                  </div>
                  <div className={`col-lg-6 ${isEmpty(user) ? "phoneno" : ""}`}>
                    <Form.Group className="form-group" controlId="contactNo">
                      <Form.Label>
                        {'strings.phonenumber'}
                        <Required />
                      </Form.Label>
                      {isEmpty(user) ? (
                        <PhoneInput
                          name="contactNo"
                          label="Phone Number"
                          {...register("contactNo", {
                            validate: (value) =>
                              value?.countryCode && value?.phoneNumber
                                ? true
                                : 'strings.entervalidphone',
                          })}
                        />
                      ) : (
                        <Form.Control
                          disabled
                          {...register("contactNo", {
                            required: 'strings.entervalidphone',
                          })}
                        />
                      )}
                      {errors.contactNo && (
                        <p className="errorMsg">{errors.contactNo.message}</p>
                      )}
                      {/* <Form.Control type="number" /> */}
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group className="form-group" controlId="companyName">
                      <Form.Label>
                        {'strings.companyfield'} <Required />
                      </Form.Label>
                      <Form.Control
                        type="text"
                        {...register("companyName", {
                          required: strings.pleaseentercompany,
                        })}
                      />

                      {errors.companyName && (
                        <p className="errorMsg">{errors.companyName.message}</p>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-lg-6">
                    <Form.Group className="form-group" controlId="jobTitle">
                      <Form.Label>{'strings.jobtitle'}</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("jobTitle", {
                          // required: "Please enter your Job Title",
                        })}
                      />

                      {errors.jobTitle && (
                        <p className="errorMsg">{errors.jobTitle.message}</p>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-lg-12">
                    <Form.Group className="form-group" controlId="comments">
                      <Form.Label>{'strings.additionalcmmnts'}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        className="addtional-comment"
                        {...register("comments")}
                      />
                    </Form.Group>
                  </div>
                </div>
                <div className="term-accept">
                  {["checkbox"].map((type) => (
                    <div key={`default-${type}`} className="mb-3">
                      <Form.Check // prettier-ignore
                        type={type}
                        id={`default-${type}`}
                        className="checkbox"
                        value={checked}
                        onChange={(val) => setchecked(val.target.checked)}
                      />
                    </div>
                  ))}
                  <p>
                    {'strings.requestconfirm'}{" "}
                    <PrivacyPolicy
                      visible={privacymodal}
                      onClose={(e) => {
                        e.preventDefault();
                        setprivacymodal(false);
                      }}
                    />
                    <span>
                      <a onClick={() => setprivacymodal(true)}>
                        {"strings.requestconfirm2"}
                      </a>
                    </span>
                  </p>
                </div>
                <button
                  className="btn-normal submit"
                  type="submit"
                  disabled={!checked}
                >
                  Submit
                </button> 
              </form>
            </FormProvider>
          </div>
          <div className="col-lg-4">
            <div className="right-side">
              <div className="contact-detail-wrap">
                {isEmpty(user) && (
                  <div>
                    <h4>{"strings.alreadycustomer"}</h4>
                    <p onClick={() => redirectLogin()}>
                      {"strings.logintocharts"}
                      {/* <img src={ArrowRight} /> */}
                    </p>
                  </div>
                )}
                <div>
                  <h4>{"strings.contactus"}</h4>
                  <p>+966 920007759</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
