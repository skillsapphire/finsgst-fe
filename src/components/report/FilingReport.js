import React, { useState, useContext, useEffect } from 'react'

import { API_BASE_URL } from "../../config/constant";
import { UserContext } from "../../App";
import axios from 'axios';

function FilingReport() {

    const { state, dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState("APRIL")
    const [fy, setFy] = useState();
    const [fiscalYears, setFiscalYears] = useState([]);
    const [returnType, setReturnType] = useState("BOTH");
    const [lastRefreshedMasterData, setLastRefreshedMasterData] = useState()

    const getFiscalYears = () => {
        setFiscalYears([]);
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var year = dateObj.getUTCFullYear();

        if (month <= 3) {
            year = year - 1;
        }
        setFy(year);
        setFiscalYears(prevArray => [...prevArray, year]);
        setFiscalYears(prevArray => [...prevArray, year - 1]);

        console.log(fiscalYears);
    }

    const loadLastRefreshData = () => {
        setLoading(true);
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        if (state) {
            //API call to get logged in user information
            axios.get(`${API_BASE_URL}/api/currentUser`, config)
                .then((userData) => {
                    setLastRefreshedMasterData(userData.data.lastRefreshedFormatted);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
        }
    }

    const exportExcelFilingReport = () => {

        // var month = 'DECEMBER';
        // var fy = '2021';
        // var returnType = 'BOTH';

        const config = {
            responseType: 'blob',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        if (state) {
            setLoading(true);
            let url = `${API_BASE_URL}/api/gst/get-reports/${state.userData.id}?fiscalYear=${fy}&month=${month}&returnType=${returnType}`;
            axios.get(url, config)
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    var fileName = 'filing_report_' + month + '_' + fy + '.xlsx';
                    link.setAttribute('download', fileName); //or any other extension
                    document.body.appendChild(link);
                    link.click();
                    setLoading(false);
                }).catch((error) => {
                    setLoading(false);
                    console.log(error);
                })

        }

    }
    useEffect(() => {
        getFiscalYears();
    }, []);
    return (
        <div className='container mx-auto'>
            <div className='row p-4'>
                <div className='col-md-12 col-sm-12'>
                    <h2 className='mb-3'>Generate Report</h2>
                    {loading ? <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                        : ""}
                    <hr />
                </div>
                <div className='col-md-3 col-sm-12 mb-2'>
                    <select onChange={(event) => setMonth(event.target.value)} className="form-select" value={month}>
                        <option value="APRIL">April</option>
                        <option value="MAY">May</option>
                        <option value="JUNE">June</option>
                        <option value="JULY">July</option>
                        <option value="AUGUST">August</option>
                        <option value="SEPTEMBER">September</option>
                        <option value="OCTOBER">October</option>
                        <option value="NOVEMBER">November</option>
                        <option value="DECEMBER">December</option>
                        <option value="JANUARY">January</option>
                        <option value="MARCH">March</option>
                    </select>
                </div>
                <div className='col-md-3 col-sm-12 mb-2'>
                    <select onChange={(event) => setFy(event.target.value)} className="form-select" value={fy}>
                        {
                            fiscalYears.map((year, index) => (
                                <option key={index}>{year}</option>
                            ))
                        }

                    </select>
                </div>
                <div className='col-md-3 col-sm-12 mb-4'>
                    <select onChange={(event) => setReturnType(event.target.value)} className="form-select" value={returnType}>
                        <option value="GSTR1">GSTR1</option>
                        <option value="GSTR3B">GSTR3B</option>
                        <option value="BOTH">Both</option>
                    </select>
                </div>
                <div className='col-md-3 col-sm-12'>
                    <div className='d-grid'>
                        <button className='btn btn-success' onClick={() => exportExcelFilingReport()}>Download</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilingReport