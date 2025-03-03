import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:3001", { withCredentials: true });

interface MessageProps{
    senderId:string
    message:string
}

interface AllMessage{
    senderId:string, 
    receiverId:string, 
    messages:[{
        text:string
    }]
}

const useSocket = (userId: string) => {
    const [textMessage, setTextMessage] = useState<MessageProps[]>([]);
    const [allMessage, setAllMessage] = useState<AllMessage[]>([]);
    useEffect(()=> {
        if(!userId) return;
     
        socket.emit('join', userId);

        socket.on('receiveMessage', (data) => {
            setTextMessage((prev)=>{
                return [...prev, data]
            })
        })

        return () => {
            socket.off('receiveMessage');
        }
    }, [userId])


    const sendMessage = ({senderId, receiverId, message}: { senderId: string, receiverId: string, message: string }) => {
        socket.emit('sendMessage', { senderId, receiverId, message });
        setTextMessage((prev) => {
            return [...prev, {senderId, receiverId, message}]
        })
    };

    const getMessage = ({senderId, receiverId}:{senderId:string, receiverId:string}) => {
        socket.emit('getMessages', ({senderId, receiverId}), (newMessage:MessageProps[]) => {
            // setTextMessage((prev) => {
            //     return [...prev, ...newMessage]
            // })
            setTextMessage(newMessage)
        })
    }
    
    
    
    return {sendMessage, textMessage, getMessage, allMessage}
};

export default useSocket;
