/**
 * Room class.  A room is a construct where exactly one OLR game is played.
 * It mirrors a socket.io room but doesn't rely on socket.io's representation.
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
/**
 * get the room number
 * @returns room number (number)
 */
Room.prototype.getNumber = function () {
    return this.number;
}
/**
 * get the admin for the room.
 * @returns socket.id for the room admin. (String)
 */
Room.prototype.getAdminId = function () {
    return this.adminId;
}
/**
 * Allow a socket to join the room.
 * @param role one of 'admin', 'player', 'projector'. (String)
 * @param socket socket  object. (Socket)
 * @param id socket id. (String)
 */
Room.prototype.join = function (role, socket, id) {
    let attendee = new Attendee(role, socket, id);
    this.attendees.push(attendee);
}
/**
 * Get the attendees of the room.
 * @returns array of Attendees. (Array)
 */
Room.prototype.getAttendees = function () {
    return this.attendees;
}
/**
 * Print the attendess of the room. For debugging.
 */
Room.prototype.printAttendees = function () {
    console.log('room #%d', this.number);
    let attendees = this.attendees;
    attendees.forEach(function (e) {
        console.log('role: %s id: %s', e.role, e.socketid);
    });

}
/**
 * Allow the socket to leave the room.  Intended for players, and projector.
 * as the admin disconnection should destroy the room.
 * @param id socket.id of leaving socket (String)
 */
Room.prototype.leave = function (id) {
    for (let i = 0; i < this.attendees.length; i++) {
        if (this.attendees[i].socketid === id) {
            this.attendees.splice(i, 1);
            return;
        }
    }
}

module.exports = Room;