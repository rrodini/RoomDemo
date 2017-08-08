/**
 * admin.js - the admin channel connection.
 */


window.onload = function () {
    var roomNumber;
//    let socket = io('http://localhost:5000/player', {reconnection: false});
    var socket = io(location.host + '/player', {reconnection: false});
    $("#role").text('Player');
    console.log("onload");
    socket.on('connect', function () {
        console.log(">>connect");
        $("#sockid").text(socket.id);
    });

    socket.on('invitation', function () {
        console.log(">>invitation");
        var num = window.prompt("Enter room #:");
        roomNumber = num;
        socket.emit("join.room", num);
    });

    socket.on('room.joined', function (num) {
        console.log(">>room.joined");
        $("#room").text(num);
        roomNumber = num;
    });

    socket.on('toPlayer', function (text) {
        console.log(">>toPlayer");
        console.log(text);
        $("#messages").prepend("<div>" + text + "</div>");
    });

    socket.on('disconnect', function (reason) {
        console.log(">>disconnect reason: " + reason);
    });

    $('#button').on('click', function () {
        console.log("message: " + $("#message").val() + " text: " + $("#text").val());
        socket.emit($("#message").val(), $("#text").val());
    });
}

