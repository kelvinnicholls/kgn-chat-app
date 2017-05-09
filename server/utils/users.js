//const _ = require('lodash');

class Users {
    constructor() {
        this.users = [];
    }
    addUser(id, name, room) {
        let user = {
            id,
            name,
            room
        };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        // user = getUser(id);
        // users = _.remove(users, function (user) {
        //     return user.id !== id;
        // });
        // return user; {}
        let user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
        // index = _.findIndex(users, ['id', id]);
        // return users[index];
    }

    getUserList(room) {
        let usersForRoom = this.users.filter((user) => user.room === room);
        let namesArray = usersForRoom.map((user) => user.name);
        return namesArray;
        // usersForRoom = _.remove(users, function (user) {
        //     return user.room !== room;
        // });
        // return usersForRoom;
    }
}

module.exports = {
    Users
};