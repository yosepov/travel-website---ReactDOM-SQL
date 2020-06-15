const dal = require("../dal/dal");

async function getAllVacations() {
    const sql = `SELECT
    vacationID,description,
    location,
    startDate,
    endDate,
    image,
    price
    FROM vacations`;

    const vacations = await dal.execute(sql);
    return vacations;
}

async function addVacation(vacation, image) {
    const sql = `INSERT INTO vacations ( vacationID, description, location, image, startDate, endDate, price)
     VALUES (NULL, "${vacation.description}",'${vacation.location}','${image}',
     '${vacation.startDate}','${vacation.endDate}',${vacation.price});`
    const info = await dal.execute(sql);
    vacation.vacationID = info.insertId;
    return vacation;
}


async function getOneVacation(id) {
    const sql = `SELECT vacationID, description, location, image, startDate, endDate, price FROM vacations WHERE
    vacationID = ${id} `;
    const vacation = await dal.execute(sql);
    return vacation[0];
}

async function updatePartialVacation(vacation) {
    const sql = `update vacations set price = ${vacation.price},
        startDate = "${vacation.startDate}", endDate = "${vacation.endDate}",
        description = "${vacation.description}", image = "${vacation.image}", location = "${vacation.location}"
        where vacationID = ${vacation.vacationID}`;
    await dal.execute(sql);
    return vacation;
}




async function deleteVacation(id) {
    const sql = "delete from vacations where vacationID = " + id;
    await dal.execute(sql);
}

module.exports = {
    getAllVacations,
    addVacation,
    deleteVacation,
    updatePartialVacation,
    getOneVacation
};