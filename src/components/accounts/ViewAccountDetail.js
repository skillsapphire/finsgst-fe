import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams, useNavigate } from 'react-router-dom'
import './ViewAccountDetail.css';
import { API_BASE_URL } from "../../config/constant";

function ViewAccountDetail() {

    const navigate = useNavigate();
    const { id } = useParams();//it will grab the id value from url and return that
    const [account, setAccount] = useState({})
    const [loading, setLoading] = useState(false);

    const deleteAccount = () => {
        setLoading(true);
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        axios.delete(`${API_BASE_URL}/api/gst/accounts/${id}`, config)
            .then((response) => {
                setLoading(false);
                alert("Account deleted successfully");
                navigate("/manage/view");
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    const getAccountDetail = () => {
        setLoading(true);
        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        axios.get(`${API_BASE_URL}/api/gst/accounts/detail/${id}`, config)
            .then((accountDetail) => {
                setAccount(accountDetail.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        getAccountDetail();
    }, []);
    return (
        <div className='container viewaccount-container text-center'>
            <h4 className='p-3'>View Account Detail</h4>
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
                        <div className='col-sm-12 d-grid col-md-4 mb-2'>
                            <Link className='btn btn-primary d-grid text-white' to={`/manage/edit/${id}`}>Update Account</Link>
                        </div>
                        <div className='col-sm-12 d-grid col-md-4 mb-2'>
                            <button className='btn btn-danger' onClick={() => deleteAccount()}>Delete Account</button>
                        </div>
                    </div>
                    <ul className="list-group">
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>Contact Person</h5> <span>{account.contactPerson}</span>
                        </li>
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>Firm Name</h5> <span>{account.firmName}</span>
                        </li>
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>GST No</h5> <span>{account.gstNo}</span>
                        </li>
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>Proprietor Name</h5> <span> {account.proprietorName}</span>
                        </li>
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>Contact No</h5> <a href={`tel:${account.phone}`}> {account.phone}</a>
                        </li>
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>Contact Email</h5> <a href={`mailto:${account.email}`}> {account.email}</a>
                        </li>
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>GST Username</h5> <span> {account.gstPortalPassword}</span>
                        </li>
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <h5>GST Password</h5> <span> {account.gstPortalUsername}</span>
                        </li>
                        <li className="list-group-item p-3 d-flex align-items-center justify-content-between">
                            <h5>Last updated</h5> <span> {account.creationDate}</span>
                        </li>
                    </ul>
                </div>
            }

        </div>
    )
}

export default ViewAccountDetail