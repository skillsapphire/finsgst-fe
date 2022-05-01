import React, { useState, useContext, useEffect } from 'react'
import './ManageAccounts.css'
import { NavLink, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import { API_BASE_URL } from "../../config/constant";
import { UserContext } from "../../App";

function ManageAccounts() {

    const { state, dispatch } = useContext(UserContext);
    const { id } = useParams();//it will grab the id value from url and return that

    const [firmName, setFirmName] = useState("");
    const [contactPerson, setContactPerson] = useState("");
    const [proprietorName, setProprietorName] = useState("");
    const [gstNo, setGstNo] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [gstPortalUsername, setGstPortalUsername] = useState("");
    const [gstPortalPassword, setGstPortalPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const addAccount = () => {
        setFirmName("");
        setContactPerson("");
        setProprietorName("");
        setGstNo("");
        setContactNo("");
        setContactEmail("");
        setGstPortalUsername("");
        setGstPortalPassword("");
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
                setFirmName(accountDetail.data.firmName);
                setContactPerson(accountDetail.data.contactPerson);
                setProprietorName(accountDetail.data.proprietorName);
                setGstNo(accountDetail.data.gstNo);
                setContactNo(accountDetail.data.phone);
                setContactEmail(accountDetail.data.email);
                setGstPortalUsername(accountDetail.data.gstPortalUsername);
                setGstPortalPassword(accountDetail.data.gstPortalPassword);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        if (id) {
            getAccountDetail();
        }
    }, []);

    const onSubmit = (event) => {

        event.preventDefault();
        setLoading(true);

        if (!firmName) {
            Swal.fire({
                icon: 'error',
                title: 'Firm Name cannot be empty.',
              });
            return;
        }
        if (!contactPerson) {
            Swal.fire({
                icon: 'error',
                title: 'Contact Person cannot be empty.',
              });
            return;
        }
        if (!proprietorName) {
            Swal.fire({
                icon: 'error',
                title: 'Proprietor Name cannot be empty.',
              });
            return;
        }
        if (!gstNo) {
            Swal.fire({
                icon: 'error',
                title: 'GST Number cannot be empty.',
              });
            return;
        }
        if (!contactNo) {
            Swal.fire({
                icon: 'error',
                title: 'Contact Number cannot be empty.',
              });
            return;
        }
        if (!contactEmail) {
            Swal.fire({
                icon: 'error',
                title: 'Contact Email cannot be empty.',
              });
            return;
        }
        if (!firmName) {
            Swal.fire({
                icon: 'error',
                title: 'Firm Name cannot be empty.',
              });
            return;
        }
        if (!contactPerson) {
            Swal.fire({
                icon: 'error',
                title: 'Contact Person cannot be empty.',
              });
            return;
        }
        if (!gstPortalUsername) {
            Swal.fire({
                icon: 'error',
                title: 'GST Portal Username cannot be empty.',
              });
            return;
        }
        if (!gstPortalPassword) {
            Swal.fire({
                icon: 'error',
                title: 'GST Portal Password cannot be empty.',
              });
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };
        var url = `${API_BASE_URL}/api/gst/accounts`;
        if (id) {
            const requestData = {
                "id": id,
                "gstNo": gstNo,
                "contactPerson": contactPerson,
                "proprietorName": proprietorName,
                "email": contactEmail,
                "phone": contactNo,
                "gstPortalUsername": gstPortalUsername,
                "gstPortalPassword": gstPortalPassword,
                "firmName": firmName,
                "caId": state.userData.id
            };
            url = `${API_BASE_URL}/api/gst/accounts/${id}`;
            axios.put(url, requestData, config)
                .then((response) => {
                    //console.log(response);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success, Click View Accounts to see the details!',
                      });
                    
                    setLoading(false);
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                      });
                    setLoading(false);
                    console.log(error);
                });
        } else {
            const requestData = {
                "gstNo": gstNo,
                "contactPerson": contactPerson,
                "proprietorName": proprietorName,
                "email": contactEmail,
                "phone": contactNo,
                "gstPortalUsername": gstPortalUsername,
                "gstPortalPassword": gstPortalPassword,
                "firmName": firmName,
                "caId": state.userData.id
            };
            axios.post(url, requestData, config)
                .then((response) => {
                    //console.log(response);
                    Swal.fire("Success, Click View Accounts to see the details!")
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                });
        }

    }
    return (
        <div className='account-container mx-auto text-center p-3 mt-3'>
            <div className='row mb-2'>
                <div className='col-sm-6 col-md-3'>
                    <NavLink className='nav-link' to="/manage/view">View Accounts</NavLink>
                </div>
                <div className='col-sm-6 col-md-3'>
                    <NavLink onClick={() => { addAccount() }} className='nav-link' to="/manage">Add Account</NavLink>
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h4 className='p-3'>{id ? "Edit Account" : "Add Account"}</h4>
                    {loading ?
                        <div className="spinner-border text-primary mb-3" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        : ""}
                    <form onSubmit={(event) => { onSubmit(event) }}>
                        <div className='row'>
                            <div className='col-sm-6 mb-3'>
                                <input value={firmName} onChange={(ev) => { setFirmName(ev.target.value) }} placeholder='Firm Name' type="text" className="form-control" />
                            </div>
                            <div className='col-sm-6 mb-3'>
                                <input value={contactPerson} onChange={(ev) => { setContactPerson(ev.target.value) }} placeholder='Contact Person Name' type="text" className="form-control" />
                            </div>
                            <div className='col-sm-6 mb-3'>
                                <input value={proprietorName} onChange={(ev) => { setProprietorName(ev.target.value) }} placeholder='Proprietor Name' type="text" className="form-control" />
                            </div>
                            <div className='col-sm-6 mb-3'>
                                <input value={gstNo} onChange={(ev) => { setGstNo(ev.target.value) }} placeholder='GST Number' type="text" className="form-control" />
                            </div>
                            <div className='col-sm-6 mb-3'>
                                <input value={contactNo} onChange={(ev) => { setContactNo(ev.target.value) }} placeholder='Contact Number' type="text" className="form-control" />
                            </div>
                            <div className='col-sm-6 mb-3'>
                                <input value={contactEmail} onChange={(ev) => { setContactEmail(ev.target.value) }} placeholder='Contact Email' type="email" className="form-control" />
                            </div>
                            <div className='col-sm-6 mb-3'>
                                <input value={gstPortalUsername} onChange={(ev) => { setGstPortalUsername(ev.target.value) }} placeholder='GST Username' type="text" className="form-control" />
                            </div>
                            <div className='col-sm-6 mb-3'>
                                <input value={gstPortalPassword} onChange={(ev) => { setGstPortalPassword(ev.target.value) }} placeholder='GST Password' type="text" className="form-control" />
                            </div>
                            <div className='col-sm-12 d-grid mb-3'>
                                <input type="submit" className='btn btn-primary d-grid' value="Submit" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ManageAccounts