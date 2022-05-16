import URL from "../utils/settings";
import apiFacade, {handleHttpErrors} from "./apiFacade";

const friendFacade = () => {

    const getAllFriends = async () => {
        const response = await fetch(URL + "/api/friend", apiFacade.makeOptions("GET", true));
        const result = handleHttpErrors(response);
        return result;
    }

    const getAllPendingRequests = async () => {
        const response = await fetch(URL + "/api/friend/requests", apiFacade.makeOptions("GET", true));
        const result = handleHttpErrors(response);
        return result;
    }

    const sendRequest = async (request) => {
        const response = await fetch(URL + "/api/friend", apiFacade.makeOptions("POST", true, request));
        const result = handleHttpErrors(response);
        return result;
    }

    const handleRequest = async (request) => {
        const response = await fetch(URL + "/api/friend", apiFacade.makeOptions("PUT", true, request));
        const result = handleHttpErrors(response);
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