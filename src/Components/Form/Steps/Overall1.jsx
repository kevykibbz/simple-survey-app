import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setFormState } from "../../../States/FormState";

function Overall1({setStepValid}) {
  const state = useSelector((state) => state.formState.usersData);

  const dispatch = useDispatch();

  useEffect(() => {
    if(state === null){
      dispatch(setFormState(1));
    }
    setStepValid(true)
   
  }, [state,dispatch,setStepValid]); 

  return (
    <div className="submit step">
      <h3 className="main_question">
        <strong>6/6</strong> Summary
      </h3>
      <div className="summary">
        <ul>
          <li>
            <strong>1</strong>
            <h5>
            What is your full name?
            </h5>
            {state.full_name && <p>{state.full_name}</p>}
          </li>
          <li>
            <strong>2</strong>
            <h5>What is your email address</h5>
            {state.email_address && <p>{state.email_address}</p>}
          </li>
          <li>
            <strong>3</strong>
            <h5>Description</h5>
           {state.description && <p>{state.description}</p>}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Overall1;
