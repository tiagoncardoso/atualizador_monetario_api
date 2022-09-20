const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const DBSOURCE = 'db.sqlite'

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log(`Cannot conect to database: ${err}`)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE ipca (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano integer UNIQUE,
            indices text
        )`,

        (err) => {
            if (err) {
                // Table already created
            }
        })

        db.run(`CREATE TABLE inpc (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano integer UNIQUE,
            indices text
        )`,

        (err) => {
            if (err) {
                // Table already created
            }
        })
    }
})

module.exports = db