import React, { useState, useEffect} from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import endpoints from "../../Endpoints/Endpoints";
import toast, { Toaster } from "react-hot-toast";


function Step5({ setStepValid,setFinalFormData }) {
    const [loading, setLoading] = useState(true);

    const [programmingStackOptions, setProgrammingStackOptions] = useState([]);

    const [selectedProgrammingStack, setSelectedProgrammingStack] = useState([]);

    const [programmingStackError, setProgrammingStackError] = useState("");

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
    
    
        // Set form validity based on validations
        const isFormValid = isProgrammingStackValid;
        setStepValid(isFormValid);
    
    
      // Create updated data directly
      const updatedData = {
        programming_stack: isProgrammingStackValid ? selectedProgrammingStack.join(',') : '',
      };
    
      // console.log("updatedData", updatedData)
    
      // Update finalFormData using setFinalFormData prop
      setFinalFormData((prevFormData) => ({
        ...prevFormData,
        ...updatedData,
      }));
    
      }, [selectedProgrammingStack, setFinalFormData, setStepValid]);
    
      const handleProgrammingStackChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          setSelectedProgrammingStack([...selectedProgrammingStack, value]);
        } else {
          setSelectedProgrammingStack(selectedProgrammingStack.filter((stack) => stack !== value));
        }
        
      };

  return (
    <>
    <div className="summary step">
      <h3 className="main_question">
        <strong>5/6</strong>Programming stacks
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
      </ul>
    </div>
    <Toaster />
  </>
  )
}

export default Step5