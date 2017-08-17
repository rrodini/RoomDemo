/**
 * Attendee class.  Instance is a room attendee.
 */
"use strict";
// constructor
function Attendee(role, socket, id) {
    this.role = role;  // 'admin', 'player', 'projector'
    this.socket = socket; // real socket object
    this.socketid = id;  // socket.id

}

module.exports = Attendee;