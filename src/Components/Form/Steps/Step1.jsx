import React, { useState, useEffect,useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "../Modal/Modal";
import axios from "axios";
import endpoints from "../../Endpoints/Endpoints";
import Loader from "../Loader/Loader";
import xmlJs from 'xml-js'; 

function Step1({ setStepValid, setFinalFormData }) {
  const fullNameInputRef = useRef(null);
  
  const [question, setQuestion] = useState(null);

  const [loading, setLoading] = useState(true);


  const [formData, setFormData] = useState({
    full_name: "",
    terms: false, 
  });

  const [validations, setValidations] = useState({
    full_name: true,
    terms: true, 
  });

  const [errors, setErrors] = useState({
    full_name: "",
    terms: "",
  });

  useEffect(() => {
    // Check if any input field is empty
    const isAnyFieldEmpty = Object.values(formData).some((value) => value === "");

    // Set form validity based on input validations and whether any field is empty
    const isFormValid = Object.values(validations).every((valid) => valid) && !isAnyFieldEmpty;

    setStepValid(isFormValid);
  }, [formData, validations, setStepValid]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    let errorMessage = "";
  
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

     
  
    setErrors({
      ...errors,
      [name]: errorMessage,
    });
  
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  
    const isFormValid = Object.values(validations).every((valid) => valid);
    setStepValid(isFormValid);

    // Call setFinalFormData with the updated form data
    setFinalFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));

  };
   
  useEffect(() => {
    if(fullNameInputRef.current){
      fullNameInputRef.current.focus();
    }
  }, []);
  
  useEffect(() => {
    const endpoint =
      process.env.NODE_ENV === "production"
        ? endpoints.questions.production
        : endpoints.questions.development;
    axios
      .get(endpoint)
      .then((response) => {
        const jsonData = xmlJs.xml2json(response.data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
  
        if (parsedData && parsedData.questions && parsedData.questions.question) {
          const questions = parsedData.questions.question;
    
          for (const question of questions) {
            if (question._attributes && question._attributes.name === "full_name") {
              // Extract information
              const extractedInfo = {
                _attributes: question._attributes,
                text: question.text ? question.text._text : null,
                description: question.description ? question.description._text : null,
              };
              setQuestion(extractedInfo)
              break; 
            }
          }
        } else {
          console.error("Invalid questions data structure");
        }
    
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching question:", error)
      });
  }, []);
  return (
    <>
      <div className="summary step">
        <h3 className="main_question">
          <strong>1/6</strong>Basic details
        </h3>
        <ul>
          <li>
            <strong>1</strong>
            <div className="form-group">
              {loading ? (
                <>
                  <Loader />
                  <br />
                </>
              ):(<>
                <label>First Name</label>
                <input
                type="text"
                name={question && question._attributes.name}
                className={`form-control required ${
                  !validations.full_name ? "is-invalid " : ""
                }`}
                placeholder={question && question.text}
                title={question && question.description}
                value={formData.full_name}
                onChange={handleInputChange}
                ref={fullNameInputRef}
                required={question && question._attributes.required}
              />
              {errors.full_name && (
                <div className="invalid-feedback">{errors.full_name}</div>
              )}
              </>)}
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