/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContextStore";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
const [messages, setMessages] = useState([]);
const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);
const [unseenMessages, setUnseenMessages] = useState({});


const {socket, axios} = useContext(AuthContext);

const getErrorMessage = (error) => {
    return error?.response?.data?.message || error?.message || "Something went wrong";
};

const getAuthConfig = () => ({
    headers: {
        token: localStorage.getItem("token") || "",
    },
});

const getUsers = useCallback(async () => {
    try{
        const { data } = await axios.get("/api/messages/users", getAuthConfig());
        if(data.success){
            setUsers(data.users);
            setUnseenMessages(data.unseenMessages);
        } else {
            toast.error(data.message);
        }
    }catch(error){
        toast.error(getErrorMessage(error));
    }
}, [axios]);

const getMessages = useCallback(async (userId) => {
    try{
       const {data} =  await axios.get(`/api/messages/${userId}`, getAuthConfig());
         if(data.success){
            setMessages(data.messages);
            setUnseenMessages((prev) => ({ ...prev, [userId]: 0 }));
         } else {
            toast.error(data.message);
         }
    }catch(error){
        toast.error(getErrorMessage(error));
    }
}, [axios]);

const sendMessage = useCallback(async (messageData) => {
    if (!selectedUser?._id) return;
    try {
        const { data } = await axios.post(
            `/api/messages/send/${selectedUser._id}`,
            messageData,
            getAuthConfig()
        );
        if (data.success) {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        }
        else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(getErrorMessage(error));
    }
}, [axios, selectedUser]);

useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
        if (selectedUser && (message.senderId === selectedUser._id || message.receiverId === selectedUser._id)) {
            setMessages((prevMessages) => [...prevMessages, message]);
            if (message.senderId === selectedUser._id) {
                setUnseenMessages((prev) => ({ ...prev, [selectedUser._id]: 0 }));
            }
        } else if (message.senderId) {
            setUnseenMessages((prev) => ({
                ...prev,
                [message.senderId]: (prev[message.senderId] || 0) + 1,
            }));
        }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
        socket.off("newMessage", handleNewMessage);
    };
}, [socket, selectedUser]);


    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        setMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
    )
}