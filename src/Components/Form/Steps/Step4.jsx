import React, { useState, useEffect} from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import endpoints from "../../Endpoints/Endpoints";
import toast, { Toaster } from "react-hot-toast";

function Step4({ setStepValid,setFinalFormData }) {
    const [loading, setLoading] = useState(true);

    const [genderOptions, setGenderOptions] = useState([]);

    const [formData, setFormData] = useState({
        gender: "",
    });

    const [validations, setValidations] = useState({
        gender: true,
    });

    const [errors, setErrors] = useState({
        gender: "",
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
            ? endpoints.options.production
            : endpoints.options.development;
        axios
          .get(endpoint)
          .then((response) => {
            setGenderOptions(response.data.gender);
            setLoading(false);
          })
          .catch((error) => {
            toast.error("Error fetching gender options");
          });
    }, []);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
    
        let errorMessage = "";
    
        if (name === "gender") {
          if (!value) {
            errorMessage = "Please select a gender.";
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

  return (<>
    <div className="summary step">
      <h3 className="main_question">
        <strong>4/6</strong>General Description
      </h3>
      <ul>
        <li>
          <strong>4</strong>
          <div className="form-group">
            <label>Gender</label>
            <br />
            {loading ? (
              <>
                <Loader />
                <br />
                <Loader />
                <br />
                <Loader />
              </>
            ) : (
              <div className="form-group">
                {genderOptions.map((option) => (
                  <label
                    key={option.id}
                    className="container_radio version_2"
                  >
                    {option.option.charAt(0).toUpperCase() + option.option.slice(1)}
                    <input
                      type="radio"
                      name="gender"
                      value={option.option}
                      className="required"
                      onChange={handleInputChange}
                    />
                    <span className="checkmark"></span>
                  </label>
                ))}
              </div>
            )}
            {errors.gender && (
              <div className="invalid-feedback">{errors.gender}</div>
            )}
          </div>
        </li>
      </ul>
    </div>
    <Toaster />
    </>
  )
}

export default Step4