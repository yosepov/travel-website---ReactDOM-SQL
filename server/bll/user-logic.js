const dal = require("../dal/dal");

async function getAllUsers() {
    const sql = `SELECT
    userID,
    firstName,
    lastName,
    username,
    password FROM users`;
    const users = await dal.execute(sql);
    return users;
}

async function getOneUser(id) {
    const sql = `SELECT
    userID,
    firstName,
    lastName,
    username,
    password
    FROM users WHERE userID = ${id}`;

    const users = await dal.execute(sql);
    return users;
}

async function addUser(user) {
    const sql = `INSERT INTO
    users(firstName, lastName,username,password)
    VALUES('${user.firstName}','${user.lastName}','${user.username}','${user.password}')`;
    const info = await dal.execute(sql);
    user.userID = info.insertId;
    return user;
}

module.exports = {
    getOneUser,
    addUser,
    getAllUsers
};