import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setFormState } from "../../../States/FormState";


function Overall2() {
    const state = useSelector((state) => state.formState.usersData);

    const dispatch = useDispatch();
  
    useEffect(() => {
      if(state === null){
        dispatch(setFormState(1));
      }
     
    }, [state,dispatch]); 
  return (
    <div className="submit step">
      <h3 className="main_question">
        <strong>6/6</strong> Summary
      </h3>
      <div className="summary">
        <ul>
          <li>
            <strong>4</strong>
            <h5>Gender</h5>
            {state.gender && <p>{state.gender}</p>}
          </li>
          <li>
            <strong>5</strong>
            <h5>Programming stacks</h5>
            {state.programming_stack && <p>{state.programming_stack}</p>}
          </li>
          <li>
            <strong>6</strong>
            <h5>Certificates</h5>
            {state.certificate && state.certificate.map((certificate, index) => (
              <div key={index}>
               <p>
                  {`${index + 1} : `}
                  <a href={certificate.url} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFilePdf} style={{ color: "#FF0000", marginLeft: "5px" }} />
                    {" "}
                    {certificate.name}
                  </a>
                </p>
              </div>
            ))}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Overall2