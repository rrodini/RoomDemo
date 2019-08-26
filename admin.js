/**
 * admin.js - the admin channel connection.
 */

function showDialog() {
    $("#overlay").show();
    $("#overlay").unbind('click');
    $("#dialog").fadeIn(300);
    $("#password").focus();
}

function hideDialog() {
    $("#overlay").hide();
    $("#dialog").fadeOut(300);
}

let loginCount = 0;

window.onload = function () {
    showDialog();
    var roomNumber;
//    let socket = io('http://localhost:5000/admin', {reconnection: false});
    var socket = io(location.host+'/admin', {transports: ['websocket'], reconnection: false});


    $("#role").text('Admin');
    console.log("onload");

    $("#ok").click(function(e) {
        console.log("password: " + $("#password").val());
        hideDialog();
        e.preventDefault();
        loginCount++;
        var pwd = $("#password").val();
        socket.emit('login', pwd);
    });


    socket.on('connect', function () {
        console.log(">>connect");
        $("#sockid").text(socket.id);
    });

    socket.on('bad.login', function() {
        console.log('>>bad.login');
        if (loginCount <= 3) {
            $("#password").val("");
            $("#password").attr("placeholder","Bad password. Try again.");
            showDialog();
        }
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

    socket.on('disconnect', function (reason) {
//        socket.emit('admin-disconnect', reason);
        window.alert("disconnect:" + reason);
        console.log(">>disconnect reason: " + reason);
    });

    socket.on('player-disconnect', function (reason) {
        window.alert("player-disconnect: " + reason);
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

