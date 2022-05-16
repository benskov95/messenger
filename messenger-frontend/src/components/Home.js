import { useEffect, useState } from "react";
import "./css/Base.css"
import "./css/Home.css"
import userFacade from "../facades/userFacade";
import friendFacade from "../facades/friendFacade";

export default function Home({isLoggedIn, user, setFriends}) {
    const [usersShowing, setUsersShowing] = useState(true);
    const [users, setUsers] = useState([]);
    const [usersCopy, setUsersCopy] = useState([]);
    const [requests, setRequests] = useState([]);
    let searchQuery = "";
    
    useEffect(() => {
        loadUsers();
        loadRequests();
    }, [isLoggedIn])

    const loadUsers = async () => {
        if (isLoggedIn) {
            const res = await userFacade.getAllUsers();
            setUsers(res);
            setUsersCopy(res);
        }
    }

    const loadRequests = async () => {
        if (isLoggedIn) {
            const res = await friendFacade.getAllPendingRequests()
            setRequests(res);
        }
    }

    const sendFriendRequest = async (e) => {
        let friendRequest = {
            senderProfilePic: user.profilePic, 
            senderName: user.username, 
            receiverName: e.target.name
        }

        try {
            await friendFacade.sendRequest(friendRequest);
            await loadUsers();
        } catch (e) {
            // print somewhere
        }
    }

    const handleFriendRequest = async (e) => {
        let friendRequest = JSON.parse(e.target.value);
        let isAccepted = e.target.name === "true" ? true : false;
        friendRequest.accepted = isAccepted;

        try {
            const res = await friendFacade.handleRequest(friendRequest);
            if (res.accepted) {
                const res = await friendFacade.getAllFriends();
                setFriends(res);
            }
            await loadRequests();
        } catch(e) {
            // print somewhere
        }
    }

    const filterUsers = (e) => {
        searchQuery = e.target.value;

        if (searchQuery === 0) {
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
            <button name="tab1" id={usersShowing ? "toggled-btn" : "tab-btn"} onClick={determineListToShow}>All users</button>
            <button name="tab2" id={usersShowing ? "tab-btn" : "toggled-btn"} onClick={determineListToShow}>Friend requests</button>
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
                : <p id="empty-list-text">No users found</p>}
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