/**
 * Created by Robert on 7/27/17.
 */
var express = require('express'),
    app = express(),
    http = require('http'),
    socketIO = require('socket.io'),
    dotenv = require('dotenv'),
    md5 = require('MD5'),
    server, io;
//let Attendee = require('./Attendee');
let Room = require('./Room');
let Rooms = require('./Rooms');
dotenv.load();

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
server.listen(process.env.PORT || 5000);

io = socketIO(server);
let pwd = md5(process.env.PASSWORD);
console.log("password: " + pwd);

let rooms = new Rooms();
let admin_namespace = io.of("/admin");
let player_namespace = io.of("/player");
console.log(admin_namespace.name);
console.log(player_namespace.name);


// admin channel and events.

admin_namespace.on('connection', function (socket) {
    console.log(">>admin connection");
    //console.log(admin_namespace.connected);
    processAdminCommand(socket);
});

function processAdminCommand(socket) {
    socket.on('login', function(loginPwd) {
        console.log('>>login pwd: %s', md5(loginPwd));
        if (md5(loginPwd) === pwd) {
            let room = rooms.create(socket.id);
            let num = room.getNumber();
            room.join('admin', socket, socket.id);
            room.printAttendees();
            socket.roomNum = num;
            socket.join(num.toString());
            socket.emit('room.joined', num);
            console.log("<<room.joined");
        } else {
            socket.emit('bad.login');
            console.log('<<bad.login')
        }
    })
    socket.on('toPlayer', function (text) {
        console.log(">>toPlayer");
        console.log(text);
        player_namespace.to(socket.roomNum).emit('toPlayer', text);
    });
    socket.on('disconnect', function(reason) {
        player_namespace.to(socket.roomNum).emit('admin-disconnect', reason);
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
            socket.join(num.toString());
            let room = rooms.get(num);
            room.join('player', socket, socket.id);
            room.printAttendees();
        } else {
            console.log("%s entered bad room #: %s", socket.id, num);
            // sent player another invitation.
            socket.emit('invitation');
            return;
        }
        socket.emit('room.joined', num);
        console.log("<<room.joined");
    });
    socket.on('register' , function(name) {
        console.log(">>register %s", name);
        socket.emit('registered');
//        socket.to(socket.roomNum.toString()).emit('registered');
// doesn't work.
//        io.to(socket.roomNum.toString()).emit('registered');
// bad - broadcasts to all players
//        player_namespace.to(socket.roomNum).emit('registered');
    });
    socket.on('toAdmin', function (text) {
        console.log(">>toAdmin");
        console.log(text);
        admin_namespace.to(socket.roomNum).emit('toAdmin', text);
    });

    socket.on('disconnect', function (reason) {
        console.log(">>player disconnect reason: %s", reason);
        admin_namespace.to(socket.roomNum).emit('player-disconnect', reason);
        // remove player from room.
        let num = socket.roomNum;
        let room = rooms.get(num);
        if (room) {
            room.leave(socket.id);
            socket.leave(num);
        }
    })
}