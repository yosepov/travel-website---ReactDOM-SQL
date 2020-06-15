const mysql = require("mysql");

// Create a comm line to MySQL Database: 
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "travelgo"
});

// Connecting to the database: 
connection.connect(err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("We're connected to MySQL");
});

// Execute a command (select / insert / update / delete):
function execute(sql) {

    // Returning a promise: 
    return new Promise((resolve, reject) => {

        // Execute one query: 
        connection.query(sql, (err, result) => {

            // If there is an error - call reject: 
            if (err) {
                reject(err);
                return;
            }

            // If query succeeds - send back its result: 
            resolve(result);
        });
    });
}

module.exports = { execute };