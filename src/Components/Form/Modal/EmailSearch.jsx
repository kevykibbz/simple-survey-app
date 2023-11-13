import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast";
import endpoints from '../../Endpoints/Endpoints';
import axios from "axios";
import xmlJs from 'xml-js'; 

function EmailSearch({ setData }) {
  const emailInputRef = useRef(null);

  const modalRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email_address: '',
  });

  const [errors, setErrors] = useState({
    email_address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = '';

    // Basic email validation
    if (name === 'email_address') {
      if (!value.trim()) {
        errorMessage = 'Email address is required';
      } else if (
        // Add more specific email validation if needed
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errorMessage = 'Invalid email address';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check for errors before submitting
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
        toast.error(errors.email_address);
    } else {
      const endpoint =
      process.env.NODE_ENV === "production"
        ? endpoints.responses.production+"?email_address="+formData.email_address
        : endpoints.responses.development+"?email_address="+formData.email_address;
    setLoading(true)
    axios
      .get(endpoint)
      .then((response) => {
        const jsonData = xmlJs.xml2json(response.data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        if (parsedData && parsedData.question_responses && parsedData.question_responses.question_response) {
            const records = parsedData.question_responses.question_response;
            setData([records]);
            // Get the number of records
            const numberOfRecords = Array.isArray(records)
            ? records.length
            : records
            ? 1
            : 0;

            toast.success(`Found ${numberOfRecords} record(s)`); 
            closeModal(); 
        } else {
        console.error('Invalid question_responses data structure');
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false)
        toast.error("Error fetching qusetion");
      });
    }
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.click();
    }
  };

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  return (<>
    <div
      className="modal fade"
      id="email-search-modal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="serachLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="termsLabel">
              Filter Responses By Email Address
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              ref={modalRef}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <div style={{ float: 'left', marginBottom: '5px' }}>
                  Email address
                </div>
                <input
                  ref={emailInputRef}
                  className={`form-control ${
                    errors.email_address ? "is-invalid " : ""
                  }`}                  type="search"
                  placeholder="Input email address"
                  title="Input email address"
                  name="email_address"
                  onChange={handleChange}
                />
                {errors.email_address && (
                  <div className='invalid-feedback'>{errors.email_address}</div>
                )}
              </div>
              <button type="submit" name="process" className="submit">
              {loading ? (
                <>
                    <i className="fa fa-spinner-third fa-solid"></i>
                    {"Seraching..."}
                </>
                ) : (
                "Search"
                )}
              </button>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn_1"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
    <Toaster/>
    </>
  );
}

export default EmailSearch;