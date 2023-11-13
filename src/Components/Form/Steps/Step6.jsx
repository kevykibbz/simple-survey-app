import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import endpoints from "../../Endpoints/Endpoints";
import xmlJs from 'xml-js'; 

function Step6({ setStepValid,setFinalFormData }) {
    const [loading, setLoading] = useState(true);

    const [question, setQuestion] = useState(null);

    const [selectedCertificates, setSelectedCertificates] = useState([]);

    const [certificatesError, setCertificatesError] = useState("");

    useEffect(() => {
        
        const hasUploadedFiles = selectedCertificates.length > 0;

        if(hasUploadedFiles){
            // Check if certificates field has valid PDF files
            const isCertificatesValid = selectedCertificates.every((file) =>
                file.type === "application/pdf"
            );
            setCertificatesError(isCertificatesValid ? "" : "Upload only PDF files");

            // Set form validity based on validations
            const isFormValid =isCertificatesValid;
            setStepValid(isFormValid);

            // Create updated data directly
            const updatedData = {
                certificate: isCertificatesValid ? selectedCertificates : '',
            };
            
            
            // Update finalFormData using setFinalFormData prop
            setFinalFormData((prevFormData) => ({
                ...prevFormData,
                ...updatedData,
            }));
        }else{
            setStepValid(false);
        }
       
      }, [setFinalFormData,selectedCertificates, setStepValid]);

      const handleCertificatesChange = (e) => {
        const files = e.target.files;
        setSelectedCertificates([...files]);
      };
    
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
                if (question._attributes && question._attributes.name === "certificates") {
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
          <strong>6/6</strong>Certificates
        </h3>
        <ul>
          <li>
            <strong>6</strong>
            <div className="form-group">
              {loading ? (
                <>
                  <Loader />
                  <br />
                </>
              ):(<>
                <label>Upload your certificates</label>
                <input
                    type={question && question._attributes.type}
                    name="certificate"
                    required={question && question._attributes.required}
                    className={`form-control required ${
                    certificatesError ? "is-invalid " : ""
                    }`}
                    placeholder={question && question.text}
                    accept=".pdf"
                    title={question && question.description}
                    multiple
                    onChange={handleCertificatesChange}
                />
                {certificatesError && (
                    <div className="error-message invalid-feedback">{certificatesError}</div>
                )}
              </>)}
            </div>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Step6