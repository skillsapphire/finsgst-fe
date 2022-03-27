import React, { useEffect, useState, useContext } from 'react';
import { NavLink, Link } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from "../../config/constant";
import './Filing.css';
import { UserContext } from "../../App";

function ViewAllFilings() {

    const { state, dispatch } = useContext(UserContext);
    const [allFilings, setAllFilings] = useState([]);
    const [loading, setLoading] = useState(false);

    //Get all GST accounts for a CA
    const getAllAccounts = () => {
        setLoading(true);
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };

        if (state) {
            //On load of view accounts fetach all gst accounts from API for this CA
            axios.get(`${API_BASE_URL}/api/gst/accounts/${state.userData.id}?pageNo=0&pageSize=50000`, config)
                .then((accounts) => {
                    fetchAllGSTFilingDetails(accounts.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
        }
    }

    const fetchAllGSTFilingDetails = (accounts) => {

        setAllFilings([]);

        const fromDate = '2021-01-01';
        const toDate = '2022-02-28';
        const returnType = 'BOTH';

        //For Each GST number fetch filing details for both (GSTR1 and GST3B)
        for (var i = 0; i < accounts.length; i++) {
            const gstNo = accounts[i].gstNo;
            const config = {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            };

            //On load of view accounts fetach all gst accounts from API for this CA
            axios.get(`${API_BASE_URL}/api/gst/all-gst-details?gstNo=${gstNo}
        &customFromDate=${fromDate}&customToDate=${toDate}&returnType=${returnType}`, config)
                .then((response) => {
                    setAllFilings(prevArray => [...prevArray, response.data]);
                })
                .catch((error) => {
                    console.log(error);
                })

        }
    }
    useEffect(() => {
        getAllAccounts();
    }, []);
    return (
        <div className='filing-container mx-auto text-center p-3 mt-3'>
            <div className='row mb-2'>
                <div className='col-sm-6 col-md-3'>
                    <NavLink className='nav-link' to="/filing">View All Filings</NavLink>
                </div>
                <div className='col-sm-6 col-md-3'>
                    <NavLink className='nav-link' to="/filing/search">Search Filing</NavLink>
                </div>
            </div>
            {loading ? <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> :
                <div className="row">
                    <h4 className='p-3'>Filing for All GST Account</h4>
                    {allFilings.map((filing, index) => {
                        return <div className="col-sm-6 col-md-3 mb-3">
                            <div >
                                <div >
                                    <ul className="list-group list-group-flush">
                                        <li key={index} className="list-group-item p-2">
                                            <Link to={`/filing/detail/${filing.gstNo}`}>{filing.gstNo}</Link>
                                        </li>
                                        <li className="list-group-item">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <td>{filing.gstDetails[0].returnType}</td>
                                                        <td>F: {filing.gstDetails[0].filedCount}m</td>
                                                        <td>NF: {filing.gstDetails[0].notFiledCount}m</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{filing.gstDetails[1].returnType}</td>
                                                        <td>F: {filing.gstDetails[1].filedCount}m</td>
                                                        <td>NF: {filing.gstDetails[1].notFiledCount}m</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    })}
                </div>
            }
        </div>
    )
}

export default ViewAllFilings