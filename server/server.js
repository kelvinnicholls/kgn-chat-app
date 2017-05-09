const path = require('path');
const http = require('http'); // required for socket.io, used by express
const express = require('express');
const socketIO = require('socket.io');

const {
    isRealString
} = require('./utils/validation');
const message = require('./utils/message');

let {
    generateMessage,
    generateLocationMessage
} = require('./utils/message');

const {
    Users
} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');

let app = express();
let server = http.createServer(app);
let io = socketIO(server); // allows us to listen to and emit events between server and client

let users = new Users();

// gives us access to http://localhost:3000/socket.io/socket.io.js

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


    //socket.emit emits and event to a single connection
    // socket.emit('newMessage', {
    //     from: "Kelv",
    //     text: "Whats up",
    //     createdAt: new Date().getTime()
    // });

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback("Name and room are required");
        };
        socket.join(params.room);
        users.removeUser(socket.id);
        let user = users.addUser(socket.id, params.name, params.room);
        console.log("User added :", user, users);
        //socket.leave(params.room);

        // io.emit // every connected user 
        // io.to(params.room).emit

        // socket.broadcast.emit // every connected user  other thsn current user
        // socket.broadcast.to(params.room).emit

        // socket.emit // single user


        // socket.emit from admin text welcome to the chat app



        socket.emit('newMessage', generateMessage('Admin', "Welcome to the chat app"));

        // socket.broadcast.emit from admin new user joined

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the ${params.room} room.`));

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        callback();
    });

    socket.on('createMessage', (msg, callback) => {

        let user = null;
        if (isRealString(msg.from)) {
            user = users.getUser(msg.from);
        }
        if (user && isRealString(msg.text)) {
            msg.from = user.name;
            msg.createdAt = new Date().getTime();

            console.log("Create Message", msg);
            //io.emit emits and event to a every single connection
            io.to(user.room).emit('newMessage', msg);
        }

        callback();
        //socket.broadcast.emit('newMessage', msg); // emits to everyone but whoever initiated the event
    });

    socket.on('CreateLocationMessage', (coords) => {
        let user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });


    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the ${user.room} room.`));
        }
    });


}); // registers an event listener



app.use(express.static(publicPath));

let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});