import { useEffect, useRef, useState } from "react";
import "./css/Base.css";
import "./css/Conversation.css";
import { msgInitialState } from "../utils/initialStateObjects";
import { useParams } from "react-router";
import messageFacade from "../facades/messageFacade";
import getMsgFromPromise from "../utils/error";
import moment from "moment";

export default function Conversation(props) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState(msgInitialState);
    const [defaultHeight, setDefaultHeight] = useState(""); // shitty solution, but couldn't get the message field to resize properly after hitting the enter key without it.
    const testRef = useRef(null);
    let {userId} = useParams();

    console.log(messages)
    useEffect(() => {
        window.addEventListener('keydown', sendMessage);
        return function cleanupListener() {
            window.removeEventListener('keydown', sendMessage);
        }
    });

    useEffect(() => {
        getAllMessages();
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getAllMessages = async () => {
        try {
            const res = await messageFacade.getAllMessages(userId);
            setMessages(prepListForDisplay(res));
            scrollToBottom();
        } catch (e) {
            getMsgFromPromise(e, props.setError);
        }
    }
    
    const sendMessage = async (e) => {
        if ((e.key === "Enter" && !e.shiftKey) && newMessage.content.length > 0) {
            e.preventDefault();
            setDefaultHeight("20px");
            let msg = prepMsg(props.user.username, userId);
            setNewMessage(msgInitialState);
            
            try {
                await messageFacade.sendMessage(msg);
                await getAllMessages();
            } catch (e) {
                getMsgFromPromise(e, props.setError);
            }
        } 
    }
    
    const handleChange = (e) => {
        setDefaultHeight("");
        setNewMessage({...newMessage, [e.target.name]: e.target.value});
    }

    const prepMsg = (sender, receiver) => {
        let msg = {...newMessage};
        msg.senderName = sender;
        msg.receiverName = receiver;
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
        testRef.current?.scrollIntoView({behavior: "smooth"})
    }

    return (
        <div className="main-box-scrollable">
            {messages.length > 0 ? 
                <div>
                    {messages.map(msg => {
                        return (
                            <div key={msg.id}>
                                {msg.senderName === props.user.username ? 
                                <div className="usr-msg-container">
                                    <p className="user-message">{msg.content}</p>
                                    <p className="user-message-date">{msg.timestamp}</p>
                                </div>
                                : 
                                <div className="frd-msg-container">
                                    <p className="friend-message">{msg.content}</p>
                                    <p className="friend-message-date">{msg.timestamp}</p>
                                </div>
                                }
                            </div>
                        )})}
                </div>
            : <p id="no-msg-text">No messages between you and {userId} yet.</p>}

            <div id="message-box">
                <textarea
                style={{height: defaultHeight}}
                name="content" 
                id="message-field" 
                onInput={scaleMessageField} 
                onChange={handleChange} 
                placeholder="Send a message"
                value={newMessage.content} />
            </div>
            <div ref={testRef} />
        </div>
    )
}