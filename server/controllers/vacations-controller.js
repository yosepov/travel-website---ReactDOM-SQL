const express = require("express");
const vacationsLogic = require("../bll/vacation-logic");
const followsLogic = require("../bll/follow-logic");

const router = express.Router();

router.get("/", async(request, response) => {
    try {
        const vacations = await vacationsLogic.getAllVacations();
        response.json(vacations);
    } catch (err) {
        response.status(500).json(err.message);
    }
});

router.get("/:id", async(request, response) => {
    try {
        const id = +request.params.id;
        const vacation = await vacationsLogic.getOneVacation(id);
        response.json(vacation);
    } catch (err) {
        response.status(500).json(err.message);
    }
});



router.put("/:id", async(request, response) => {
    const id = +request.params.id;
    const vacation = request.body;
    vacation.vacationID = id;
    const updatedVacation = await vacationsLogic.updatePartialVacation(vacation);
    response.json(updatedVacation);
});

router.delete("/:id", async(request, response) => {
    const id = +request.params.id;
    await followsLogic.removeFollowByVacation(id);
    await vacationsLogic.deleteVacation(id);
    response.sendStatus(204);
});

module.exports = router;