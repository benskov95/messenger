import apiFacade, {handleHttpErrors} from "./apiFacade";

const messageFacade = () => {

    const getAllMessages = async (username) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + `/api/message/${username}`, 
            apiFacade.makeOptions("GET", true)
        );
        const result = handleHttpErrors(response);
        return result;
    }

    const getUnreadMessages = async () => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + `/api/message/unread`, 
            apiFacade.makeOptions("GET", true)
        );
        const result = handleHttpErrors(response);
        return result;
    }

    const changeMessagesToRead = async (unreadMessages) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/message", 
            apiFacade.makeOptions("PATCH", true, unreadMessages)
        );
        const result = handleHttpErrors(response);
        return result;
    }

    const sendMessage = async (message) => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/message", 
            apiFacade.makeOptions("POST", true, message)
        );
        const result = handleHttpErrors(response);
        return result;
    }

    return {
        getAllMessages,
        getUnreadMessages,
        changeMessagesToRead,
        sendMessage
    }
}

const facade = messageFacade();
export default facade;