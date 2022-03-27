import React, { useEffect, useState, useContext } from 'react'
import { API_BASE_URL } from "../../config/constant";
import { UserContext } from "../../App";
import axios from 'axios';
import { Button } from 'react-bootstrap';
import './NewFiling.css'

function NewFiling() {

    const { state, dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [fy, setFy] = useState();
    const [fyType, setFyType] = useState();

    const getCurrentFiscalYear = (type) => {
        setFyType(type);
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var year = dateObj.getUTCFullYear();
        if(month <= 3) {
            year = year - 1 ;
            if(type === 'P')
                year = year - 1 ;
        }
        setFy(year);
        return year;
    }

    const getFilingDetails = (fyData, nfGstr1)=>{
        
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        if (state) {
            setLoading(true);
            //On load of view accounts fetach all gst accounts from API for this CA
            axios.get(`${API_BASE_URL}/api/gst/get-filing-det/${state.userData.id}?fy=${getCurrentFiscalYear(fyData)}&nfGstr1=${nfGstr1}`, config)
                .then((items) => {
                    setItems(items.data);
                    console.log(items);
                    setLoading(false);

                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
        }


    }
    useEffect(()=>{
        getFilingDetails("C", "BOTH");
    }, []);

  return (
<>
{loading ? <div className='text-center newfiling-container mx-auto mt-4'><div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div></div> :
    <div className='newfiling-container mx-auto mt-4'>
         <div className="card">
                <div className="card-body table-responsive">
                    <div className="row">
                        <div className="col-md-8 col-sm-12 border-primary">
                            <h4 className='p-3'>GST Filings for <span className="text-danger fw-bold fst-italic">{fy}</span></h4>
                        </div>
                        <div className="col-md-2 col-sm-12 pt-3 border-primary">
                            <div className="d-grid">
                            <button className="btn btn-primary" onClick={()=>{getFilingDetails('C', "BOTH")}}>Current FY</button>
                            </div>
                        </div>
                        <div className="col-md-2 col-sm-12 pt-3 border-primary">
                        <div className="d-grid">
                            <button className="btn btn-primary" onClick={()=>{getFilingDetails('P', "BOTH")}}>Previous FY</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-sm-12 pt-3 border-primary">
                            <div className="d-grid">
                                <button className="btn btn-primary" onClick={()=>{getFilingDetails(fyType, "YES")}}>GSTR1 Not Filed</button>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-12 pt-3 border-primary">
                            <div className="d-grid">
                                <button className="btn btn-primary" onClick={()=>{getFilingDetails(fyType, "NO")}}>GSTR1 All File</button>
                            </div>
                        </div>
                        <div className="col-md-4 col-sm-12 pt-3 border-primary">
                            <div className="d-grid">
                                <button className="btn btn-primary" onClick={()=>{getFilingDetails(fyType, "BOTH")}}>GSTR1 Filed Not Filed Both</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Firm Name</th>
                                <th>GST #</th>
                                <th>GSTR1</th>
                                <th>GSTR1(NF)</th>
                                <th>GSTR3B</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.firmName}</td>
                                        <td>{item.gstNo}</td>
                                        <td>{item.returnPeriodGstr1 == null ? "NA" : item.returnPeriodGstr1}</td>
                                        <td>
                                            {
                                            item.gstr1NotFiledPeriod.map((data, index1)=>(
                                                <h6 key={index1}>{data.month}-{data.year}</h6>
                                            ))
                                            }
                                            
                                        </td>
                                        <td>{item.returnPeriodGst3b == null ? "NA" : item.returnPeriodGst3b}</td>
                                    </tr>
                                ))

                            }

                        </tbody>
                    </table>

                </div>
            </div>
            
    </div>}
    </>
  )
}

export default NewFiling