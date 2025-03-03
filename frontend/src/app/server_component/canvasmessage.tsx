'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import useSocket from "../../../hooks/useSocket";

interface UserProps {
    _id: string;
    username: string;
    image: string;
}

interface Message {
    senderId: string;
    text: string; 
    _id?: string;
    createdAt?: string;
}

const OffCanvasMessagePage = () => {
    const [data, setData] = useState<UserProps[]>([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [detail, setDetail] = useState<UserProps | null>(null);
    const url = 'http://localhost:3001/uploads/profile/';
    const userId = typeof window !== "undefined" ? localStorage.getItem('userId') : null;
    const {sendMessage, textMessage, getMessage, allMessage} = useSocket(userId as string)
    const fetchChatDetail = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3001/chatfollowingdetail/${id}`, {
                method: "POST",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Lỗi khi lấy thông tin chat!");
            const data = await res.json();
            setDetail(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/chatfollowing");
                const result = await res.json();
                setData(result.message.following);
            } catch (error) {
                console.error("Lỗi khi tải danh sách người theo dõi:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(()=> {
        if(userId && detail){
            getMessage({senderId:userId, receiverId:detail?._id})
        }
    }, [userId, detail?._id])
    
    useEffect(()=> {
        console.log(textMessage)
    });
  
    const OpenDetailChat = () => setOpen(!open);

     
    const handleSendMessage = () => {
        if (!userId || !detail?._id || !message) {
            console.error("Thiếu thông tin để gửi tin nhắn!");
            return;
        }
        
        sendMessage({ senderId: userId, receiverId: detail._id, message });
        setMessage("")
    };
    
    
    

    return (
        <>
            <div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Chats</h5>
                </div>
                <div className="offcanvas-body">
                    {data.length > 0 ? (
                        data.map((user) => (
                            <div 
                                key={user._id} 
                                onClick={() => { OpenDetailChat(); fetchChatDetail(user._id); }} 
                                className="border d-flex align-items-center mt-3" 
                                style={{ borderRadius: "10px" }}>
                                <div className="p-2 d-flex gap-3 align-items-center">
                                    <Image src={`${url}${user.image.replace("uploads\\profile\\", "")}`} alt="avt" height={30} width={30} />
                                    <p className="m-0">{user.username}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Không Theo Dõi Ai</p>
                    )}
                </div>

                {open && detail && (
                    <div className="offcanvas-footer">
                        <div style={{ width: "100%", height: "400px", backgroundColor: "#E0E0E0", position: "relative" }}>
                            <div className="d-flex align-items-center gap-2 justify-content-between">
                                <div className="d-flex align-items-center gap-3">
                                    <Image src={`${url}${detail.image.replace("uploads\\profile\\", "")}`} alt="avt" height={30} width={30} />
                                    <p className="m-0">{detail.username}</p>
                                </div>
                                <Image onClick={OpenDetailChat} src={'/remove.png'} alt="x" width={30} height={30} style={{ cursor: "pointer" }} />
                            </div>

                            <div className="chat-container">
                                <div className="message-list">
                                    {textMessage.map((msg, index) => (
                                        <div key={index} className={`${msg.senderId === userId ? 'message-bubble-left' : 'message-bubble-right'}`}>
                                            <p>{msg.message}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="chat mb-0">
                                <div className="input-group mb-3" style={{ position: "absolute", bottom: "0" }}>
                                    <input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        type="text"
                                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                        placeholder="Nhập Tin Nhắn"
                                        className="form-control"
                                    />
                                    <button onClick={handleSendMessage} type="submit" className="input-group-text">SEND</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OffCanvasMessagePage;
