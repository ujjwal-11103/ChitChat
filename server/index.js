import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import SocketIOFile from 'socket.io-file';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Change this to your client's address
        methods: ['GET', 'POST'],
    },
});

app.use(cors({
    origin: 'http://localhost:5173', // Change this to your client's address
}));

const users = {};

io.on('connection', (socket) => {
    const uploader = new SocketIOFile(socket, {
        uploadDir: './uploads', // Where to save the files
        accepts: ['image/*', 'application/pdf', 'application/zip', 'audio/*', 'video/*'], // Accepts only these files types
        maxFileSize: 4194304, // 4 MB limit
        chunkSize: 10240, // 10 KB
        transmissionDelay: 0,
        overwrite: true
    });

    uploader.on('start', (fileInfo) => {
        console.log('Start uploading');
        console.log(fileInfo);
    });

    uploader.on('stream', (fileInfo) => {
        console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
    });

    uploader.on('complete', (fileInfo) => {
        console.log('Upload Complete.');
        console.log(fileInfo);
        const { room, userName } = fileInfo.data;
        const fileUrl = `./uploads/${fileInfo.name}`;
        io.to(room).emit('file', { file: true, fileName: fileInfo.name, fileUrl, userId: socket.id, senderName: userName });
    });

    uploader.on('error', (err) => {
        console.log('Error!', err);
    });

    uploader.on('abort', (fileInfo) => {
        console.log('Aborted: ', fileInfo);
    });

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

app.use('./uploads', express.static(path.join(__dirname, './uploads')));

app.get('/', (req, res) => {
    res.send('Connected');
});

const port = 5000;

server.listen(port, () => {
    console.log(`Server listening at port = ${port}`);
});
