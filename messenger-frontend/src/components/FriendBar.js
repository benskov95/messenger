import { useNavigate } from "react-router";
import "./css/FriendBar.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect } from "react";
import apiFacade from "../facades/apiFacade";
import friendFacade from "../facades/friendFacade";

export default function FriendBar({isLoggedIn, setIsLoggedIn, user, setUser, friends, setFriends}) {
    const navigate = useNavigate();

    useEffect(() => {
        loadFriendList();
    }, [isLoggedIn])
    
    const loadFriendList = async () => {
        if (isLoggedIn) {
            const res = await friendFacade.getAllFriends();
            setFriends(res);
        } 
    }

    const goToHome = () => {
        navigate("/home");
    }

    const goToConvo = (e) => {
        let userId = e.target.getAttribute("name");
        navigate(`/convo/${userId}`);
    }

    const logOut = () => {
        setIsLoggedIn(false);
        setUser({});
        apiFacade.setTokenInUse("");
        navigate("/");
    }

    return (
        <div hidden={!isLoggedIn}>
            <div id="friend-box">
                <ul id="friend-list">
                    {friends.length > 0 ? 
                    <div>
                        {friends.map(friend => {
                            return (
                                <li className="friend-list-element" onClick={goToConvo} name={friend.username} key={friend.username}>
                                    <img className="friend-pic" src={friend.profilePic} name={friend.username} alt="" /> 
                                    <p className="friend-name">{friend.username}</p>
                                </li>
                            )
                        })}
                    </div>
                    : <p id="empty-fr-list-text">No friends yet...</p>}

                    <div id="user-box" hidden={!isLoggedIn}>
                        {isLoggedIn &&
                            <Popup position={"top left"} contentStyle={{width: "180px",borderWidth: "0px", backgroundColor: "rgba(33, 33, 33, 0.942)"}} trigger={<img id="user-pic" src={user.profilePic} alt="" />}>
                                <div id="popup-menu">
                                    <button id="logout-btn" onClick={logOut}>
                                        Log out
                                    </button>
                                </div>
                            </Popup>
                        }
                        <p id="username">{user.username}</p>
                        <button onClick={goToHome} id="home-btn">Home</button>
                    </div>
                </ul>
            </div>
        </div>
    )
}