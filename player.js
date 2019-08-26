/**
 * player.js - the player channel connection.
 */


window.onload = function () {
    var roomNumber;
    var invitationCount = 0;
    $("#button").prop("disabled", true);
//    let socket = io('http://localhost:5000/player', {reconnection: false});
    var socket = io(location.host + '/player', {transports: ['websocket'], reconnection: false});
    $("#role").text('Player');
    console.log("onload");
    socket.on('connect', function () {
        console.log(">>connect");
        $("#sockid").text(socket.id);
    });

    socket.on('invitation', function () {
        console.log(">>invitation");
        invitationCount++;
        if (invitationCount <= 3) {
            var num = window.prompt("Enter room #:");
            //roomNumber = num;
            socket.emit("join.room", num);
        } else {
            alert("Please refresh page and try again.")
        }
    });

    socket.on('room.joined', function (num) {
        // confirmation from server.
        console.log(">>room.joined");
        $("#room").text(num);
        roomNumber = num;
        var name = window.prompt("Enter name:");
        socket.emit('register', name);
    });

    socket.on('registered', function() {
        console.log(">>registered");
        $("#button").prop("disabled", false);
    });

    socket.on('toPlayer', function (text) {
        console.log(">>toPlayer");
        console.log(text);
        $("#messages").prepend("<div>" + text + "</div>");
    });

    socket.on('disconnect', function (reason) {
//        socket.emit('player-disconnect', reason);
        window.alert("disconnect:" + reason);
        console.log(">>disconnect reason: " + reason);
    });

    socket.on('admin-disconnect', function (reason) {
        window.alert("admin-disconnect: " + reason);
        console.log(">>disconnect reason: " + reason);
    });

    socket.on('error', function (reason) {
        window.alert("error:" + reason.message);
        console.log(">>error reason: " + reason.message);
    });

    $('#button').on('click', function () {
        console.log("message: " + $("#message").val() + " text: " + $("#text").val());
        socket.emit($("#message").val(), $("#text").val());
    });
}

