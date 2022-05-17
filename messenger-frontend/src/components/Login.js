import "./css/Login.css";
import { SpinnerDotted } from "spinners-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFacade from "../facades/apiFacade";
import jwtDecode from "jwt-decode";
import getMsgFromPromise from "../utils/error";
import { userInitialState } from "../utils/initialStateObjects";

export default function Login(props) {
    const [loading, setLoading] = useState(false);
    const [loginCreds, setLoginCreds] = useState(userInitialState);
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener('keydown', detectEnterKeyPress);
        return function cleanupListener() {
            // event listener removed when component is unmounted
            window.removeEventListener('keydown', detectEnterKeyPress);
        }
    })

    const handleChange = (e) => {
        props.setError("");
        setLoginCreds({...loginCreds, [e.target.name]: e.target.value});
    }

    const authenticateUser = async () => {
        setLoading(true);
        try {
            const res = await apiFacade.login(loginCreds);
            let token = res.token;
            setLoginCreds(userInitialState);
            apiFacade.setTokenInUse(token);
            props.setUser(jwtDecode(token));
            navigate("/home");
            props.setIsLoggedIn(true);
        } catch (e) {
            getMsgFromPromise(e, props.setError);
        }
        setLoading(false);
    }

    const goToRegister = () => {
        navigate("/register");
    }

    const detectEnterKeyPress = (e) => {
        if (e.key === "Enter") {
            authenticateUser();
        }
    }

    return (
        <div>
            <SpinnerDotted size="20vh" style={{"marginTop": "25vh"}} color="orange" enabled={loading} />
            <h2 hidden={!loading}>Verifying, please wait...</h2>
            <div id="login-box" hidden={props.isLoggedIn}>
                <div hidden={loading}>
                    <h1 id="title">Bonjour</h1>
                    <input 
                    onChange={handleChange}
                    name="username"
                    className="login-input" 
                    placeholder="Enter username" />

                    <br />

                    <input 
                    onChange={handleChange}
                    name="password"
                    className="login-input" 
                    placeholder="Enter password" 
                    type="password" />

                    <button id="register-btn" onClick={goToRegister}>Register</button>
                    <button id="login-btn" onClick={authenticateUser}>Log in</button>
                </div>
            </div>
        </div>
    )
}