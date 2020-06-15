const express = require("express");
const userController = require("./controllers/user-controller");
const vacationController = require("./controllers/vacations-controller");
const followController = require("./controllers/follows-controller");
const usersLogic = require("./bll/user-logic");
const vacationsLogic = require("./bll/vacation-logic");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const server = express();
const socketIO = require("socket.io");
const http = require("http");
const ejs = require("ejs");



const cors = require("cors");



server.use(express.json());

server.use(cors());

server.use("/api/users", userController);
server.use("/api/vacations", vacationController);
server.use("/api/follows", followController);

// Upload An Image ////////////////////////////////////
// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './assets/images',
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000000 },
    fileFilter: function(req, file, callback) {
        checkFileType(file, callback);
    }
}).single('myImage');
// Check File Type
function checkFileType(file, callback) {
    // Allowed and check extansions
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return callback(null, true);
    } else {
        callback('Error: Images Only!');
    }
}
// EJS + Public folder
server.set('view engine', "ejs");
server.use(express.static('./assets/images'));

server.get('/', (request, response) => response.render('index'));
// Send request and response and upload the img
server.post('/upload', (request, response) => {
    upload(request, response, (err) => {
        if (err) {
            response.render('index', {
                msg: err
            });
        } else {
            if (request.file == undefined) {
                response.render('index', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                response.render('index', {
                    msg: 'File Uploaded!',
                    file: `assets/images/${request.file.filename}`
                });
                console.log(request.file.filename)
                console.log("vac: ", JSON.parse(request.body.addedVacation));
                vacationsLogic.addVacation(JSON.parse(request.body.addedVacation), request.file.filename);
            }
        }
    });
});



const httpServer = http.createServer(server).listen(3007, () => console.log(" socketing.."))
const socketServer = socketIO.listen(httpServer);
const allSockets = [];
server.use(express.static(__dirname));

socketServer.sockets.on("connection", async socket => {
    allSockets.push(socket);
    console.log("one client has been connected.", allSockets.length);


    socket.on("user-check", async user => {
        let isAvailavle = "";
        isAvailavle = await usersLogic.getOneUser(user);
        console.log("is Available: " + isAvailavle);
        socketServer.sockets.emit("user-check", isAvailavle < 1 ? false : true);
    });

    socket.on("admin-made-changes", async() => {
        console.log("admin made change");
        socketServer.sockets.emit("admin-made-changes", await vacationsLogic.getAllVacations());
    });

    socket.on("disconnect", () => {
        const index = allSockets.indexOf(socket);
        allSockets.splice(index, 1);
        console.log("one client has disconnected - Number of users: ", allSockets.length);
    });


});


server.listen(3001, () => console.log("Listening on http://localhost:3001"));