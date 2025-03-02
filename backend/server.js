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
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      users.set(userId, socket.id);
      socket.join(userId);
      console.log("Danh sách users online:", users);
    }
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    try {
      if (!senderId || !receiverId || !message) return;

      const receiverSocketId = users.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", { senderId, message });
        console.log("Tin nhắn đã gửi");
      } else {
        console.log("Người nhận không online");
      }

      let chat = await Message.findOne({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      });

      if (!chat) {
        chat = new Message({
          senderId,
          receiverId,
          messages: [{ text: message }]
        });
      } else {
        chat.messages.push({ text: message });
      }

      await chat.save();
      console.log('Tin nhắn đã lưu', chat);

    } catch (error) {
      console.error("Lỗi khi lưu tin nhắn:", error);
    }
  });

  // socket.on('getMessages', async ({ senderId, receiverId }, callback) => {
  //   try {
  //     if (!senderId || !receiverId) return callback([]);

  //     const chat = await Message.findOne({
  //       $or: [
  //         { senderId, receiverId },
  //         { senderId: receiverId, receiverId: senderId }
  //       ]
  //     });

  //     callback(chat?.messages || []);
  //   } catch (error) {
  //     console.log(error);
  //     callback([]);
  //   }
  // });

  socket.on("disconnect", () => {
    for (let [key, value] of users.entries()) {
      if (value === socket.id) {
        users.delete(key);
        break;
      }
    }
    console.log("User disconnected:", socket.id);
  });
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
