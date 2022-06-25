import apiFacade, {handleHttpErrors} from "./apiFacade";

const userFacade = () => {

    const getAllUsers = async () => {
        const response = await fetch
        (
            process.env.REACT_APP_API_URL + "/api/user", 
            apiFacade.makeOptions("GET", true)
        );
        const result = handleHttpErrors(response);
        return result;
    }

    return {
        getAllUsers
    }
}

const facade = userFacade();
export default facade;