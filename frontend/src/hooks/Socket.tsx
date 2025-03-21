import { useMyContext } from '@/context/chatappContext';
import { useEffect } from 'react';
import io from 'socket.io-client';


export const useConnectSocket = (userId: string) => {
    const {socketexist,setSocketexist,onlineUsers,setOnlineUsers} = useMyContext();

    useEffect(() => {
        if (socketexist?.connected) return
        if (!userId) return
        const socket = io(`http://localhost:5000`)
        socket.connect();
        if (socket) setSocketexist(socket);

        socket.on('onlineUsers', (users: string[]) => {
            setOnlineUsers(users);
        });
    }, [])

    return { onlineUsers };
}