import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors'
import dotenv from "dotenv"

const app = express();
const server = createServer(app);

dotenv.config();

// Enable CORS for all origins in Express
app.use(cors({
    origin: "*", // Allow all origins
    methods: ['GET', 'POST'],
    credentials: true, // Enable credentials if needed
}));

// Enable CORS for all origins in Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ['GET', 'POST'],
        credentials: true, // Enable credentials if needed
    },
});



console.log("server :" + process.env.CLIENT_URL);

const users = {};

io.on('connection', (socket) => {

    socket.on('joinRoom', ({ userName, room }) => {
        socket.join(room);
        users[socket.id] = { userName, room };
        console.log(`User ${userName} joined room ${room} with ID = ${socket.id}`);
        socket.broadcast.to(room).emit('id1', { messages: `${userName} joined the room`, senderName: userName, userId: socket.id });
    });

    socket.on('message', ({ message, userId, room }) => {
        if (!users[userId]) {
            console.error(`User with ID ${userId} not found`);
            return;
        }

        const senderName = users[userId].userName;
        console.log(`Message from ${senderName} in room ${room}: ${message}`);
        io.to(room).emit('message', { messages: message, senderName, userId });
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            const { userName, room } = users[socket.id];
            socket.broadcast.to(room).emit('discon', { messages: `${userName} left the room`, senderName: userName, userId: socket.id });
            console.log(`User disconnected ID = ${socket.id} i.e. ${userName}`);
            delete users[socket.id];
        }
    });
});


app.get('/', (req, res) => {
    res.send('Connected');
    console.log("Connected log");

});

const port = process.env.PORT;
console.log(port);


server.listen(port, () => {
    console.log(`Server listening at port = ${port}`);
});
