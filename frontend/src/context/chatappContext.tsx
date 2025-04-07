import React, { createContext, useContext, ReactNode, JSX, useState,useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

export type messageType = {
  createdAt: string,
  receiverId: string,
  senderId: string,
  text: string,
  updatedAt: string,
  image: string,
  coverImage: string,
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

  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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

  isOpen: false,
  setIsOpen: () => { },
}

const MyContext = createContext<ContextProps>(defaultContext);

export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }): JSX.Element => {

  const [socketexist, setSocketexist] = useState(defaultContext.socketexist);
  const [onlineUsers, setOnlineUsers] = useState(defaultContext.onlineUsers);
  const [messages, setMessages] = useState(defaultContext.messages);
  const [isOpen,setIsOpen] = useState(false);

  const socketurl = import.meta.env.MODE === "development"? 'http://localhost:5000' : "https://chatappbackend-hmhz.onrender.com" ;

  const connectSocket = useCallback((userId: string) => {
    if (socketexist) return;
    if (!userId) return;
    const socket = io(socketurl, {
      query: {
        userId,
      },
    });
    socket.connect();
    if (socket) setSocketexist(socket);

    socket.on('onlineUsers', (users: string[]) => {
      setOnlineUsers(users);
    });

    socket.on('newMessage',(data)=>{
      setMessages((prevMessages) => [...prevMessages, data]);
    })
  }, [socketexist, socketurl]);

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
    setMessages,
    isOpen,
    setIsOpen
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