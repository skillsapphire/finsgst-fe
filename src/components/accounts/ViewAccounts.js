import React, { useEffect, useState, useContext } from 'react'
import './ManageAccounts.css'
import { Link, NavLink } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from "../../config/constant";
import { UserContext } from "../../App";

function ViewAccounts() {

    const { state, dispatch } = useContext(UserContext);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lastRefreshedMasterData, setLastRefreshedMasterData] = useState()

    const refreshGSTData = () => {
        setLoading(true);
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        if (state) {
            //This CA is refreshing All GST no. Filling information from Govt API
            axios.get(`${API_BASE_URL}/api/gst/refresh-master-data/${state.userData.id}`, config)
                .then((response) => {
                    //API call to get logged in user information
                    axios.get(`${API_BASE_URL}/api/currentUser`, config)
                        .then((userData) => {
                            setLastRefreshedMasterData(userData.data.lastRefreshedFormatted);
                            setLoading(false);
                        })
                        .catch((error) => {
                            alert("Error while updating Last Data Refresh Time");
                            setLoading(false);
                            console.log(error);
                        })
                    setLoading(false);

                })
                .catch((error) => {
                    alert("Error while getting Govt. GST Data");
                    setLoading(false);
                    console.log(error);
                })
        }
    }

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
                    setAccounts(accounts.data);
                    setLoading(false);

                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                })

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

    useEffect(() => {
        getAllAccounts();
    }, []);

    /*useEffect(() => {
        console.log(state);
        //On load of view accounts fetach all gst accounts from API for this CA
        axios.get(`${API_BASE_URL}/api/gst/accounts/${state.userData.id}?pageNo=0&pageSize=50000`, config)
            .then((accounts) => {
                //debugger;
                setLoading(false);
    
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            })
    }, []);*/

    return (
        <div className='account-container mx-auto text-center p-3 mt-3'>
            <div className='row mb-2'>
                <div className='col-sm-6 col-md-3'>
                    <NavLink className="nav-link" to="/manage/view">View Accounts</NavLink>

                </div>
                <div className='col-sm-6 col-md-3'>
                    <NavLink className="nav-link" to="/manage">Add Account</NavLink>
                </div>
            </div>
            {loading ? <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> : <div className="card">
                <div className="card-body table-responsive">
                    <div className="row">
                        <div className="col-md-6">
                            <h4 className='p-3'>All your GST Accounts</h4>
                        </div>
                        <div className="col-md-3">
                            <h6 className='text-danger fw-bold mb-3'>Master Data Last Refreshed: {lastRefreshedMasterData}</h6>
                        </div>
                        <div className="col-md-3">
                            <button onClick={() => refreshGSTData()} className='btn btn-danger'>Refresh Data for All GST No. </button>
                        </div>
                    </div>
                    <hr />
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Contact Name</th>
                                <th>Firm Name</th>
                                <th>GST Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                accounts.map((account, index) => (
                                    <tr key={index}>
                                        <td>{account.contactPerson}</td>
                                        <td>{account.firmName}</td>
                                        <td>
                                            <Link to={`/manage/view/${account.id}`}>{account.gstNo}</Link>
                                        </td>
                                        {/*<td>
                                            <Link to={`/users/view/${account.id}`} className="btn btn-info me-2">View</Link>
                                            <Link to={`/users/edit/${account.id}`} className="btn btn-outline-info me-2">Edit</Link>
                                            <Button onClick={() => deleteUser(account.id)} variant="danger">Delete</Button>
                                        </td>*/}
                                    </tr>
                                ))

                                /*
                                users.map((user, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phone}</td>
                                    </tr>
                                })
                                */
                            }

                        </tbody>
                    </table>

                </div>
            </div>}
        </div>
    )
}

export default ViewAccounts