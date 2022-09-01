
const apiFacade = () => {

    const setAccessToken = (token) => {
        localStorage.setItem("messengerToken", token);
    };

    const getAccessToken = () => {
        return localStorage.getItem("messengerToken");
    };

    const removeAccessToken = () => {
        localStorage.removeItem("messengerToken");
    }

    const login = async (user) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/auth", 
            makeOptions("POST", false, user)
        );
        const result = handleHttpErrors(response);
        return result;
    };

    const loginWithToken = async () => {
        if (getAccessToken() !== null) {
            let token = {token: getAccessToken()};
            const response = await fetch
            (
                process.env.REACT_APP_API_URL + "/api/auth/token",
                makeOptions("POST", false, token)
            )
            const result = handleHttpErrors(response);
            return result;
        } else {
            return false;
        }
    }

    const register = async (user) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/user", 
            makeOptions("POST", false, user)
        );
        const result = handleHttpErrors(response);
        return result;
    }

    const handleHttpErrors = (res) => {
        if (!res.ok) {
            return Promise.reject({ status: res.status, fullError: res.json() });
        }
        return res.json();
    }

    const makeOptions = (method, addToken, body) => {
        var opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
        };
        if (addToken) {
            opts.headers["x-access-token"] = getAccessToken();
        }
        if (body) {
            opts.body = JSON.stringify(body);
        }
        return opts;
    };

    return {
        setAccessToken,
        getAccessToken,
        removeAccessToken,
        login,
        loginWithToken,
        register,
        handleHttpErrors,
        makeOptions
    };
}

const facade = apiFacade();
export default facade;