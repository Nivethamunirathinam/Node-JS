// Backend File: socket/index.js (Integrated with server.js)

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000", // Allow connection from React frontend
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // 1. Handle joining a room
    socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        // Notify others in the room
        socket.to(roomId).emit('userJoined', `${socket.id} has joined the chat.`);
    });

    // 2. Handle sending a message
    socket.on('sendMessage', async (data) => {
        const { roomId, userId, content } = data;

        // Save the message to MongoDB (asynchronously)
        // const newMessage = new Message({ roomId, senderId: userId, content });
        // await newMessage.save();

        // Broadcast the message to all users in the specific room
        io.to(roomId).emit('receiveMessage', {
            senderId: userId,
            content: content,
            timestamp: new Date().toISOString()
        });
    });

    // 3. Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Logic to update user status or notify rooms can go here
    });
});