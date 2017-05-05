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
    let formattedDate = moment(msg.createdAt).format('h:mm a');
    console.log("New Message", msg);
    let li = $('<li></li>');
    li.text(`${msg.from} ${formattedDate}: ${msg.text}`);
    $('#messages').append(li);
});

// socket.emit('createMessage', (generateMessage('John', 'Hi There!')), function (msg) {
//     console.log("Got it", msg);
// });

// socket.emit('createMessage', {
//     from: "Bob",
//     text: "How Do"
// });

let msgTextBox = $('[name=message]');
let sendLocationButton = $('#sendlocation');


$('#msg-form').on('submit', function (e) {
    e.preventDefault();    
    socket.emit('createMessage', (generateMessage('User', msgTextBox.val())), function (msg) {
        msgTextBox.val('');
    });
})



sendLocationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported by your browser");
    }
    sendLocationButton.attr('disabled','disabled').text('Sending Location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        sendLocationButton.removeAttr('disabled').text('Send Location');
        socket.emit('CreateLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        alert("Unable to fetch location");
        sendLocationButton.removeAttr('disabled').text('Send Location');
        msgTextBox.val('');
    });
});

socket.on('newLocationMessage', function (msg) {
    console.log("New Location Message", msg);
    let formattedDate = moment().format('h:mm a');
    let li = $('<li></li>');
    let a = $('<a target="_blank">My Current Location<\a>');
    li.text(`${msg.from}: ${formattedDate} `);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
});