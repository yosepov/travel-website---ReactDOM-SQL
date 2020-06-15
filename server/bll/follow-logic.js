const dal = require("../dal/dal");


async function getAllFollows() {
    const sql = `SELECT
    userID,
    vacationID
     FROM follows`;
    const follows = await dal.execute(sql);
    return follows;
}


async function getFollowByOneUserAndVacation(uID, vacID) {
    const sql = `SELECT
    userID,
    vacationID
    FROM follows WHERE userID = ${uID} AND vacationID = ${vacID}`;

    const follows = await dal.execute(sql);
    return follows;
}



async function getFollowsByOneUser(uID) {
    const sql = `SELECT
    userID,
    vacationID
    FROM follows WHERE follows.userID = ${uID} `;

    const follows = await dal.execute(sql);
    return follows;
}

async function getFollowsByOneVacation(vacID) {
    const sql = `SELECT
    userID,
    vacationID
    FROM follows WHERE vacationID = ${vacID} `;

    const follows = await dal.execute(sql);
    return follows;
}


async function addFollow(follow) {
    const sql = `INSERT INTO
    follows(userID, vacationID)
    VALUES(${follow.userID},${follow.vacationID})`;
    await dal.execute(sql);
    return follow;
}


async function removeFollow(uID, vacID) {
    const sql = `DELETE FROM follows WHERE follows.userID = ${uID} AND follows.vacationID = ${vacID} LIMIT 1`;
    await dal.execute(sql);
}


async function removeFollowByVacation(vacID) {
    const sql = `DELETE FROM follows WHERE follows.vacationID = ${vacID}`;
    await dal.execute(sql);
}
module.exports = {
    getAllFollows,
    getFollowByOneUserAndVacation,
    getFollowsByOneVacation,
    addFollow,
    removeFollow,
    getFollowsByOneUser,
    removeFollowByVacation
};