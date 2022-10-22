import React from "react";
import Logo from "../../assets/img/Logo.svg";
import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="container">
                <img src={Logo} alt="" className="navbar__logo" />
                <div className="navbar__header">CLOUD STORAGE</div>
                <div className="navbar__login">
                    <NavLink to="/login">Login</NavLink>
                </div>
                <div className="navbar__registration">
                    <NavLink to="/registration">Registration</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
