import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Login.css";
import axios from 'axios';
import { UserContext } from "../App";
import { API_BASE_URL } from "../config/constant";

function Login() {

    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const submitLogin = (event) => {
        //stop the page refresh when form is submmitted
        event.preventDefault();

        if (!username) {
            alert("Username cannot be empty");
            return;
        }
        if (!password) {
            alert("Password cannot be empty");
            return;
        }

        setLoading(true);
        //Backend API for Login
        axios.post(`${API_BASE_URL}/api/login`,
            { "userName": username, "password": password })
            .then((response) => {
                //debugger;
                var token = response.data.token;
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                //API call to get logged in user information
                axios.get(`${API_BASE_URL}/api/currentUser`, config)
                    .then((userData) => {

                        localStorage.clear();

                        localStorage.setItem("token", JSON.stringify(token));
                        localStorage.setItem("userData", JSON.stringify(userData.data));

                        const user = { "token": token, "userData": userData.data }

                        dispatch({ type: 'USER', payload: user });

                        setLoading(false);
                        navigate("/");

                    })
                    .catch((error) => {
                        setLoading(false);
                        console.log(error);
                    })

            })
            .catch((error) => {
                setLoading(false);
                alert("Incorrect username or password");
            })

    }

    return (
        <div className="container text-center mt-4 gst-lg-width p-3 login-container">
            <h4 className='mb-4 text-center'>Please Login Below</h4>
            {loading ? <div className="m-3 spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div> : ""}
            <form onSubmit={(event) => { submitLogin(event) }}>
                <div className="mb-3">
                    <input placeholder='Enter Username' onChange={(event) => { setUsername(event.target.value) }} type="text" className="form-control"
                        id="username" />
                </div>
                <div className="mb-3">
                    <input placeholder='Enter Password' onChange={(event) => { setPassword(event.target.value) }} type="password" className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form >
        </div >
    )
}

export default Login