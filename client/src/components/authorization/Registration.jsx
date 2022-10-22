import React, { useState } from "react";
import { registration } from "../../actions/user";
import Input from "../../utils/input/Input";

import "./authorization.css";

const Registration = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return (
        <div className="authorization">
            <div className="authorization__header">Registration</div>
            <Input
                value={email}
                setValue={setEmail}
                type="text"
                placeholder="Enter your email..."
            />
            <Input
                value={password}
                setValue={setPassword}
                type="password"
                placeholder="Enter your password..."
            />
            <button
                onClick={() => registration(email, password)}
                className="authorization__btn"
            >
                Register
            </button>
        </div>
    );
};

export default Registration;
