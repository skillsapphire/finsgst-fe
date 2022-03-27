import React, { useState, useContext, useEffect } from 'react'

import { API_BASE_URL } from "../../config/constant";
import { UserContext } from "../../App";
import axios from 'axios';

function FilingReport() {

    const { state, dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState("APRIL")
    const [fy, setFy] = useState("2021");
    const [returnType, setReturnType] = useState("BOTH");
    const [lastRefreshedMasterData, setLastRefreshedMasterData] = useState()

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
                    setLastRefreshedMasterData(userData.data.lastRefreshed);
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
                });

        }

    }
    useEffect(() => {
        loadLastRefreshData();
    }, []);
    return (
        <div className='container mx-auto'>
            <div className='row p-4'>
                <div className='col-md-12 col-sm-12'>
                    <h2 className='mb-3'>Generate Report</h2>
                    <h5 className='text-danger fw-bold mb-3'>Master Data Last Refreshed: {lastRefreshedMasterData}</h5>
                    <hr />
                </div>
                <div className='col-md-3 col-sm-12 mb-2'>
                    <select onChange={(event) => setMonth(event.target.value)} className="form-select">
                        <option selected>--Select--</option>
                        <option value="DECEMBER">December</option>
                        <option value="JANUARY">January</option>
                        <option value="MARCH">March</option>
                    </select>
                </div>
                <div className='col-md-3 col-sm-12 mb-2'>
                    <select onChange={(event) => setFy(event.target.value)} className="form-select">
                        <option selected>--Select--</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                    </select>
                </div>
                <div className='col-md-3 col-sm-12 mb-4'>
                    <select onChange={(event) => setReturnType(event.target.value)} className="form-select">
                        <option selected>--Select--</option>
                        <option value="GSTR1">GSTR1</option>
                        <option value="GSTR3B">GSTR3B</option>
                        <option value="BOTH">Both</option>
                    </select>
                </div>
                <div className='col-md-3 col-sm-12'>
                    <div className='d-grid'>
                        <button className='btn btn-primary' onClick={() => exportExcelFilingReport()}>Download</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FilingReport