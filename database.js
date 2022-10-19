const sqlite3 = require('sqlite3').verbose()
const md5 = require('md5')

const DBSOURCE = 'db.sqlite'

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        console.log(`Cannot conect to database: ${err}`)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS ipca (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano integer UNIQUE,
            indices text
        )`,

        (err) => {
            if (err) {
                // Table already created
            }
        })

        db.run(`CREATE TABLE IF NOT EXISTS inpc (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ano integer UNIQUE,
            indices text
        )`,

        (err) => {
            if (err) {
                // Table already created
            }
        })

        db.run(`
        CREATE TABLE IF NOT EXISTS estado (
            id int auto_increment primary key,
            name varchar(100) not null,
            uf   varchar(2)   not null
        )`,
        
        (err) => {
            if (err) {
                // Table already created
            }
        })

        db.run(`insert into estado (id, name, uf)
        values
            (1, "Rondônia", "RO"),
            (2, "Acre", "AC"),
            (3, "Amazonas", "AM"),
            (4, "Roraima", "RR"),
            (5, "Pará", "PA"),
            (6, "Amapá", "AP"),
            (7, "Tocantins", "TO"),
            (8, "Maranhão", "MA"),
            (9, "Piauí", "PI"),
            (10, "Ceará", "CE"),
            (11, "Rio Grande do Norte", "RN"),
            (12, "Paraíba", "PB"),
            (13, "Pernambuco", "PE"),
            (14, "Alagoas", "AL"),
            (15, "Sergipe", "SE"),
            (16, "Bahia", "BA"),
            (17, "Minas Gerais", "MG"),
            (18, "Espírito Santo", "ES"),
            (19, "Rio de Janeiro", "RJ"),
            (20, "São Paulo", "SP"),
            (21, "Paraná", "PR"),
            (22, "Santa Catarina", "SC"),
            (23, "Rio Grande do Sul", "RS"),
            (24, "Mato Grosso do Sul", "MS"),
            (25, "Mato Grosso", "MT"),
            (26, "Goiás", "GO"),
            (27, "Distrito Federal", "DF")
        `,
        (err) => {
            if (err) {
                // Table already created
            }
        })
    }
})

module.exports = db