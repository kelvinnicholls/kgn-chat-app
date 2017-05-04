let socket = io(); // initiates request
socket.on('connect', function () {
    console.log("Connected to server");

    // socket.emit('createEmail',{
    //     from: 'kelv@kelv.com',
    //     text: "Hey up",
    //     createdAt: 13355
    // })
});
socket.on('disconnect', function () {
    console.log("Disconnected from server");
});

// socket.on('newEmail', function (email) {
//     console.log("New Email",email);
// });
socket.on('newMessage', function (msg) {
    console.log("New Message", msg);
});

socket.emit('createMessage', {
    from: "Bob",
    text: "How Do"
});