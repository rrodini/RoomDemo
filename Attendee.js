/**
 * Attendee class.  Instance is a room attendee.
 */
"use strict";
// constructor
function Attendee(role, id) {
    this.role = role;  // 'admin', 'player', 'projector'
    this.socketid = id;  // socketid

}

module.exports = Attendee;