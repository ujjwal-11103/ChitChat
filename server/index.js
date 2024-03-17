import { log } from 'console';
import { Socket } from 'dgram';
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        method: ['GET', 'POST'],
        credential: true
    }
})

io.on("connection", (socket) => {

    const users = {}
    console.log(`User connected server side  = ${socket.id}`);


    socket.on('userName', (userName) => {

        console.log(`User ${userName} joined with ID = ${socket.id}`);

        socket.broadcast.emit('id1', { messages: 'Joined', senderName: userName, userId: socket.id });

        users[socket.id] = userName;
        console.log(users[socket.id]);

    });


    socket.on('message', (mess) => {
        console.log(mess);
        io.emit('message', { messages: mess.message, senderName: users[mess.userId], userId: mess.userId })
    })


    socket.on('disconnect', () => {
        socket.broadcast.emit('discon', { senderName: users[socket.id], messages: 'left the chat', userId: socket.id })
        console.log("User disconnected ID = " + socket.id + '  i.e  ' + users[socket.id]);
    })
})


// to check express app connected successfully
app.get('/', (req, res) => {
    res.send("Connected")
})

const port = 5000;

server.listen(port, () => { `listening at port = ${port}` })




