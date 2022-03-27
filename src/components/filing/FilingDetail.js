import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Filing.css';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from "../../config/constant";

function FilingDetail() {

    const navigate = useNavigate();
    const { gstNo } = useParams();
    const [loading, setLoading] = useState(false);
    const [gstDetails, setGstDetails] = useState([]);

    const fromDate = '2021-01-01';
    const toDate = '2022-02-28';
    const returnType = 'BOTH';

    const getFilingDetail = () => {
        setLoading(true);
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        axios.get(`${API_BASE_URL}/api/gst/all-gst-details?gstNo=${gstNo}
        &customFromDate=${fromDate}&customToDate=${toDate}&returnType=${returnType}`, config)
            .then((gstFilingDetails) => {
                setGstDetails(gstFilingDetails.data.gstDetails);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        getFilingDetail();
    }, []);

    return (
        <div className='container filing-details-container text-center'>
            <h4 className='p-3'>View Filing Detail</h4>
            {loading ?
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                :
                <div>
                    <div className='row pb-3'>
                        <div className='col-sm-12 d-grid col-md-4 mb-2'>
                            <button className='btn btn-primary d-grid' onClick={() => navigate(-1)}>Back</button>
                        </div>
                    </div>
                    {gstDetails.length > 0 ? <ul className="list-group">
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>GST Number</h5> <span>{gstNo}</span>
                        </li>

                        <li className="list-group-item">
                            <div class="accordion" id="accordionOne">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingOne">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            <div className='container'>
                                                <div className='row'>
                                                    <div className='col-sm-12 col-md-4'>
                                                        <h6>Return Type: {gstDetails[0].returnType}</h6>
                                                    </div>
                                                    <div className='col-sm-12 col-md-4'>
                                                        <h6>Filed Count: {gstDetails[0].filedCount}m</h6>
                                                    </div>
                                                    <div className='col-sm-12 col-md-4'>
                                                        <h6>Not Filed Count: {gstDetails[0].notFiledCount}m</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </h2>
                                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionOne">
                                        <div class="accordion-body">
                                            <ul className='m-0 p-0'>
                                                {gstDetails[0].filingDetails.map((fd, index) => {
                                                    return <li className="list-group-item">
                                                        <p style={{ "font-size": "14px" }}>
                                                            <span>DOF: {fd.isFiled ? fd.dateOfFiling : "NA"}</span>
                                                            <span className='ms-2'>Period: {fd.month}-{fd.year}</span>
                                                        </p>
                                                    </li>
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li className="list-group-item">
                            <div class="accordion" id="accordionTwo">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="headingTwo">
                                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                                            <div className='container'>
                                                <div className='row'>
                                                    <div className='col-sm-12 col-md-4'>
                                                        <h6>Return Type: {gstDetails[1].returnType}</h6>
                                                    </div>
                                                    <div className='col-sm-12 col-md-4'>
                                                        <h6>Filed Count: {gstDetails[1].filedCount}m</h6>
                                                    </div>
                                                    <div className='col-sm-12 col-md-4'>
                                                        <h6>Not Filed Count: {gstDetails[1].notFiledCount}m</h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </h2>
                                    <div id="collapseTwo" class="accordion-collapse collapse show" aria-labelledby="headingTwo" data-bs-parent="#accordionTwo">
                                        <div class="accordion-body">
                                            <ul className='m-0 p-0'>
                                                {gstDetails[1].filingDetails.map((fd, index) => {
                                                    return <li className="list-group-item">
                                                        <p style={{ "font-size": "14px" }}>
                                                            <span>DOF: {fd.isFiled ? fd.dateOfFiling : "NA"}</span>
                                                            <span className='ms-2'>Period: {fd.month}-{fd.year}</span>
                                                        </p>
                                                    </li>
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul> : ""}
                </div>
            }

        </div >
    )
}

export default FilingDetail