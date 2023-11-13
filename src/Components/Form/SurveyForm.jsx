import React,{useState,useRef,useEffect} from "react";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";
import Step6 from "./Steps/Step6";
import { useSelector, useDispatch } from "react-redux";
import Overall1 from "./Steps/Overall1";
import Overall2 from "./Steps/Overall2";
import { formState,setFormState,setPercentage } from "../../States/FormState";
import { updateUsersData } from "../../States/FormState";
import ReactConfirmPopup from "react-confirm-popup";
import toast, { Toaster } from "react-hot-toast";
import CustomToast from './Toast/CustomToast';
import ConfettiExplosion from 'react-confetti-explosion';
import axios from "axios";
import endpoints from "../Endpoints/Endpoints";


function SurveyForm() {
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const stepState = useSelector(formState);
  const [finalFormData, setFinalFormData] = useState(null);
  const [stepValid, setStepValid] = useState(false);
  const usersData = useSelector((state) => state.formState.usersData);
  const dispatch = useDispatch();

  const handleNext = () => {
    if (stepState.stepState < 8) {
      dispatch(setFormState(stepState.stepState + 1));
      dispatch(setPercentage(stepState.percentage + 16.6667))
    }
  };

  const handlePrevious = () => {
    if (stepState.stepState > 1) {
      dispatch(setFormState(stepState.stepState - 1));
      dispatch(setPercentage(stepState.percentage - 16.6667))
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
    {(stepState.stepState !==7 && stepState.stepState !==8) && (
      <div id="top-wizard">
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
      </div>
    )}
      <form id="wrapped" encType="multipart/form-data" onSubmit={handleFormSubmit} ref={formRef}>
        <div id="middle-wizard">
          {stepState.stepState === 1 && <Step1 setStepValid={setStepValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 2 && <Step2 setStepValid={setStepValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 3 && <Step3 setStepValid={setStepValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 4 && <Step4 setStepValid={setStepValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 5 && <Step5 setStepValid={setStepValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 6 && <Step6 setStepValid={setStepValid} setFinalFormData={setFinalFormData}/>}
          {stepState.stepState === 7 && <Overall1 setStepValid={setStepValid}/>}
          {stepState.stepState !== 1 && stepState.stepState !== 2 && stepState.stepState !== 3 && stepState.stepState !== 4 && stepState.stepState !== 5 && stepState.stepState !== 6 && stepState.stepState !== 7 && <Overall2 />}
        </div>
        <div id="bottom-wizard">
        {stepState.stepState === 1 && (
          <button
            type="button"
            name="forward"
            className="forward"
            onClick={handleNext}
            disabled={!stepValid}
          >
            Next
          </button>
        )}

        {stepState.stepState > 1 && stepState.stepState < 8 && (
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
              disabled={!stepValid}
            >
              {stepState.stepState === 7 ? "Next Page" : "Next"}
            </button>
          </React.Fragment>
        )}

        {stepState.stepState === 8 && (
          <React.Fragment>
            <button
              type="button"
              name="backward"
              className="backward"
              onClick={handlePrevious}
            >
            {stepState.stepState === 8 ? "Prev Page" : "Prev"}
            </button>
            <ReactConfirmPopup
              trigger={
                <button
                  type="submit"
                  name="process"
                  className="submit"
                >
                  {loading ? (
                    <>
                      <i className="fa fa-spinner-third fa-solid"></i>
                      {"Submitting..."}
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              }
              title="Confirm submitting your survey data"
              text={
                <div>Are you sure you want to submit data provided in the survey form?</div>
              }
              confirmText="Yes, I am sure"
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

export default SurveyForm;
