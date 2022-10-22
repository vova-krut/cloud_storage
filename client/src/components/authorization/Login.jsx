import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../actions/user";
import Input from "../../utils/input/Input";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    return (
        <div className="authorization">
            <div className="authorization__header">Login</div>
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
                onClick={() => dispatch(login(email, password))}
                className="authorization__btn"
            >
                Login
            </button>
        </div>
    );
};

export default Login;
