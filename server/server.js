const path = require('path');
const http = require('http'); // required for socket.io, used by express
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server); // allows us to listen to and emit events between server and client

// gives us acces to http://localhost:3000/socket.io/socket.io.js

io.on('connection', (socket) => {
    console.log("New user connected");
    socket.on('disconnect', () => {
        console.log("Client Disconnected");
    });
    // socket.emit('newEmail', {
    //     from: 'mike@mike.com',
    //     text: "Whats up",
    //     createdAt: 1223
    // });

    // socket.on('createEmail', (data) => {
    //     console.log("Create Email", data);
    // });

    socket.emit('newMessage', {
        from: "Kelv",
        text: "Whats up",
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (msg) => {
        msg.createdAt = new Date().getTime();
        console.log("Create Message", msg);
    });

}); // registers an event listener



app.use(express.static(publicPath));

let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});