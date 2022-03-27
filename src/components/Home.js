import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from "../App";
import { Link, useNavigate, useParams } from 'react-router-dom'
import './Home.css';

function Home() {
    const { state, dispatch } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    return (
        <>
        {state == null ? <div className='home-container py-5 text-center'>
            <h3>Welcome to GST Management Application</h3>
        </div> : 
        <div className='home-container py-5 text-center mx-auto'>
            <h3>Welcome {state.userData.firstName} to GST Management Application</h3>
            <br/>
            <div>
                    <div>
                        <ul className="list-group">
                            <li className="list-group-item d-flex align-items-center justify-content-between">
                                <h5>Username</h5> <span>{state.userData.username}</span>
                            </li>
                            <li className="list-group-item d-flex align-items-center justify-content-between">
                                <h5>Firstname</h5> <span>{state.userData.firstName}</span>
                            </li>
                            <li className="list-group-item d-flex align-items-center justify-content-between">
                                <h5>Lastname</h5> <span>{state.userData.lastName}</span>
                            </li>
                            <li className="list-group-item d-flex align-items-center justify-content-between">
                                <h5>Phone</h5> <a href={`tel:${state.userData.phone}`}> {state.userData.phone}</a>
                            </li>
                            <li className="list-group-item d-flex align-items-center justify-content-between">
                                <h5>Email</h5> <a href={`mailto:${state.userData.email}`}> {state.userData.email}</a>
                            </li>
                        </ul>
                    </div>
                    <div className='row pt-3 '>
                        {/* <div className='col-sm-12 d-grid col-md-4 mb-2'>
                            <Link className='btn btn-primary d-grid text-white' to={`/profile/edit`}>Update Profile</Link>
                        </div> */}
                        <div className='col-sm-12 d-grid col-md-4 mb-2'>
                            <Link className='btn btn-primary d-grid text-white' to={`/profile/edit-password`}>Change Password</Link>
                        </div>
                    </div>
            </div>
        </div>
    
        }
        </>
    )
}

export default Home