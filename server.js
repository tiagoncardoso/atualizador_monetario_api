// Create express app
const express = require("express")
const cors = require('cors')
const app = express()
const db = require('./database')

app.use(cors())

// Server port
const HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server is now running on port %PORT%".replace("%PORT%", HTTP_PORT))
})

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"status": "Server is UP"})
})

app.get('/api/ipca/:ano/', (req, res, next) => {
    const query = 'SELECT indices FROM ipca WHERE ano = ?'
    let params = [req.params.ano]

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        rows.forEach((row) => {
            result = JSON.parse(row.indices)
        })

        res.json({
            message: 'success',
            indices: result
        })
    })
})

app.get('/api/inpc/:ano/', (req, res, next) => {
    const query = 'SELECT indices FROM inpc WHERE ano = ?'
    let params = [req.params.ano]

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        rows.forEach((row) => {
            result = JSON.parse(row.indices)
        })

        res.json({
            message: 'success',
            indices: result
        })
    })
})

app.get('/api/ipca/:anoInicial/:anoFinal', (req, res, next) => {
    const query = 'SELECT * FROM ipca WHERE ano BETWEEN ? AND ?'
    let params = [req.params.anoInicial, req.params.anoFinal]

    if (req.params.anoInicial > req.params.anoFinal) {
        res.status(400).json({ error: 'Para esta consulta é necessário que o ano inicial seja anterior ao ano final.' })
        return
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        rows.forEach((row) => {
            result.push({
                ano: row.ano,
                indices: JSON.parse(row.indices)
            })
        })

        res.json(result)
    })
})

app.get('/api/inpc/:anoInicial/:anoFinal/', (req, res, next) => {
    const query = 'SELECT * FROM inpc WHERE ano BETWEEN ? AND ?'
    let params = [req.params.anoInicial, req.params.anoFinal]

    if (req.params.anoInicial > req.params.anoFinal) {
        res.status(400).json({ error: 'Para esta consulta é necessário que o ano inicial seja anterior ao ano final.' })
        return
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        rows.forEach((row) => {
            result.push({
                ano: row.ano,
                indices: JSON.parse(row.indices)
            })
        })

        res.json(result)
    })
})

app.get('/api/available/ipca', (req, res, next) => {
    const query = 'SELECT ano FROM ipca'
    let params = []

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        rows.forEach((row) => {
            result.push(row.ano)
        })

        res.json({
            message: 'success',
            anos: result
        })
    })
})

app.get('/api/available/inpc', (req, res, next) => {
    const query = 'SELECT ano FROM inpc'
    let params = []

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        rows.forEach((row) => {
            result.push(row.ano)
        })

        res.json({
            message: 'success',
            anos: result
        })
    })
})

app.get('/api/estado', (req, res, next) => {
    const query = 'SELECT * FROM estado'
    let params = []

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }

        let result = []

        // rows.forEach((row) => {
        //     result.push(row)
        // })

        res.json({
            message: 'success',
            estados: rows
        })
    })
})


// Default reponse for any other request
app.use((req, res) => {
    res.status(404)
})