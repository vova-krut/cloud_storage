import React, { useState } from "react";
import Logo from "../../assets/img/Logo.svg";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./navbar.css";
import { logout } from "../../reducers/userReducer";
import { getFiles, searchFiles } from "../../actions/file";
import { showLoader } from "../../reducers/appReducer";
import avatarLogo from "../../assets/img/avatar.svg";
import { API_URL } from "../../config";

const Navbar = () => {
    const isAuth = useSelector((state) => state.user.isAuth);
    const currentDir = useSelector((state) => state.files.currentDir);
    const currentUser = useSelector((state) => state.user.currentUser);
    const dispatch = useDispatch();
    const [searchWord, setSearchWord] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(false);
    const avatar = currentUser.avatar
        ? `${API_URL + currentUser.avatar}`
        : avatarLogo;

    const searchChangeHandler = (event) => {
        setSearchWord(event.target.value);
        if (searchTimeout != false) {
            clearTimeout(searchTimeout);
        }
        dispatch(showLoader());
        if (event.target.value != "") {
            setSearchTimeout(
                setTimeout(
                    (value) => {
                        dispatch(searchFiles(value));
                    },
                    500,
                    event.target.value
                )
            );
        } else {
            dispatch(getFiles(currentDir));
        }
    };

    return (
        <div className="navbar">
            <div className="container">
                <img src={Logo} alt="" className="navbar__logo" />
                <div className="navbar__header">CLOUD STORAGE</div>
                {isAuth && (
                    <input
                        className="navbar__search"
                        type="text"
                        placeholder="Enter file name..."
                        value={searchWord}
                        onChange={(e) => searchChangeHandler(e)}
                    />
                )}
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
                {isAuth && (
                    <NavLink to="/profile">
                        <img className="navbar__avatar" src={avatar} alt="" />
                    </NavLink>
                )}
            </div>
        </div>
    );
};

export default Navbar;
