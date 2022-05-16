import URL from "../utils/settings";
import apiFacade, {handleHttpErrors} from "./apiFacade";

const messageFacade = () => {

    const getAllMessages= async (username) => {
        const response = await fetch(URL + `/api/message/${username}`, apiFacade.makeOptions("GET", true));
        const result = handleHttpErrors(response);
        return result;
    }

    const sendMessage = async (message) => {
        const response = await fetch(URL + "/api/message", apiFacade.makeOptions("POST", true, message));
        const result = handleHttpErrors(response);
        return result;
    }

    return {
        getAllMessages,
        sendMessage
    }
}

const facade = messageFacade();
export default facade;