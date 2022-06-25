
export function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

const apiFacade = () => {
    let tokenInUse = "";

    const setTokenInUse = (token) => {
        tokenInUse = token;
    };

    const getTokenInUse = () => {
        return tokenInUse;
    };

    const login = async (user) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/auth", 
            makeOptions("POST", false, user)
        );
        const result = handleHttpErrors(response);
        return result;
    };

    const logout = async () => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/auth",
            makeOptions("GET", true)
        );
        const result = handleHttpErrors(response);
        return result;
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

    const makeOptions = (method, addToken, body) => {
        var opts = {
        method: method,
        headers: {
            "Content-type": "application/json",
            Accept: "application/json",
        },
        };
        if (addToken) {
            opts.headers["x-access-token"] = getTokenInUse();
        }
        if (body) {
            opts.body = JSON.stringify(body);
        }
        return opts;
    };

    return {
        makeOptions,
        setTokenInUse,
        getTokenInUse,
        login,
        logout,
        register
    };
}

const facade = apiFacade();
export default facade;