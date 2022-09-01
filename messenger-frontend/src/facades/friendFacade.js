import apiFacade from "./apiFacade";

const friendFacade = () => {

    const getAllFriends = async () => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/friend", 
            apiFacade.makeOptions("GET", true)
        );
        const result = apiFacade.handleHttpErrors(response);
        return result;
    }

    const getAllPendingRequests = async () => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/friend/requests", 
            apiFacade.makeOptions("GET", true)
        );
        const result = apiFacade.handleHttpErrors(response);
        return result;
    }

    const sendRequest = async (request) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/friend", 
            apiFacade.makeOptions("POST", true, request)
        );
        const result = apiFacade.handleHttpErrors(response);
        return result;
    }

    const handleRequest = async (request) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/friend", 
            apiFacade.makeOptions("PATCH", true, request)
        );
        const result = apiFacade.handleHttpErrors(response);
        return result;
    }

    return {
        getAllFriends,
        getAllPendingRequests,
        sendRequest,
        handleRequest
    }
}

const facade = friendFacade();
export default facade;