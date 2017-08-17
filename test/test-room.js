/**
 * Unit tests for Room.js module.
 */
let Attendee = require('../Attendee');
let Room = require('../Room');

let room; // a room object.


exports['setUp'] = function(callback) {
    room = new Room(1000, 'AdminId')
    return callback();
};

exports['tearDown'] = function(callback) {
    return callback();
};

exports['create room'] = function(test) {
    test.ok(room, "room should not be null");
    test.equal(room.getNumber(), 1000);
    test.equal(room.getAdminId(), 'AdminId');
    test.done();
};

exports['populate room'] = function(test) {
    room.join('admin', new Object(), 'AdminId');
    room.join('player', new Object(), 'player1');
    room.join('player', new Object(), 'player1');
    test.ok(room, "room should not be null");
    test.equal(room.getNumber(), 1000);
    test.equal(room.getAdminId(), 'AdminId');
    let attendees = room.getAttendees();
    test.equal(attendees.length, 3);
    test.done();
};

exports['populate and leave room'] = function(test) {
    room.join('admin', new Object(), 'AdminId');
    room.join('player', new Object(), 'player1');
    room.join('player', new Object(), 'player2');
    test.ok(room, "room should not be null");
    room.leave('unknown');
    room.leave('player1');
    test.equal(room.getNumber(), 1000);
    test.equal(room.getAdminId(), 'AdminId');
    let attendees = room.getAttendees();
    test.equal(attendees.length, 2);
    test.done();
};

exports['multiple concurrent rooms'] = function(test) {
    let room1 = new Room(1001, 'AdminId1')
    room.join('admin', new Object(), 'AdminId');
    room.join('player', new Object(), 'player1');
    room.join('player', new Object(), 'player2');
    room1.join('admin', new Object(), 'AdminId1');
    room1.join('player', new Object(), 'player11');
    room1.join('player', new Object(), 'player12');
    test.ok(room, "room should not be null");
    room.leave('player1');
    room1.leave('player12');
    test.equal(room.getNumber(), 1000);
    test.equal(room1.getNumber(), 1001);
    test.equal(room.getAdminId(), 'AdminId');
    test.equal(room1.getAdminId(), 'AdminId1');
    let attendees = room.getAttendees();
    test.equal(attendees.length, 2);
    attendees = room1.getAttendees();
    test.equal(attendees.length, 2);
    test.done();
}