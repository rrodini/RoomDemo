/**
 * admin.js - the admin channel connection.
 */


window.onload = function () {
    var roomNumber;
//    let socket = io('http://localhost:5000/admin', {reconnection: false});
    var socket = io(location.host+'/admin', {reconnection: false});
    $("#role").text('Admin');
    console.log("onload");
    socket.on('connect', function () {
        console.log(">>connect");
        $("#sockid").text(socket.id);
    });

    socket.on('room.joined', function (num) {
        console.log(">>room.joined");
        $("#room").text(num);
        roomNumber = num;
    });

    socket.on('toAdmin', function (text) {
        console.log(">>toAdmin");
        console.log(text);
        $("#messages").prepend("<div>" + text + "</div>");
    });

    $('#button').on('click', function () {
        console.log("message: " + $("#message").val() + " text: " + $("#text").val());
        socket.emit($("#message").val(), $("#text").val());
    });
}

