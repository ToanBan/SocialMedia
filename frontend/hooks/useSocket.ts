import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001", { withCredentials: true });

const useSocket = (userId: string) => {
    const [messages, setMessages] = useState<{ senderId: string, message: string}[]>([]);

    useEffect(() => {
        if (!userId) return;

        socket.emit("join", userId);

        socket.on("receiveMessage", (message) => {
            console.log("tin nhắn đã được nhận", message)
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [userId]);

    const sendMessage = (senderId: string, receiverId: string, message: string) => {
        console.log("Gửi tin nhắn:", { senderId, receiverId, message });
        socket.emit("sendMessage", { senderId, receiverId, message });
    };

    const getMessages = (senderId: string, receiverId: string) => {
        socket.emit("getMessages", { senderId, receiverId }, (newMessages: { senderId: string, message: string }[]) => {
            setMessages((prev) => [...prev, ...newMessages]); 
            console.log('các tin nhắn', newMessages);
        });
    };
    

    return { messages, sendMessage, getMessages };
};

export default useSocket;
