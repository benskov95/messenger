import { useEffect, useState } from "react";
import { userInitialState } from "../utils/initialStateObjects";
import apiFacade from "../facades/apiFacade";
import { SpinnerDotted } from "spinners-react";
import displayError from "../utils/error";
import "./css/Register.css";
import "./css/Login.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const [newUser, setNewUser] = useState(userInitialState);
    const [status, setStatus] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener('keydown', detectEnterKeyPress);
        return function cleanupListener() {
            // event listener removed when component is unmounted
            window.removeEventListener('keydown', detectEnterKeyPress);
        }
    });

    const handleChange = (e) => {
        setNewUser({...newUser, [e.target.name]: e.target.value})
    }

    const registerUser = async () => {
        setLoading(true);
        try {
            await apiFacade.register(newUser);
            setIsSuccess(true);
            setStatus("You have successfully registered your account. Go back to log in.");
            setNewUser(userInitialState);
            console.log("ay")
        } catch (e) {
            setIsSuccess(false);
            displayError(e, setStatus);
        }
        setLoading(false);
    }

    const detectEnterKeyPress = (e) => {
        if (e.key === "Enter") {
            registerUser();
        }
    }

    const handleCheckboxClick = () => {
        setShowPw(!showPw);
    }

    const goToLogin = () => {
        navigate("/");
    }

    return (
        <div>
            <SpinnerDotted size="20vh" style={{"marginTop": "25vh"}} color="orange" enabled={loading} />
            <h2 hidden={!loading}>Registering...</h2>
            <div id="login-box">
                <div hidden={loading}>
                    <h1 id="title">Register</h1>
                    <input 
                    onChange={handleChange}
                    value={newUser.username}
                    name="username"
                    className="login-input" 
                    placeholder="Enter username" />

                    <br />

                    <input 
                    onChange={handleChange}
                    value={newUser.password}
                    name="password"
                    className="login-input" 
                    placeholder="Enter password" 
                    type={showPw ? "text" : "password"} />

                    <br/>

                    <div id="checkbox-div">
                        <input 
                        id="pw-checkbox" 
                        type="checkbox" 
                        onClick={handleCheckboxClick} />
                        <p id="pw-checkbox-text">Show password</p>
                    </div>
                    
                    <p style={{color: isSuccess ? "green" : "red"}}>{status}</p>
                    <button id="login-btn" onClick={registerUser}>Register</button>
                    <button id="go-back-btn" onClick={goToLogin}>Go back</button>
                </div>
            </div>
        </div>
    )
}