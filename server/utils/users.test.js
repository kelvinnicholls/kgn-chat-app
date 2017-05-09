let expect = require('expect');

const {
    Users
} = require('./users');

let users;

beforeEach(() => {
    users = new Users();

    users.users = [{
            id: "1",
            name: "Mike",
            room: "Room 1"
        },
        {
            id: "2",
            name: "Julie",
            room: "Room 2"
        },
        {
            id: "3",
            name: "Steve",
            room: "Room 1"
        }
    ]
});

describe('Users', () => {
    it('should add new user', () => {
        let users = new Users();
        let user = {
            id: "123",
            name: "Kelv",
            room: "All Leeds Aren't We"
        };
        let resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    });

    it('should return names for Room 1', () => {
        let userList = users.getUserList("Room 1");
        expect(userList).toEqual(['Mike', 'Steve']);
    });

    it('should return names for Room 2', () => {
        let userList = users.getUserList("Room 2");
        expect(userList).toEqual(['Julie']);
    });

    it('should remove a user', () => {
        let user = users.removeUser("1");
        expect(users.users.length).toBe(2);
        expect(user).toEqual({
            id: "1",
            name: "Mike",
            room: "Room 1"
        });
    });

    it('should not remove a user', () => {
        let user = users.removeUser("4");
        expect(users.users.length).toBe(3);
        expect(user).toBe(undefined);
        expect(user).toNotExist();
    });

    it('should find a user', () => {
        let user = users.getUser("1");
        expect(user).toEqual({
            id: "1",
            name: "Mike",
            room: "Room 1"
        });
        expect(users.users.length).toBe(3);
    });

    it('should not find a user', () => {
        let user = users.getUser("4");
        expect(user).toBe(undefined);
        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });
});