import { useEffect, useRef, useState } from "react";
import "./css/Base.css";
import "./css/Conversation.css";
import { msgInitialState } from "../utils/initialStateObjects";
import { useParams } from "react-router-dom";
import messageFacade from "../facades/messageFacade";
import displayError from "../utils/error";
import moment from "moment";
import {io} from 'socket.io-client';
import createRoomId from "../utils/roomIdCreator";

export default function Conversation(props) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState(msgInitialState);
    const [defaultHeight, setDefaultHeight] = useState(""); // shitty solution, but couldn't get the message field to resize properly after hitting the enter key without it.
    const [userTyping, setUserTyping] = useState(false);
    const [lastKnownTop, setLastKnownTop] = useState(0);
    const socket = useRef(null);
    const viewRef = useRef(null);
    let {userId} = useParams();
    let timer;

    useEffect(() => {
        window.addEventListener('keydown', sendMessage);
        return () => {
            window.removeEventListener('keydown', sendMessage);
        }
    });

    useEffect(() => {
        let loggedInUser = props.user.username;
        socket.current = io(process.env.REACT_APP_SOCKET_SERVER_URL, {transports: ['websocket']});
        socket.current.on("connect", () => {
            socket.current.emit("join", createRoomId(loggedInUser, userId, "convo"));
            socket.current.on("reload", () => {
                getAllMessages();
            })
            socket.current.on("isTyping", () => {
                setUserTyping(true);
                if (timer !== null) clearTimeout(timer);
                timer = setTimeout(() => {
                    setUserTyping(false);
                }, 3000);
            })
        })
        return () => {
            socket.current.emit("end");
            socket.current = null;
        }
    });

    useEffect(() => {
        getAllMessages();
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChange = (e) => {
        socket.current.emit("startTyping");
        setDefaultHeight("");
        setNewMessage({...newMessage, [e.target.name]: e.target.value});
    }

    const getAllMessages = async () => {
        try {
            const allMessages = await messageFacade.getAllMessages(userId);
            await changeMessagesToRead(allMessages);
            const unread = await messageFacade.getUnreadMessages();
            props.setUnreadMessages(unread);
            setMessages(prepListForDisplay(allMessages));
        } catch (e) {
            displayError(e, props.setError);
        }
    }

    const changeMessagesToRead = async (messages) => {
        let readMessages = [];
        try {
            messages.forEach(message => {
                if (!message.msgRead && message.receiverName === props.user.username) {
                    readMessages.push(message);
                }
            });
            if (readMessages.length > 0) {
                await messageFacade.changeMessagesToRead(readMessages);
            }
        } catch (e) {
            displayError(e, props.setError);
        }
    }

    const sendMessage = async (e) => {
        if ((e.key === "Enter" && !e.shiftKey) && newMessage.content.length > 0) {
            e.preventDefault();
            setDefaultHeight("20px");
            
            try {
                let msg = prepMsg(props.user.username, userId);
                await messageFacade.sendMessage(msg);
                socket.current.emit("newMsg", props.user.username, msg.receiverName);
                getAllMessages();
            } catch (e) {
                displayError(e, props.setError);
            }
            setNewMessage(msgInitialState);
        } 
    }
    
    const prepMsg = (sender, receiver) => {
        let msg = {...newMessage};
        msg.senderName = sender;
        msg.receiverName = receiver;
        
        // check if msg content is only whitespaces
        if (!msg.content.trim().length) {
            throw "Message must be at least 1 character long.";
        }
        return msg;
    }
    
    const prepListForDisplay = (messageList) => {
        messageList.sort((a, b) => a.timestamp - b.timestamp);
        messageList.forEach(msg => {
            msg.timestamp = moment(msg.timestamp).format('MMMM Do, HH:mm');
        });
        
        return messageList;
    }
    
    const scaleMessageField = (e) => {
        e.target.style.height = "inherit";
        e.target.style.height = `${e.target.scrollHeight - 10}px`;

        if (e.target.value.length < 1) {
            e.target.style.height = "20px";
        } 
    }

    const scrollToBottom = () => {
        let box = document.getElementById("box");
        if (!messages.length || box.scrollTop >= lastKnownTop) {
            viewRef.current?.scrollIntoView({behavior: "smooth"})
            setLastKnownTop(box.scrollTop);
        }
    }

    return (
        <div id="box" className="main-box-scrollable">
            {messages.length > 0 ? 
                <div>
                    {messages.map(msg => {
                        return (
                            <div key={msg.id}>
                                {msg.senderName === props.user.username ? 
                                <div className="user-msg-container">
                                    <p className="user-message">{msg.content}</p>
                                    <p className="user-message-date">{msg.timestamp}</p>
                                </div>
                                : 
                                <>
                                    <div className="friend-msg-container">
                                        <p className="friend-message">{msg.content}</p>
                                    </div>
                                    {/* has to be like this even though user one has date inside container*/}
                                    <p className="friend-message-date">{msg.timestamp}</p> 
                                </>
                                }
                            </div>
                        )})}
                </div>
            : <p id="no-msg-text">No messages between you and {userId} yet.</p>}

            <div id="message-box">
                <p style={{position: "absolute", margin: "-35px 0px 0px 30.5vw", width: "100px", justifyContent: "center", fontSize: "0.8rem"}}>{userTyping && `${userId} is typing...`}</p>
                <textarea
                style={{height: defaultHeight}}
                name="content" 
                id="message-field" 
                onInput={scaleMessageField} 
                onChange={handleChange} 
                placeholder="Send a message"
                value={newMessage.content} />
            </div>
            <div ref={viewRef} />
        </div>
    )
}