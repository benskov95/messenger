import { useEffect, useRef, useState } from "react";
import "./css/Base.css"
import "./css/Home.css"
import userFacade from "../facades/userFacade";
import friendFacade from "../facades/friendFacade";
import displayError from "../utils/error";
import reloadIcon from "../utils/icons/reload-icon.png";
import {io} from 'socket.io-client';

export default function Home(props) {
    const [usersShowing, setUsersShowing] = useState(true);
    const [users, setUsers] = useState([]);
    const [usersCopy, setUsersCopy] = useState([]);
    const [requests, setRequests] = useState([]);
    const socket = useRef(null);
    let searchQuery = "";

    useEffect(() => {
        socket.current = io(process.env.REACT_APP_SOCKET_SERVER_URL, {path: process.env.REACT_APP_SERVER_PATH, transports: ['websocket']});
        socket.current.on("connect", () => {
            socket.current.emit("join", "home");
            socket.current.on(props.user.username, () => {
                loadData();
            })
        })
        return () => {
            socket.current.emit("end");
            socket.current = null;
        }
    });
    
    useEffect(() => {
        loadData();
    }, [props.isLoggedIn]);

    const loadData = async () => {
        if (props.isLoggedIn) {
            try {
                const allUsers = await userFacade.getAllUsers();
                const allRequests = await friendFacade.getAllPendingRequests();
                const res = await friendFacade.getAllFriends();
                setUsers(allUsers);
                setUsersCopy(allUsers);
                setRequests(allRequests);
                props.setFriends(res);
            } catch (e) {
                displayError(e, props.setError);
            }
        }
    }

    const sendFriendRequest = async (e) => {
        let friendRequest = {
            senderProfilePic: props.user.profilePic, 
            senderName: props.user.username, 
            receiverName: e.target.name
        }

        try {
            await friendFacade.sendRequest(friendRequest);
            await loadData();
            socket.current.emit("request", e.target.name);
        } catch (e) {
            displayError(e, props.setError)
        }
    }

    const handleFriendRequest = async (e) => {
        let friendRequest = JSON.parse(e.target.value);
        let isAccepted = e.target.name === "true" ? true : false;
        friendRequest.accepted = isAccepted;

        try {
            await friendFacade.handleRequest(friendRequest);
            await loadData();
            socket.current.emit("request", friendRequest.senderName);
        } catch(e) {
            displayError(e, props.setError);
        }
    }

    const filterUsers = (e) => {
        searchQuery = e.target.value;

        if (searchQuery.length === 0) {
            setUsers([...usersCopy]);
        } else {
            let filteredList = usersCopy.filter(user => user.username.includes(searchQuery));
            setUsers([...filteredList]);
        }
    }
    
    const determineListToShow = (e) => {
        if (e.target.name === "tab1") {
            setUsersShowing(true);
        } else {
            setUsersShowing(false);
        }
    }

    return (
        <div className="main-box">
            <input placeholder="Search..." id="search-bar" onChange={filterUsers} />
            <br />
            <div id="option-btn-container">
                <button name="tab1" id={usersShowing ? "toggled-btn" : "tab-btn"} onClick={determineListToShow}>All users</button>
                <div id="refresh-btn" onClick={loadData}>
                    <img id="refresh-btn-img" src={reloadIcon} alt="" />
                </div>
                {requests.length > 0 &&
                    <p id="friend-req-notifs">{requests.length}</p>
                }
                <button name="tab2" id={usersShowing ? "tab-btn" : "toggled-btn"} onClick={determineListToShow}>Friend requests</button>
            </div>
            <ul className="user-list" hidden={!usersShowing}>
                {users.length > 0 ? 
                <div>
                    {users.map(user => {
                        return (
                            <li className="user-list-element" key={user.username}>
                                <div className="user-el-left">
                                    <img className="user-list-pic" src={user.profilePic} alt="" />
                                    <p className="user-list-name">{user.username}</p>
                                </div>
                                <button className="user-list-add-btn" name={user.username} onClick={sendFriendRequest}>Add</button>
                            </li>
                        )
                    })}
                </div>
                : <p id="empty-list-text">No new users found</p>}
            </ul>
            <ul className="user-list" hidden={usersShowing}>
                {requests.length > 0 ?
                <div>
                    {requests.map(request => {
                        return (
                            <li className="user-list-element" key={request.id}>
                                <div className="user-el-left">
                                    <img style={{marginTop: "5px"}} className="user-list-pic" src={request.senderProfilePic} alt="" />
                                    <p className="user-list-name">{request.senderName}</p>
                                </div>

                                <button 
                                className="user-list-acc-btn" 
                                name="true" 
                                value={JSON.stringify(request)} 
                                onClick={handleFriendRequest}>Accept</button>

                                <br />
                                <br />

                                <button 
                                className="user-list-dec-btn" 
                                name="false" 
                                value={JSON.stringify(request)} 
                                onClick={handleFriendRequest}>Decline</button>
                            </li>
                        )
                    })}
                </div>
                : <p id="empty-list-text">No requests found</p>}
            </ul>
            <p>Find people to chat with above and add them.<br />
            Your friends (when they have accepted your request) can be seen on the left. <br />
            Click a friend to start a conversation. <br />
            You can log out by clicking your profile picture in the bottom left corner.</p>
        </div>
    )
}