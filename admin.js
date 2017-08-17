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
    var socket = io(location.host+'/admin', {reconnection: false});


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

    $('#button').on('click', function () {
        console.log("message: " + $("#message").val() + " text: " + $("#text").val());
        socket.emit($("#message").val(), $("#text").val());
    });
}

