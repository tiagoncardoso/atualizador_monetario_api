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

        db.run(`
        CREATE TABLE IF NOT EXISTS cidade (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estado_id INTEGER NOT NULL,
            nome VARCHAR(200) NOT NULL,
            CONSTRAINT cidade_FK FOREIGN KEY (estado_id) REFERENCES estado(id)
        )`,
        
        (err) => {
            if (err) {
                // Table already created
            }
        })

        db.run(`
        CREATE TABLE IF NOT EXISTS usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario VARCHAR(40) NOT NULL,
            senha VARCHAR(150) NOT NULL,
            status VARCHAR(15) NOT NULL
        )`,
        
        (err) => {
            if (err) {
                // Table already created
            }
        })

        db.run(`
        CREATE TABLE IF NOT EXISTS contato (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            logradouro VARCHAR(150) NOT NULL,
            numero VARCHAR(15) NOT NULL,
            complemento VARCHAR(200),
            bairro VARCHAR(120) NOT NULL,
            cep VARCHAR(9) NOT NULL,
            uf INTEGER NOT NULL,
            cidade INTEGER NOT NULL,
            telefone VARCHAR NOT NULL,
            email VARCHAR,
            CONSTRAINT contato_FK FOREIGN KEY (uf) REFERENCES estado(id),
            CONSTRAINT contato_FK_1 FOREIGN KEY (cidade) REFERENCES cidade(id)
        )`,
        
        (err) => {
            if (err) {
                // Table already created
            }
        })

        db.run(`
        CREATE TABLE IF NOT EXISTS pessoa (
            id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            nome VARCHAR(250) NOT NULL,
            email VARCHAR(60) NOT NULL,
            email2 VARCHAR(60),
            nascimento DATE NOT NULL,
            genero VARCHAR(30) NOT NULL,
            cpf VARCHAR(14) NOT NULL,
            rg VARCHAR(30) NOT NULL,
            uf_rg INTEGER NOT NULL,
            contato INTEGER NOT NULL,
            usuario INTEGER NOT NULL,
            CONSTRAINT pessoa_FK FOREIGN KEY (uf_rg) REFERENCES estado(id),
            CONSTRAINT pessoa_FK_1 FOREIGN KEY (contato) REFERENCES contato(id),
            CONSTRAINT pessoa_FK_2 FOREIGN KEY (usuario) REFERENCES usuario(id)
        )`,
        
        (err) => {
            if (err) {
                // Table already created
            }
        })
    }
})

module.exports = db