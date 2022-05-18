import { useNavigate } from "react-router";
import "./css/FriendBar.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState } from "react";
import apiFacade from "../facades/apiFacade";
import friendFacade from "../facades/friendFacade";
import getMsgFromPromise from "../utils/error";

export default function FriendBar(props) {
    const navigate = useNavigate();
    const [currentlySelected, setCurrentlySelected] = useState();

    useEffect(() => {
        loadFriendList();
    }, [props.isLoggedIn])
    
    const loadFriendList = async () => {
        if (props.isLoggedIn) {
            try {
                const res = await friendFacade.getAllFriends();
                props.setFriends(res);
            } catch (e) {
                getMsgFromPromise(e, props.setError)
            }
        } 
    }

    const goToHome = () => {
        if (typeof currentlySelected !== "undefined") {
            currentlySelected.target.className = "friend-list-element";
        }
        navigate("/home");
    }

    const goToConvo = (e) => {
        let userId = e.target.getAttribute("name");
        highlightSelectedFriend(e);
        navigate(`/convo/${userId}`);
    }

    const logout = () => {
        if (typeof currentlySelected !== "undefined") {
            currentlySelected.target.className = "friend-list-element";
        }
        props.setIsLoggedIn(false);
        props.setUser({});
        apiFacade.setTokenInUse("");
        navigate("/");
    }
    
    const highlightSelectedFriend = (e) => {
        if (typeof currentlySelected !== "undefined") {
            currentlySelected.target.className = "friend-list-element";
        }
        e.target.className = "friend-list-element-selected";
        setCurrentlySelected(e);
    }

    return (
        <div hidden={!props.isLoggedIn}>
            <div id="friend-box">
                <ul id="friend-list">
                    {props.friends.length > 0 ? 
                    <div>
                        {props.friends.map(friend => {
                            return (
                                <li className="friend-list-element" onClick={goToConvo} name={friend.username} key={friend.username}>
                                    <img className="friend-pic" src={friend.profilePic} name={friend.username} alt="" /> 
                                    <p className="friend-name">{friend.username}</p>
                                </li>
                            )
                        })}
                    </div>
                    : <p id="empty-fr-list-text">No friends yet...</p>}

                    <div id="user-box" hidden={!props.isLoggedIn}>
                        {props.isLoggedIn &&
                            <Popup 
                            position={"top left"} contentStyle={{width: "180px",borderWidth: "0px", backgroundColor: "rgba(33, 33, 33, 0.942)"}} trigger={<img id="user-pic" src={props.user.profilePic} alt="" />}>
                                <div id="popup-menu">
                                    <button id="logout-btn" onClick={logout}>
                                        Log out
                                    </button>
                                </div>
                            </Popup>
                        }
                        <p id="username">{props.user.username}</p>
                        <button onClick={goToHome} id="home-btn">Home</button>
                    </div>
                </ul>
            </div>
        </div>
    )
}