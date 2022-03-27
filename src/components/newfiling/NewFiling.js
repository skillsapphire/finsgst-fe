import React, { useEffect, useState, useContext } from 'react'
import { API_BASE_URL } from "../../config/constant";
import { UserContext } from "../../App";
import axios from 'axios';
import './NewFiling.css'

function NewFiling() {

    const { state, dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [fy, setFy] = useState();
    const [fyType, setFyType] = useState();
    const [filingType, setFilingType] = useState();

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
                    setLoading(false);

                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })
        }


    }
    useEffect(()=>{
        setFilingType("YES")
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
                            <button className="btn btn-warning" onClick={()=>{getFilingDetails('C', "BOTH")}}>Current FY</button>
                            </div>
                        </div>
                        <div className="col-md-2 col-sm-12 pt-3 border-primary">
                        <div className="d-grid">
                            <button className="btn btn-warning" onClick={()=>{getFilingDetails('P', "BOTH")}}>Previous FY</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-sm-12 pt-3 border-primary">
                            <h5 className='ms-3'>Filter by GST Type</h5>
                        </div>
                        <div className="col-md-4 col-sm-12 pt-3 border-primary">
                            <select onChange={(event) => setFilingType(event.target.value)} className="form-select" value={filingType}>
                                <option value="YES">One or more GSTR1 Not Filed</option>
                                <option value="NO">All months GSTR1 Filed</option>
                                <option value="BOTH">Both GSTR1 Filed and Not Filed</option>
                            </select>
                        </div>
                        <div className="col-md-4 col-sm-12 pt-3 border-primary">
                            <div className="d-grid">
                                <button className="btn btn-success" onClick={()=>{getFilingDetails(fyType, filingType)}}>Filter</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    {
                        items.length == 0 ? <h3>No Data Found</h3> :
                    <table className="table table-striped table-responsive">
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
                    }
                </div>
            </div>
            
    </div>}
    </>
  )
}

export default NewFiling