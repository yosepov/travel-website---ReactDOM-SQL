const express = require("express");
const usersLogic = require("../bll/user-logic");

const router = express.Router();

router.get("/", async(request, response) => {
    try {
        const users = await usersLogic.getAllUsers();
        response.json(users);
    } catch (err) {
        response.status(500).json(err.message);
    }
});

router.get("/:id", async(request, response) => {
    try {
        const id = +request.params.id;
        const user = await usersLogic.getOneUser(id);
        response.json(user);
    } catch (err) {
        response.status(500).json(err.message);
    }
});

router.post("/", async(request, response) => {
    try {
        const user = request.body;
        const addedUser = await usersLogic.addUser(user);
        response.status(201).json(addedUser);
    } catch (err) {
        response.status(500).json(err.message);
    }
});




module.exports = router;