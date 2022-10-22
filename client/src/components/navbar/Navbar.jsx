import React from "react";
import Logo from "../../assets/img/Logo.svg";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./navbar.css";
import { logout } from "../../reducers/userReducer";

const Navbar = () => {
    const isAuth = useSelector((state) => state.user.isAuth);
    const dispatch = useDispatch();

    return (
        <div className="navbar">
            <div className="container">
                <img src={Logo} alt="" className="navbar__logo" />
                <div className="navbar__header">CLOUD STORAGE</div>
                {!isAuth && (
                    <div className="navbar__login">
                        <NavLink to="/login">Login</NavLink>
                    </div>
                )}
                {!isAuth && (
                    <div className="navbar__register">
                        <NavLink to="/registration">Register</NavLink>
                    </div>
                )}
                {isAuth && (
                    <div
                        className="navbar__login"
                        onClick={() => dispatch(logout())}
                    >
                        Log Out
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
