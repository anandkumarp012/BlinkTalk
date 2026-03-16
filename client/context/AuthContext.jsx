import React, { useCallback, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';
import { AuthContext } from './authContextStore';


const resolveBackendUrl = () => {
    const rawBackendUrl = (import.meta.env.VITE_BACKEND_URL || '').trim();
    const cleanedBackendUrl = rawBackendUrl.replace(/^['"]|['"]$/g, '');

    if (cleanedBackendUrl) {
        return /^https?:\/\//i.test(cleanedBackendUrl) ? cleanedBackendUrl : `http://${cleanedBackendUrl}`;
    }

    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return window.location.origin;
    }

    return 'http://localhost:5000';
};

const backendUrl = resolveBackendUrl();
axios.defaults.baseURL = backendUrl;

const getErrorMessage = (error) => {
    if (error?.code === 'ERR_NETWORK') {
        return `Cannot reach server at ${backendUrl}. Start backend (server) and try again.`;
    }
    return error?.response?.data?.message || error?.message || 'Something went wrong';
};

export const AuthProvider = ({children}) => {
    const [token, setToken] = React.useState(localStorage.getItem('token'));
    const [authUser, setAuthUser] = React.useState(null);
    const [onlineUsers, setOnlineUsers] = React.useState([]);
    const [socket, setSocket] = React.useState(null);

    // Login function to handle user authenttication and socket connection

    const login = async (state, credentials) => {
        try{
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                setAuthUser(data.userData);
                setToken(data.token);
                connectSocket(data.userData);
                localStorage.setItem('token', data.token);
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error){
            toast.error(getErrorMessage(error));
        }
    }

    //  Logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        toast.success('Logged out successfully');
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
    }

    // Update online users list when receiving updates from the socket

    const updateProfile = async (body) => {
        try{
            const { data } = await axios.put('/api/auth/update-profile', body, {
                headers: { token }
            });
            if (data.success){
                setAuthUser(data.user);
                toast.success(data.message || 'Profile updated');
            }
            else {
                toast.error(data.message);
            }
        }
        catch (error) {
            toast.error(getErrorMessage(error));
        }
    }

    //  connect socket function to handle socket connection and online users updates

    const connectSocket = useCallback((userData)=> {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId : userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on('getOnlineUser', (usersId)=>{
            setOnlineUsers(usersId);
        })
    }, [socket]);

    useEffect(() => {
        if (!token) return;

        const syncAuth = async () => {
            try {
                const { data } = await axios.get('/api/auth/check-auth', {
                    headers: { token }
                });

                if (data.success) {
                    setAuthUser(data.user);
                    connectSocket(data.user);
                } else {
                    localStorage.removeItem('token');
                    setToken(null);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setToken(null);
                setAuthUser(null);
                toast.error(getErrorMessage(error));
            }
        };

        syncAuth();
    }, [token, connectSocket]);

    useEffect(() => {
        return () => {
            if (socket) socket.disconnect();
        };
    }, [socket]);
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
        <AuthContext.Provider value={value}>{children}
        </AuthContext.Provider>
    )
}