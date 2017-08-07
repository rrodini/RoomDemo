/**
 * Rooms.js - class that creates Room objects and destroys them.
 * This class is a singleton.
 */
let Room = require('./Room');
//constructor
function Rooms(io) {
    this.rooms = [];
    this.io = io;  // reference to socket.io server
}
/**
 * generate a unique four digit room #.
 * @param self reference to rooms object.
 * @returns four digit room # (number).
 */

function genUnique(self) {
    function duplicated(self, num) {
        for (let i = 0; i < self.rooms.length; i++) {
            if (num === self.rooms[i].getNumber()) {
                return true;
            }
        }
        return false;
    }
    let num;
    do {
        let real = Math.random();
        num = Math.floor(real * 10000.0);
    } while (duplicated(self, num));
    return num;
}

Rooms.prototype.isValid = function(num) {
    for (let i = 0; i < this.rooms.length; i++) {
        let room = this.rooms[i];
        if (num === room.getNumber()) {
            return true;
        }
    }
    return false;
}

Rooms.prototype.create = function (adminId) {
    let num = genUnique(this);
    let room = new Room(num, adminId);
    this.rooms.push(room);
    return room;
}

Rooms.prototype.get = function (num) {
    for (let i = 0; i < this.rooms.length; i++) {
        let room = this.rooms[i]
        if (num === room.getNumber()) {
            return room;
        }
    }
    return undefined; // this will lead to run-time error
}
/**
 * destroy the given room given its number.  Assumes that the admin has disconnected.
 * Therefore, disconnect all players and projectors.
 * @param num
 */
Rooms.prototype.destroy = function(num) {
    let index = -1;
    let room;
    for (let i = 0; i < this.rooms.length; i++) {
        room = this.rooms[i];
        if (num === room.getNumber()) {
            index = i;
            break;
        }
    }
    if (index >= 0) {
        // must make a shallow copy of attendees due to disconnection below.
        let attendees = room.getAttendees().slice();
        for (i = 0; i < attendees.length; i++) {
            let attendee = attendees[i];
            if (attendee.role !== 'admin') {
                // scan off the namespace
                let socketid = attendee.socketid;
                let j = socketid.lastIndexOf('#');
                socketid = socketid.substr(j+1);
                // WARNING: using the internal structure of sockets.io here.
                this.io.sockets.sockets[socketid].disconnect(true);
            }
        }
        this.rooms.splice(index, 1);
    }
}


module.exports = Rooms;