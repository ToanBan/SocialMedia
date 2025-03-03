require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const ConnectDB = require('./src/config/db');
const UserRouter = require('./src/routes/userroute');
const PostRouter = require('./src/routes/postroute');
const jwt = require('jsonwebtoken');
const path = require('path');
const http = require('http');
const Message = require('./src/models/messages');
const server = http.createServer(app);
const { Server } = require('socket.io');

ConnectDB();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true
  }
});

let users = new Map();

io.on("connection", (socket) => {
    socket.on('join', userId => {
      users.set(userId, socket.id);
      socket.join(userId);
      console.log("Danh Sách Những Người Dùng Online", users)
    })

    socket.on('sendMessage', async(data) => {
      const senderId = data.senderId;
      const receiverId = data.receiverId;
      const message = data.message

      let chat = await Message.findOne({
        senderId, receiverId
      })

      if(!chat){
        chat = await Message.create({
          senderId, receiverId, messages: [{text:message, senderId}]
        })
        console.log("đã tạo thành công", chat)
      }else{
        chat.messages.push({text:message})
      }
      const receiveSocket = users.get(receiverId);
      if(receiveSocket){
        io.to(receiverId).emit('receiveMessage', {senderId, message});
        console.log("Tin Nhắn Đã Gửi Đi")
      }

      
    })

    socket.on('getMessages', async(data, callback) => {
      const senderId = data.senderId
      const receiverId = data.receiverId;
      if(!senderId){
        console.log('Lỗi Không Thể Lấy Message');
        return;
      }

      console.log({senderId, receiverId})

      const chat = await Message.find({
        $or: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }
        ]
      });

      const filterChatMessage = chat.flatMap((message) => 
        message.messages.map((msg) => ({
          senderId:msg.senderId, 
          message:msg.text
        }))
      )

      console.log(filterChatMessage)

      if(callback) callback(filterChatMessage)
    })
    
});

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

app.use('/', UserRouter);
app.use('/', PostRouter);

app.get('/getprofile', (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Bạn chưa đăng nhập" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey123456789');
    return res.json({ message: decoded.userId });

  } catch (error) {
    return res.status(401).json({ error: "Xác thực không thành công" });
  }
});

server.listen(3001, () => console.log('Server running on port 3001'));
