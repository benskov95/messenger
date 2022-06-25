
export function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

const apiFacade = () => {
    let tokenInUse = ""

    const setTokenInUse = (token) => {
        tokenInUse = token;
    };

    const getTokenInUse = () => {
        return tokenInUse;
    };

    const loggedIn = () => {
        const loggedIn = getTokenInUse() != null;
        return loggedIn;
    };

    const login = async (user) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/login", 
            makeOptions("POST", true, user)
        );
        const result = handleHttpErrors(response);
        return result;
    };

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
        if (addToken && loggedIn()) {
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
        loggedIn,
        login,
        register
    };
}

const facade = apiFacade();
export default facade;