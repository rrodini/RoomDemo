/**
 * Room class.  A room is a socket.io construct where exactly one OLR game is played.
 * A room is created when an admin connects to the server.
 * A room is destroyed when an admin disconnect from the server.
 */
let Attendee = require('./Attendee');
// constructor
function Room(number, adminId) {
    this.number = number;
    this.adminId = adminId;
    this.attendees = [];
}

Room.prototype.getNumber = function () {
    return this.number;
}

Room.prototype.getAdminId = function () {
    return this.adminId;
}

Room.prototype.join = function (role, id) {
    let attendee = new Attendee(role, id);
    this.attendees.push(attendee);
}

Room.prototype.getAttendees = function () {
    return this.attendees;
}

Room.prototype.printAttendees = function () {
    console.log('room #%d', this.number);
    let attendees = this.attendees;
    attendees.forEach(function (e) {
        console.log('role: %s id: %s', e.role, e.socketid);
    });

}

Room.prototype.leave = function (id) {
    for (let i = 0; i < this.attendees.length; i++) {
        if (this.attendees[i].socketid === id) {
            this.attendees.splice(i, 1);
            return;
        }
    }
}

module.exports = Room;