import React from 'react'
import { Link } from 'react-router-dom'
import SurveyForm from '../Form/SurveyForm'
import {useDispatch } from "react-redux";
import { setFormState,setPercentage } from "../../States/FormState";
import { updateUsersData } from "../../States/FormState";
import SurveyResponse from '../Form/SurveyResponse';

function Home() {
    const dispatch = useDispatch();
    const handleButtonClick=()=>{
        dispatch(setFormState(1));
        dispatch(updateUsersData(null))
        dispatch(setPercentage(33.33))
    }
  return (
    <>
        <div className="container-fluid full-height">
            <div className="row row-height">
                <div className="col-lg-6 content-left">
                    <div className="content-left-wrapper">
                        <Link to="/" id="logo"  rel="noreferrer"><img src="/static/assets/img/logo.png" alt="" width="49" height="35"/></Link>
                        <div id="social">
                            <ul>
                                <li><a href="https://facebook.com" ><i className="icon-facebook"></i></a></li>
                                <li><a href="https://twitter.com"><i className="icon-twitter"></i></a></li>
                                <li><a href="https://instagram.com"><i className="icon-instagram"></i></a></li>
                                <li><a href="https://linkedin.com"><i className="icon-linkedin"></i></a></li>
                            </ul>
                        </div>
                        <div>
                            <figure><img src="static/assets/img/info_graphic_1.svg" alt="" className="img-fluid"/></figure>
                            <h2>OpinionHarbor Survey</h2>
                            <p>Discover, Share, and Influence. Welcome to OpinionHarbor, where your opinions matter. Take part in surveys that impact industries, shape products, and influence change. Join a community of voices, express your thoughts, and help build a better tomorrow.</p>
                            <button type="button" className="btn_1 rounded" target="_parent" onClick={handleButtonClick}>Start Your Survey</button>
                        </div>
                        <div className="copy">&copy; {new Date().getFullYear()} OpinionHarbor. All Rights Reserved</div>
                    </div>
                </div>
                {/* <Form/> */}
                <div className="col-lg-6 content-right" id="start">
                <div className="tabs">
                    <div className="tab-2">
                        <label className="label" htmlFor="tab2-1">Survey Form</label>
                        <input id="tab2-1" name="tabs-two" type="radio" checked="checked" onChange={()=>{}}/>
                        <div>
                            <SurveyForm/>
                        </div>
                    </div>
                    <div className="tab-2">
                        <label className="label" htmlFor="tab2-2">Survey Response</label>
                        <input id="tab2-2" name="tabs-two" type="radio" onChange={()=>{}}/>
                        <div >
                            <SurveyResponse/>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Home