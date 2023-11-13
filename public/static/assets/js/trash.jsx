import React,{useState,useRef,useEffect} from "react";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";
import Step6 from "./Steps/Step6";
import { useSelector, useDispatch } from "react-redux";
import Overall from "./Steps/Overall";
import { formState,setFormState,setPercentage } from "../../States/FormState";
import { updateUsersData } from "../../States/FormState";
import ReactConfirmPopup from "react-confirm-popup";
import toast, { Toaster } from "react-hot-toast";
import CustomToast from './Toast/CustomToast';
import ConfettiExplosion from 'react-confetti-explosion';
import axios from "axios";
import endpoints from "../Endpoints/Endpoints";


function Form() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const stepState = useSelector(formState);
  const [finalFormData, setFinalFormData] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [stepTwoValid, setStepTwoValid] = useState(false);
  const [stepThreeValid, setStepThreeValid] = useState(false);
  const [stepFourValid, setStepFourValid] = useState(false);
  const [stepFiveValid, setStepFiveValid] = useState(false);
  const [stepSixValid, setStepSixValid] = useState(false);
  const usersData = useSelector((state) => state.formState.usersData);
  const dispatch = useDispatch();

  const handleNext = () => {
    if (stepState.stepState < 4) {
      dispatch(setFormState(stepState.stepState + 1));
      dispatch(setPercentage(stepState.percentage + 33.33))
    }
  };

  const handlePrevious = () => {
    if (stepState.stepState > 1) {
      dispatch(setFormState(stepState.stepState - 1));
      dispatch(setPercentage(stepState.percentage - 33.33))
    }
  };
  
  const handleConfirmClicked = () => {
    if(usersData){
      const formData = new FormData();
    const endpoint =
    process.env.NODE_ENV === "production"
      ? endpoints.responses.production
      : endpoints.responses.development;

      formData.append('full_name', usersData.full_name);
      formData.append('email_address', usersData.email_address);
      formData.append('description', usersData.description);
      formData.append('gender',  usersData.gender);
      formData.append('programming_stack',  usersData.programming_stack);
      usersData.certificate.forEach((certificate, index) => {
        formData.append('certificate', certificate);
      });
      setLoading(true);
    axios
    .put(endpoint, formData,{
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    })
    .then((response) => {
      setLoading(false);
      if(response.status === 200){
        toast.success("Survey data submitted successfully");
        setIsExploding(true);
        setTimeout(() => {
          setIsExploding(false);
        }, 5000);
      }
    })
    .catch((error) => {
      setLoading(false);
      const errorMessages = error.response.data.errors;
      if (error.response.data.errors !== undefined) {
        Object.keys(errorMessages).forEach((key) => {
          const messagesForCurrentKey = errorMessages[key];
          const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      
          if (Array.isArray(messagesForCurrentKey)) {
            messagesForCurrentKey.forEach((message) => {
              toast.error(`${capitalizedKey}: ${message}`);
            });
          } else {
            toast.error(`${capitalizedKey}: ${messagesForCurrentKey}`);
          }
        });
      }else{
        toast.error(error.response.data.message);
      }
    });
    }else{
      dispatch(setFormState(1));
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
  }

  const handleCancelClicked=(e)=>{
    toast.custom((t) => <CustomToast type="info" message="You have cancelled the submission of your survey data." />);
  }

  useEffect(()=>{
    if(finalFormData !==null && typeof finalFormData === 'object'){
      const keyLength=Object.keys(finalFormData).length
      if(keyLength === 7){
        dispatch(updateUsersData(finalFormData))
      }
    }
  },[finalFormData,dispatch])

  return (<>
    <div id="wizard_container">
      {/* <div id="top-wizard">
        <div
          id="progressbar"
          className="ui-progressbar ui-widget ui-widget-content ui-corner-all"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={stepState.percentage}
        >
          <div
            className="ui-progressbar-value ui-widget-header ui-corner-left"
            style={{width:`${stepState.percentage}%`}}
          ></div>
        </div>
      </div> */}
      <form id="wrapped" encType="multipart/form-data" onSubmit={handleFormSubmit} ref={formRef}>
        <div id="middle-wizard">
          {stepState.stepState === 1 && <Step1 setFormValid={setFormValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 2 && <Step2 setStepTwoValid={setStepTwoValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 3 && <Step3 setStepThreeValid={setStepThreeValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 4 && <Step4 setStepFourValid={setStepFourValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 5 && <Step5 setStepFiveValid={setStepFiveValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 6 && <Step6 setStepSixValid={setStepSixValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState !== 1 && stepState.stepState !== 2 && stepState.stepState !== 3 && <Overall />}
        </div>
        <div id="bottom-wizard">
          {stepState.stepState === 1 ? (
            <button
              type="button"
              name="forward"
              className="forward"
              onClick={handleNext}
              disabled={!formValid}
            >
              Next
            </button>
          ) : stepState.stepState === 2 ? (
            <React.Fragment>
              <button
                type="button"
                name="backward"
                className="backward"
                onClick={handlePrevious}
              >
                Prev
              </button>
              <button
                type="button"
                name="forward"
                className="forward"
                onClick={handleNext}
                disabled={!stepTwoValid}
              >
                Next
              </button>
            </React.Fragment>
          ) : stepState.stepState === 3 ? (
            <React.Fragment>
              <button
                type="button"
                name="backward"
                className="backward"
                onClick={handlePrevious}
              >
                Prev
              </button>
              <button type="button" name="forward" className="forward" disabled={!stepThreeValid} onClick={handleNext}>
                Continue
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <button
                type="button"
                name="backward"
                className="backward"
                onClick={handlePrevious}
              >
                Prev
              </button>
              {/* <button type="submit" name="process" className="submit" >
                Submit
              </button> */}
              <ReactConfirmPopup trigger={
              <button type="submit" name="process" className="submit"  >
                {loading ? (
                  <>
                    <i className="fa fa-spinner-third fa-solid"></i>
                    {"Submitting..."}
                  </>
                ) : (
                  "Submit"
                )}
              </button>}
              titel="Confirm submitting your survey data"
              text={
                <div>Are you sure you want to submit data provided in the survey form?</div>
              }
              confirmText="Yes am sure"
              cancelText="No"
              onConfirmClicked={handleConfirmClicked}
              onCancelClicked={handleCancelClicked}
              />
            </React.Fragment>
          )}
        </div>
      </form>
    </div>
    <Toaster />
    {isExploding && <ConfettiExplosion />}
    </>
  );
}

export default Form;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import endpoints from "../../Endpoints/Endpoints";
import toast, { Toaster } from "react-hot-toast";

function Step3({ setStepThreeValid,setFinalFormData }) {

  const [loading, setLoading] = useState(true);

  const [programmingStackOptions, setProgrammingStackOptions] = useState([]);

  const [selectedProgrammingStack, setSelectedProgrammingStack] = useState([]);

  const [selectedCertificates, setSelectedCertificates] = useState([]);

  const [programmingStackError, setProgrammingStackError] = useState("");

  const [certificatesError, setCertificatesError] = useState("");


  const endpoint =
    process.env.NODE_ENV === "production"
      ? endpoints.options.production
      : endpoints.options.development;

  useEffect(() => {
    axios
      .get(endpoint)
      .then((response) => {
        setProgrammingStackOptions(response.data.programming_stack);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error fetching programming stack options");
      });
  }, [endpoint]);

  useEffect(() => {
    // Check if at least one programming language is selected
    const isProgrammingStackValid = selectedProgrammingStack.length > 0;
    setProgrammingStackError(isProgrammingStackValid ? "" : "Choose at least one programming language");

    // Check if certificates field has valid PDF files
    const isCertificatesValid = selectedCertificates.every((file) =>
      file.type === "application/pdf"
    );
    setCertificatesError(isCertificatesValid ? "" : "Upload only PDF files");

    // Set form validity based on validations
    const isFormValid = isProgrammingStackValid && isCertificatesValid;
    setStepThreeValid(isFormValid);


  // Create updated data directly
  const updatedData = {
    programming_stack: isProgrammingStackValid ? selectedProgrammingStack.join(',') : '',
    certificate: isCertificatesValid ? selectedCertificates : '',
  };

  // console.log("updatedData", updatedData)

  // Update finalFormData using setFinalFormData prop
  setFinalFormData((prevFormData) => ({
    ...prevFormData,
    ...updatedData,
  }));

  }, [selectedProgrammingStack, setFinalFormData,selectedCertificates, setStepThreeValid]);


  const handleProgrammingStackChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSelectedProgrammingStack([...selectedProgrammingStack, value]);
    } else {
      setSelectedProgrammingStack(selectedProgrammingStack.filter((stack) => stack !== value));
    }
    
  };

  const handleCertificatesChange = (e) => {
    const files = e.target.files;
    setSelectedCertificates([...files]);
  };


  return (
    <>
      <div className="summary step">
        <h3 className="main_question">
          <strong>3/3</strong>Programming stacks and Certificates
        </h3>
        <ul>
          <li>
            <strong>5</strong>
            <div className="column-container">
              {loading ? (
                <>
                  <Loader />
                  <br />
                  <Loader />
                  <br />
                  <Loader />
                  <br />
                  <Loader />
                  <br />
                  <Loader />
                </>
              ) : (
                programmingStackOptions.map((option) => (
                 <div key={option.id} className="form-check">
                   <label htmlFor={`form-check-${option.id}`} className="form-check-label container_radio version_2">
                   {option.option.charAt(0).toUpperCase() + option.option.slice(1)}
                    <input
                      type="checkbox"
                      id={`form-check-${option.id}`}
                      name="programming_stack"
                      className={`form-check-input ${
                        programmingStackError ? "is-invalid " : ""
                      }`}
                      value={option.option}
                      onChange={handleProgrammingStackChange}
                    />
                    <span className="checkmark"></span>
                  </label>
                 </div>
               ))
              )}
            </div>
            {programmingStackError && (
              <div className="error-message text-danger">{programmingStackError}</div>
            )}
          </li>
          <li>
            <strong>6</strong>
            <div className="form-group">
              <label>Upload your certificates</label>
              <input
                type="file"
                name="certificate"
                required="required"
                className={`form-control required ${
                  certificatesError ? "is-invalid " : ""
                }`}
                placeholder="Upload your certificates"
                accept=".pdf"
                title="You can upload multiple (.pdf)"
                multiple
                onChange={handleCertificatesChange}
              />
              {certificatesError && (
                <div className="error-message invalid-feedback">{certificatesError}</div>
              )}
            </div>
          </li>
        </ul>
      </div>
      <Toaster />
    </>
  );
}

export default Step3;

import React, { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";

function Step1({ setFormValid, setFinalFormData }) {
  const fullNameInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    full_name: "",
    email_address: "",
    terms: false, 
  });

  const [validations, setValidations] = useState({
    full_name: true,
    email_address: true,
    terms: true, 
  });

  const [errors, setErrors] = useState({
    full_name: "",
    email_address: "",
    terms: "",
  });

  useEffect(() => {
    // Check if any input field is empty
    const isAnyFieldEmpty = Object.values(formData).some((value) => value === "");

    // Set form validity based on input validations and whether any field is empty
    const isFormValid = Object.values(validations).every((valid) => valid) && !isAnyFieldEmpty;

    setFormValid(isFormValid);
  }, [formData, validations, setFormValid]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    let errorMessage = "";
  
    if (name === "email_address") {
      if (!value) {
        errorMessage = "This field is required.";
      } else {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        const isValid = emailPattern.test(value);
  
        if (!isValid) {
          errorMessage = "Please enter a valid email address.";
        }
      }
  
      setValidations({
        ...validations,
        [name]: !errorMessage,
      });

    } else {
      if (!value) {
        errorMessage = "This field is required.";
      } else if (type === "checkbox") {
        errorMessage = checked ? "" : "Please accept the Terms and Conditions";
  
        setValidations({
          ...validations,
          [name]: checked,
        });
      }
    
      setValidations({
        ...validations,
        [name]: !errorMessage,
      });
    }
  
    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  
    const isFormValid = Object.values(validations).every((valid) => valid);
    setFormValid(isFormValid);

    // Call setFinalFormData with the updated form data
    setFinalFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

  };
  
  
  
  useEffect(() => {
    fullNameInputRef.current.focus();
  }, []);
  
  
  return (
    <>
      <div className="summary step">
        <h3 className="main_question">
          <strong>1/3</strong>Basic details
        </h3>
        <ul>
          <li>
            <strong>1</strong>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="full_name"
                className={`form-control required ${
                  !validations.full_name ? "is-invalid " : ""
                }`}
                placeholder="What is your full name"
                title="[Surname] [First name] [Other Names]"
                value={formData.full_name}
                onChange={handleInputChange}
                ref={fullNameInputRef}
              />
              {errors.full_name && (
                <div className="invalid-feedback">{errors.full_name}</div>
              )}
            </div>
          </li>
          <li>
            <strong>2</strong>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email_address"
                className={`form-control required ${
                  !validations.email_address ? "is-invalid " : ""
                }`}
                placeholder="What is your email address"
                value={formData.email_address}
                onChange={handleInputChange}
              />
              {errors.email_address && (
                <div className="invalid-feedback">{errors.email_address}</div>
              )}
            </div>
          </li>
        </ul>
        <div className="form-check form-group terms">
          <label className=" form-check-label container_check" htmlFor="invalidCheck3">
            Please accept our{" "}
            <Link to="#" data-bs-toggle="modal" data-bs-target="#terms-txt" rel="noreferrer">
              {" "}
              Terms and conditions
            </Link>
            <input
              type="checkbox"
              name="terms"
              id="invalidCheck3"
              aria-describedby="invalidFeedbackCheck3"
              checked={formData.terms}
              onChange={handleInputChange}
              required
              className={`form-check-input required ${!validations.terms ? "is-invalid " : ""}`}
            />
            <span className="checkmark"></span>
          </label>
          {errors.terms && <div id="invalidFeedbackCheck3" className="invalid-feedback">{errors.terms}</div>}
        </div>
      </div>
      <Modal />
    </>
  );
}
export default Step1;