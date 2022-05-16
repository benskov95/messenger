import URL from "../utils/settings";
import apiFacade, {handleHttpErrors} from "./apiFacade";

const userFacade = () => {

    const getAllUsers = async () => {
        const response = await fetch(URL + "/api/user", apiFacade.makeOptions("GET", true));
        const result = handleHttpErrors(response);
        return result;
    }

    return {
        getAllUsers
    }
}

const facade = userFacade();
export default facade;