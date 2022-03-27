import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from "../../App";
import { API_BASE_URL } from "../../config/constant";
import axios from 'axios';
import './UpdatePassword.css'


function UpdatePassword() {

    const { state, dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const navigate = useNavigate();


    const onSubmit = (event) => {

        event.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            alert("Password dont match");
            return;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        };

        var url = `${API_BASE_URL}/api/update-password/${state.userData.id}`;
        if (state.userData.id) {
            const requestData = {
                "password": password,
            };
            axios.patch(url, requestData, config)
                .then((response) => {
                    setPassword("");
                    setConfirmPassword("");
                    alert("Password updated successfully!")
                    setLoading(false);
                    navigate('/');

                })
                .catch((error) => {
                    setLoading(false);
                    console.log(error);
                });

        }
    }

    return (
        <div className='update-password-container mx-auto  mt-2'>
            {state == null ? <div>Please login</div> :
                <div className='p-3'>
                    <div className="row mb-2">
                        <div className="col-md-12 col-sm-12">
                            <h5>Change Password</h5>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 col-sm-12">
                            <form onSubmit={(event) => { onSubmit(event) }}>
                                <div className='row'>
                                    <div className='col-sm-12 mb-3'>
                                        <input value={password} onChange={(ev) => { setPassword(ev.target.value) }}
                                            placeholder='Enter New Password'
                                            type="password"
                                            className="form-control"
                                            required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-12 mb-3'>
                                        <input value={confirmPassword} onChange={(ev) => { setConfirmPassword(ev.target.value) }}
                                            placeholder='Confirm New Password'
                                            type="password"
                                            className="form-control" required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-sm-12 mb-3'>
                                        <input type="submit" className='btn btn-primary' value="Submit" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default UpdatePassword