import React, { createContext } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import {io} from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [token, setToken] = React.useState(localStorage.getItem('token'));
    const [authUser, setAuthUser] = React.useState(null);
    const [onlineUsers, setOnlineUsers] = React.useState([]);
    const [socket, setSocket] = React.useState(null);

    //  Check if user is authenticated and if so, set user data and connect the socket

    const checkAuth = async () => {
        try{
            const {data} = await axios.get('/api/auth/check');
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error){
            toast.error(error.message);
        }

    }

    // Login function to handle user authenttication and socket connection

    const login = async (state, crendentials) => {
        try{
            const {data} = await axios.post('/api/auth/${state}', crendentials);
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                localStorage.setItem("token", data.token)
                toast.success(data.message)
            }else{
                toast.error(data.message);
            }
        } catch (error){
            toast.error(error.message);
        }
    }

    //  Logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common['token'] = null;
        toast.success('Logged out successfully');
        socket.disconnect();
    }

    // Update online users list when receiving updates from the socket

    const updateProfile = async (data) => {
        try{
            const {data} = await axios.put('/api/auth/update-profile', body);
            if(data.success){
                setAuthUser(data.user);
                toast.success(data.message);
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    //  connect socket function to handle socket connection and online users updates

    const connectSocket = (userData)=> {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId : userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (usersId);
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth();
    }, [])
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
return(
    <AuthConstext.Provider value={value}>{children}
    </AuthConstext.Provider>
)