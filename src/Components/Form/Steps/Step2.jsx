import React, { useState, useEffect,useRef } from "react";
import Modal from "../Modal/Modal";
import axios from "axios";
import endpoints from "../../Endpoints/Endpoints";
import Loader from "../Loader/Loader";
import xmlJs from 'xml-js'; 


function Step2({ setStepValid, setFinalFormData }) {
    const emailInputRef = useRef(null);
  
    const [question, setQuestion] = useState(null);

    const [loading, setLoading] = useState(true);


    const [formData, setFormData] = useState({
        email_address: "",
    });

    const [validations, setValidations] = useState({
        email_address: true,
    });

    const [errors, setErrors] = useState({
        email_address: "",
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
        if(emailInputRef.current){
            emailInputRef.current.focus();
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
                if (question._attributes && question._attributes.name === "email_address") {
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
          <strong>2/6</strong>Basic details
        </h3>
        <ul>
          <li>
            <strong>2</strong>
            <div className="form-group">
              {loading ? (
                <>
                  <Loader />
                  <br />
                </>
              ):(<>
                <label>Email Address</label>
                <input
                type="text"
                name={question && question._attributes.name}
                className={`form-control required ${
                  !validations.email_address ? "is-invalid " : ""
                }`}
                placeholder={question && question.text}
                title={question && question.description}
                value={formData.email_address}
                onChange={handleInputChange}
                ref={emailInputRef}
                required={question && question._attributes.required}
              />
              {errors.email_address && (
                <div className="invalid-feedback">{errors.email_address}</div>
              )}
              </>)}
            </div>
          </li>
        </ul>
      </div>
      <Modal />
    </>
  )
}

export default Step2