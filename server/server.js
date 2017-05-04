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
}); // registers an event listener



app.use(express.static(publicPath));

let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});