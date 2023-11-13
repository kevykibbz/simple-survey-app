import React, { useState, useEffect,useRef} from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import endpoints from "../../Endpoints/Endpoints";
import xmlJs from 'xml-js'; 

function Step3({ setStepValid,setFinalFormData }) {
  const descriptionInputRef = useRef(null);

  const [question, setQuestion] = useState(null);


  const [loading, setLoading] = useState(true);


  const [formData, setFormData] = useState({
    description: "",
  });

  const [validations, setValidations] = useState({
    description: true,
  });

  const [errors, setErrors] = useState({
    description: "",
  });
  
  useEffect(() => {
    // Check if any input field is empty
    const isAnyFieldEmpty = Object.values(formData).some((value) => value === "");

    // Set form validity based on input validations and whether any field is empty
    const isFormValid = Object.values(validations).every((valid) => valid) && !isAnyFieldEmpty;

    setStepValid(isFormValid);
  }, [formData, validations, setStepValid]);

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
            if (question._attributes && question._attributes.name === "description") {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = "";

    if (!value) {
      errorMessage = "This field is required.";
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
      [name]: value,
    });

    const isFormValid = Object.values(validations).every((valid) => valid);
    setStepValid(isFormValid);

    // Call setFinalFormData with the updated form data
    setFinalFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if(descriptionInputRef.current){
      descriptionInputRef.current.focus();
    }
  }, []);

  return (
    <>
    <div className="summary step">
        <h3 className="main_question">
          <strong>3/6</strong>Basic details
        </h3>
        <ul>
          <li>
            <strong>3</strong>
            <div className="form-group">
              {loading ? (
                <>
                  <Loader />
                  <br />
                </>
              ):(<>
                <label>Description</label>
                <textarea
                 name={question && question._attributes.name}
                 className={`form-control required ${
                   !validations.description ? "is-invalid " : ""
                 }`}
                 spellCheck="true"
                 placeholder={question && question.text}
                 title={question && question.description}
                 value={formData.description}
                 onChange={handleInputChange}
                 ref={descriptionInputRef}
                 required={question && question._attributes.required}
                ></textarea>
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
              </>)}
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Step3;