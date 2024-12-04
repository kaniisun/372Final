// connect to db
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'flourishs.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to connect", err.message);
    } else {
        console.log("Connected");
    }
});

module.exports = db;