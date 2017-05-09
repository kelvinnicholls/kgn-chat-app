let socket = io(); // initiates request

function scrollToBottom() {
    // Selectors
    let messages = $('#messages');
    let newMessage = messages.children('li:last-child');


    //Heights

    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

socket.on('connect', function () {
    console.log("Connected to server");
    let params = $.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log("No Error");
        }
    });

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
    // console.log("New Message", msg);
    // let li = $('<li></li>');
    // li.text(`${msg.from} ${formattedDate}: ${msg.text}`);
    // $('#messages').append(li);
    let template = $('#message-template').html();
    let html = Mustache.render(template, {
        text: msg.text,
        from: msg.from,
        createdAt: formattedDate
    });
    $('#messages').append(html);
    scrollToBottom();
});

// function showName(name) {
//     let template = $('#people-template').html();
//     let html = Mustache.render(template, {
//         name: name
//     });
//     $('#users').append(html);
// }

socket.on('updateUserList', function (users, user) {
    console.log('newUser',users,user);

    let ol = $('<ol></ol>')

    if (users) {
        users.forEach(function (user) {
            ol.append($('<li></li>').text(user));
        });
        $('#users').html(ol);
    };

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


let generateMessage = function (from, text) {
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};


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
    sendLocationButton.attr('disabled', 'disabled').text('Sending Location...');
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
    // console.log("New Location Message", msg);
    // let formattedDate = moment().format('h:mm a');
    // let li = $('<li></li>');
    // let a = $('<a target="_blank">My Current Location<\a>');
    // li.text(`${msg.from}: ${formattedDate} `);
    // a.attr('href', msg.url);
    // li.append(a);
    // $('#messages').append(li);



    let formattedDate = moment(msg.createdAt).format('h:mm a');
    let template = $('#location-message-template').html();
    let html = Mustache.render(template, {
        url: msg.url,
        from: msg.from,
        createdAt: formattedDate
    });
    $('#messages').append(html);

    scrollToBottom();
});