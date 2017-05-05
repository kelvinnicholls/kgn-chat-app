const path = require('path');
const http = require('http'); // required for socket.io, used by express
const express = require('express');
const socketIO = require('socket.io');

const message = require('./utils/message');

let {
    generateMessage
    ,generateLocationMessage
} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server); // allows us to listen to and emit events between server and client

// gives us access to http://localhost:3000/socket.io/socket.io.js

io.on('connection', (socket) => {
    console.log("New user connected");
    socket.on('disconnect', () => {
        console.log("Client Disconnected");
    });

    // socket.emit from admin text welcome to the chat app

    socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app"));

    // socket.broadcast.emit from admin new user joined

    socket.broadcast.emit('newMessage', generateMessage('Admin', "A new user has joined the chat app"));






    // socket.emit('newEmail', {
    //     from: 'mike@mike.com',
    //     text: "Whats up",
    //     createdAt: 1223
    // });

    // socket.on('createEmail', (data) => {
    //     console.log("Create Email", data);
    // });


    //socket.emit emits and event to a single connection
    // socket.emit('newMessage', {
    //     from: "Kelv",
    //     text: "Whats up",
    //     createdAt: new Date().getTime()
    // });

    socket.on('createMessage', (msg, callback) => {
        msg.createdAt = new Date().getTime();
        console.log("Create Message", msg);
        //io.emit emits and event to a every single connection
        io.emit('newMessage', msg);
        callback();
        //socket.broadcast.emit('newMessage', msg); // emits to everyone but whoever initiated the event
    });

    socket.on('CreateLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('User',coords.latitude,coords.longitude));
    });





}); // registers an event listener



app.use(express.static(publicPath));

let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});