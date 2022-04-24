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
    let accountList = [];
    const [fy, setFy] = useState();
    const [fiscalYears, setFiscalYears] = useState([]);
    const [returnType, setReturnType] = useState("GSTR1");

    const selectAccount = (accountId) => {
        var accountAll = document.getElementById('account-all');
        if (accountId === '000') {
            accountList = [];
        }
        if (accountId === '000' && accountAll.checked) {
            for (var i = 0; i < accounts.length; i++) {
                document.getElementById('account-' + accounts[i].id).checked = true;
                accountList.push(accounts[i].id);
            }
        } else if (accountId === '000' && !accountAll.checked) {
            var accList = document.getElementsByClassName('account-all');
            for (var i = 0; i < accList.length; i++) {
                accList[i].checked = false;
            }
            accountList = [];
        }
        else {
            var account = document.getElementById('account-' + accountId);
            if (account.checked) {
                accountList.push(accountId);
            } else {
                for (var i = 0; i < accountList.length; i++) {
                    if (accountList[i] === accountId) {
                        accountList.splice(i, 1);
                    }
                }
            }
        }
        console.log(accountList);
    }
    const getFiscalYears = () => {
        setFiscalYears([]);
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var year = dateObj.getUTCFullYear();

        if (month <= 3) {
            year = year - 1;
        }
        setFy(year + 1);
        setFiscalYears(prevArray => [...prevArray, year + 1]);
        setFiscalYears(prevArray => [...prevArray, year]);

        console.log(fiscalYears);
    }

    const refreshFilteredGSTData = () => {
        setLoading(true);
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        if (state) {
            //This CA is refreshing All GST no. Filling information from Govt API
            axios.get(`${API_BASE_URL}/api/gst/refresh-master-data-with-filter/${state.userData.id}?accounts=${accountList}&fy=${fy}&type=${returnType}`, config)
                .then((response) => {
                    getAllAccounts();
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                });
            alert("Process Started, We will email you once Refresh is completed!");
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
        getFiscalYears();
    }, []);

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
            <div className="card">
                <div className="card-body table-responsive">
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <h4 className='p-3'>All your GST Accounts</h4>
                        </div>
                        <div className='col-md-4 col-sm-12 mb-4'>
                            <select onChange={(event) => setReturnType(event.target.value)} className="form-select" value={returnType}>
                                <option value="GSTR1">GSTR1</option>
                                <option value="GSTR3B">GSTR3B</option>
                            </select>
                        </div>
                        <div className='col-md-4 col-sm-12 mb-2'>
                            <select onChange={(event) => setFy(event.target.value)} className="form-select" value={fy}>
                                {
                                    fiscalYears.map((year, index) => (
                                        <option key={index}>{year}</option>
                                    ))
                                }

                            </select>
                        </div>
                        <div className='col-md-4 col-sm-12'>
                            {loading ? "" : <div className='d-grid'>
                                <button className='btn btn-danger' onClick={() => refreshFilteredGSTData()}>Refresh Master
                                </button>
                            </div>}
                        </div>
                    </div>
                    <div className='col-12'>
                        {loading ? <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div> : ""}
                    </div>
                    <hr />
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>All
                                    <div className="form-check">
                                        <input id='account-all'
                                            onChange={() => selectAccount('000')} className="form-check-input" type="checkbox" value="" />
                                    </div>
                                </th>
                                <th>#</th>
                                <th>Contact Name</th>
                                <th>Firm Name</th>
                                <th>GST Number</th>
                                <th>Last Refreshed({fiscalYears[0]})</th>
                                <th>Last Refreshed({fiscalYears[1]})</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                accounts.map((account, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div className="form-check">
                                                <input id={`account-${account.id}`}
                                                    onChange={() => selectAccount(account.id)} className="form-check-input account-all" type="checkbox" value="" />
                                            </div>
                                        </td>
                                        <td>{index + 1}</td>
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
                                        <td>
                                            {account.lastRefreshedCurrFyFormatted}
                                        </td>
                                        <td>
                                            {account.lastRefreshedPrevFyFormatted}
                                        </td>
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
            </div>
        </div>
    )
}

export default ViewAccounts