import { useNavigate } from "react-router-dom";
import "./css/FriendBar.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useRef, useState } from "react";
import apiFacade from "../facades/apiFacade";
import friendFacade from "../facades/friendFacade";
import messageFacade from "../facades/messageFacade";
import displayError from "../utils/error";
import { io } from "socket.io-client";
import createRoomId from "../utils/roomIdCreator";

export default function FriendBar(props) {
    const navigate = useNavigate();
    const [currentlySelected, setCurrentlySelected] = useState();
    const [currentConvoUser, setCurrentConvoUser] = useState("");
    const socket = useRef(null);

    useEffect(() => {
        if (props.isLoggedIn) {
            loadFriendList();
            loadUnreadMessages();
        }
    }, [props.isLoggedIn]);

    useEffect(() => {
        let loggedInUser = props.user.username;


        socket.current = io(process.env.REACT_APP_CHATROOM_URL, {transports: ['websocket']});
        socket.current.on("connect", () => {
            props.friends.forEach(friend => {
                if (friend.username !== currentConvoUser) {
                    socket.current.emit("join", createRoomId(loggedInUser, friend.username));
                }
            })
        })
        socket.current.on("reload", () => {
            loadUnreadMessages();
        })
        return function disconnectSocket() {
            socket.current.emit("end");
            socket.current = null;
        }
    });
    
    const loadFriendList = async () => {
        try {
            const allFriends = await friendFacade.getAllFriends();
            props.setFriends(allFriends);
        } catch (e) {
            displayError(e, props.setError);
        }
    }

    const loadUnreadMessages = async () => {
        try {
            const allUnreadMessages = await messageFacade.getUnreadMessages();
            let copy = [...allUnreadMessages]
            allUnreadMessages.forEach(msg => {
                if (msg.senderName === currentConvoUser) {
                    copy = copy.slice(0, copy.findIndex(x => x.id === msg.id));
                }
            })
            props.setUnreadMessages(copy);
        } catch (e) {
            displayError(e, props.setError);
        }
    }

    const goToHome = () => {
        if (typeof currentlySelected !== "undefined") {
            currentlySelected.target.className = "friend-list-element";
        }
        setCurrentConvoUser("");
        navigate("/home");
    }

    const goToConvo = (e) => {
        let id = e.target.getAttribute("name");
        setCurrentConvoUser(id);
        highlightSelectedFriend(e);
        navigate(`/convo/${id}`);
    }

    const logout = () => {
        if (typeof currentlySelected !== "undefined") {
            currentlySelected.target.className = "friend-list-element";
        }
        props.setIsLoggedIn(false);
        props.setUser({});
        props.setFriends([]);
        props.setUnreadMessages([]);
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
        <div id="friend-box">
            <ul id="friend-list">
                {props.friends.length > 0 ? 
                <div>
                    {props.friends.map(friend => {
                        let unreadMsg = props.unreadMessages.find(unreadMsg => unreadMsg.senderName === friend.username);
                        return (
                            <li className="friend-list-element" onClick={goToConvo} name={friend.username} key={friend.username}>
                                <img className="friend-pic" src={friend.profilePic} name={friend.username} alt="" />
                                {(unreadMsg !== undefined && unreadMsg.count > 0) &&
                                    <p className="unread-msg-notification">
                                        {unreadMsg.count > 99 ? "99+" : unreadMsg.count}
                                    </p> 
                                }
                                <p className="friend-name">{friend.username}</p>
                            </li>
                        )
                    })}
                </div>
                : <p id="empty-fr-list-text">No friends yet...</p>}

                <div id="user-box" hidden={!props.isLoggedIn}>
                    {props.isLoggedIn &&
                        <Popup position={"top left"} contentStyle={{width: "180px",borderWidth: "0px", backgroundColor: "rgba(33, 33, 33, 0.942)"}} trigger={<img id="user-pic" src={props.user.profilePic} alt="" />}>
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
    )
}