/**
 * Created by Robert on 7/27/17.
 */
var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    server, io;
//let Attendee = require('./Attendee');
let Room = require('./Room');
let Rooms = require('./Rooms');

app.get('/admin.html', function (req, res) {
    res.sendFile(__dirname + '/admin.html');
});
app.get('/admin.js', function (req, res) {
    res.sendFile(__dirname + '/admin.js');
});
app.get('/player.html', function (req, res) {
    res.sendFile(__dirname + '/player.html');
});
app.get('/player.js', function (req, res) {
    res.sendFile(__dirname + '/player.js');
});


server = http.Server(app);
server.listen(5000);

io = socketIO(server);
let rooms = new Rooms(io);
let admin_namespace = io.of("/admin");
let player_namespace = io.of("/player");
console.log(admin_namespace.name);
console.log(player_namespace.name);


// admin channel and events.

admin_namespace.on('connection', function (socket) {
    console.log(">>admin connection");
    //console.log(admin_namespace.connected);
    let room = rooms.create(socket.id);
    let num = room.getNumber();
    room.join('admin', socket.id);
    room.printAttendees();
    socket.roomNum = num;
    socket.join(num);
    socket.emit('room.joined', num);
    console.log("<<room.joined");
    processAdminCommand(socket, num);
});

function processAdminCommand(socket, num) {
    socket.on('toPlayer', function (text) {
        console.log(">>toPlayer");
        console.log(text);
        player_namespace.to(socket.roomNum).emit('toPlayer', text);
    });
    socket.on('disconnect', function(reason) {
        console.log(">>admin disconnect reason: %s", reason);
        let num = socket.roomNum;
        rooms.destroy(num);
    });
}

// player channel and events.

player_namespace.on('connection', function (socket) {
    console.log(">>player connection");
    socket.emit('invitation');
    processPlayerCommand(socket);
});

function processPlayerCommand(socket) {
    socket.on('join.room' , function (num) {
        console.log(">>join.room #%d", num);
        // validate room #.
        num = parseInt(num);
        if (rooms.isValid(num)) {
            socket.roomNum = num;
            socket.join(num);
            let room = rooms.get(num);
            room.join('player', socket.id);
            room.printAttendees();
        } else {
            // sent player another invitation.
            console.log("%s entered bad room #: %s", socket.id, num);
        }
        socket.emit('room.joined', num);
        console.log("<<room.joined");
    });

    socket.on('toAdmin', function (text) {
        console.log(">>toAdmin");
        console.log(text);
        admin_namespace.to(socket.roomNum).emit('toAdmin', text);
    });

    socket.on('disconnect', function (reason) {
        console.log(">>player disconnect reason: %s", reason);
        // remove player from room.
        let num = socket.roomNum;
        let room = rooms.get(num);
        room.leave(socket.id);
        socket.leave(num);
    })
}