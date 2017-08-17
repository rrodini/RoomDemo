/**
 * Unit tests for Rooms.js module.
 */
let Rooms = require('../Rooms');
let Room = require('../Room');
let Attendee = require('../Attendee');

let rooms;   // the singleton object

exports['setUp'] = function(callback) {
    rooms = new Rooms(new Object());
    return callback();
};

exports['tearDown'] = function(callback) {
    return callback();
};

exports['test constructor'] = function(test) {
    test.ok(rooms, "rooms should not be null");
    test.equals(rooms.getRoomCount(), 0);
    test.done();
};

exports['create one room'] = function(test) {
    let room = rooms.create('adminId');
    test.ok(room, "room should not be null");
    test.ok(room.getNumber(), 'room number should be defined');
    test.equals(rooms.getRoomCount(), 1);
    test.done();
}

exports['create two rooms and get references to each'] = function(test) {
    let room1 = rooms.create('adminId');
    test.ok(room1, "room1 should not be null");
    test.ok(room1.getNumber(), 'room1 number should be defined');
    let ref1 = rooms.get(room1.getNumber());
    test.equals(room1, ref1);
    let room2 = rooms.create('adminId');
    test.ok(room2, "room2 should not be null");
    test.ok(room2.getNumber(), 'room1 number should be defined');
    let ref2 = rooms.get(room2.getNumber());
    test.equals(room2, ref2);
    test.ok(room1.getNumber() !== room2.getNumber(), 'each room must have unique number')
    test.equals(rooms.getRoomCount(), 2);
    test.done();
}

exports['create and destroy an unpopulated room'] = function(test) {
    let room = rooms.create('adminId');
    let roomNum = room.getNumber();
    // don't populate, i.e. join, the room since socket object must be mocked.
    rooms.destroy(roomNum);
    test.equals(rooms.getRoomCount(), 0);
    test.done();
}

exports['create 3 rooms and destroy them one by one'] = function(test) {
    // don't populate, i.e. join, the room since socket object must be mocked.
    let room1 = rooms.create('adminId1');
    let room2 = rooms.create('adminId2');
    let room3 = rooms.create('adminId3');
    test.equals(rooms.getRoomCount(), 3);
    let roomNum = room1.getNumber();
    rooms.destroy(room1.getNumber());
    test.equals(rooms.getRoomCount(), 2);
    rooms.destroy(room3.getNumber());
    test.equals(rooms.getRoomCount(), 1);
    rooms.destroy(room2.getNumber());
    test.equals(rooms.getRoomCount(), 0);
    test.done();
}

