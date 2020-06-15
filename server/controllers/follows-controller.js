const express = require("express");
const followsLogic = require("../bll/follow-logic");

const router = express.Router();

router.get("/", async(request, response) => {
    try {
        const follows = await followsLogic.getAllFollows();
        response.json(follows);
    } catch (err) {
        response.status(500).json(err.message);
    }
});

router.get("/usersfollows/:uid/:vacid", async(request, response) => {
    try {
        const uID = +request.params.uid;
        const vacID = +request.params.vacid;
        const user = await followsLogic.getFollowByOneUserAndVacation(uID, vacID);
        response.json(user);
    } catch (err) {
        response.status(500).json(err.message);
    }
});

router.get("/usersfollows/:uid", async(request, response) => {
    try {
        const uID = +request.params.uid;
        const user = await followsLogic.getFollowsByOneUser(uID);
        response.json(user);
    } catch (err) {
        response.status(500).json(err.message);
    }
});

router.get("/vacationfollows/:vacid", async(request, response) => {
    try {
        const vacID = +request.params.vacid;
        const vacation = await followsLogic.getFollowsByOneVacation(vacID);
        response.json(vacation);
    } catch (err) {
        response.status(500).json(err.message);
    }
});
router.post("/", async(request, response) => {
    try {
        const follow = request.body;
        const addedFollow = await followsLogic.addFollow(follow);
        response.status(201).json(addedFollow);
    } catch (err) {
        response.status(500).json(err.message);
    }
});


router.delete("/usersfollows/:uid/:vacid", async(request, response) => {
    const uID = +request.params.uid;
    const vacID = +request.params.vacid;
    await followsLogic.removeFollow(uID, vacID);
    response.sendStatus(204);
});



module.exports = router