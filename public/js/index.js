let socket = io(); // initiates request

let generateMessage = (from, text) => {
    return {
        from,
        text,
        createdAt: new Date().getTime()
    };
}

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
    let li = $('<li></li>');
    li.text(`${msg.from}: ${msg.text}`);
    $('#messages').append(li);
});

// socket.emit('createMessage', (generateMessage('John', 'Hi There!')), function (msg) {
//     console.log("Got it", msg);
// });

// socket.emit('createMessage', {
//     from: "Bob",
//     text: "How Do"
// });

$('#msg-form').on('submit', function (e) {
    e.preventDefault();
    socket.emit('createMessage', (generateMessage('User', $('[name=message]').val())), function (msg) {
        console.log("Got it", msg);
    });
})

let sendLocationButton = $('#sendlocation');

sendLocationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported by your browser");
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log("position", position);
        socket.emit('CreateLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        alert("Unable to fetch location");
    });
});

socket.on('newLocationMessage', function (msg) {
    console.log("New Location Message", msg);
    let li = $('<li></li>');
    let a = $('<a target="_blank">My Current Location<\a>');
    li.text(`${msg.from}: `);
    a.attr('href',msg.url);
    li.append(a);
    $('#messages').append(li);
});