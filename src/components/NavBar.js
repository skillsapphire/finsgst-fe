import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const NavBar = () => {

    //if user has session than state will not be null else it will be null
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
    }

    const navigationMenu = () => {
        if (state) {//user is logged in
            return [
                <li key="919" className="nav-item">
                    <NavLink className="nav-link" to="/filing">Filing</NavLink>
                </li>,
                // <li key="918" className="nav-item">
                //     <NavLink className="nav-link" to="/sales">Sales</NavLink>
                // </li>,
                // <li key="917" className="nav-item">
                //     <NavLink className="nav-link" to="/purchase">Purchase</NavLink>
                // </li>,
                <li key="9199" className="nav-item">
                    <NavLink className="nav-link" to="/reports">Reports</NavLink>
                </li>,
                <li key="914" className="nav-item">
                    <NavLink className="nav-link" to="/manage/view">Manage</NavLink>
                </li>,
                <li key="916" className="nav-item">
                    <button onClick={() => { logout() }} className="nav-link btn btn-primary btn-sm">
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                </li>
            ]
        } else {
            return [
                <li key="915" className="nav-item">
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
            ]
        }
    }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary bg-gradient">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/">GST Tracker</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <NavLink className="nav-link" to="/">Home</NavLink>
                            </li>
                            {navigationMenu()}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default NavBar;