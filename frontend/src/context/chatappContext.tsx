import React, { createContext, useContext, ReactNode, JSX, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export type messageType = {
  createdAt: string,
  receiverId: string,
  senderId: string,
  text: string,
  updatedAt: string,
  image: string,
  _id: string,
}

interface ContextProps {
  connectSocket: (userIds: string) => void;
  disconnectSocket: () => void;

  onlineUsers?: string[];
  setOnlineUsers: (users: string[]) => void;

  socketexist?: Socket | null;
  setSocketexist: (socket: Socket | null) => void;

  messages: messageType[];
  setMessages: (messages: messageType[] | ((prevMessages: messageType[]) => messageType[])) => void;
}

const defaultContext: ContextProps = {
  connectSocket: () => { },
  disconnectSocket: () => { },

  onlineUsers: [],
  setOnlineUsers: () => { },

  socketexist: null,
  setSocketexist: () => { },

  messages: [],
  setMessages: () => { },
}

const MyContext = createContext<ContextProps>(defaultContext);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }): JSX.Element => {

  const [socketexist, setSocketexist] = useState(defaultContext.socketexist);
  const [onlineUsers, setOnlineUsers] = useState(defaultContext.onlineUsers);
  const [messages, setMessages] = useState(defaultContext.messages);

  const socketurl = import.meta.env.MODE === "development"? 'http://localhost:5000' : "/" ;

  const connectSocket = (userId: string) => {
    
    if (socketexist) return
    if (!userId) return
    const socket = io(socketurl,{
      query: {
        userId
      }
    })
    socket.connect();
    if (socket) setSocketexist(socket);

    socket.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(users);
    });
  }

  const disconnectSocket = () => {
    if (socketexist) socketexist.disconnect();
  }

  const value = {
    connectSocket,
    disconnectSocket,
    onlineUsers,
    setOnlineUsers,
    socketexist,
    setSocketexist,
    messages,
    setMessages
  };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = (): ContextProps => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};